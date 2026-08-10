<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Services\PaynowService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaynowController extends Controller
{
    public function __construct(private PaynowService $paynow) {}

    /**
     * Initiate a PayNow payment.
     * POST /api/paynow/initiate
     */
    public function initiate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount'      => ['required', 'numeric', 'min:0.01'],
            'description' => ['required', 'string', 'max:255'],
            'package_id'  => ['nullable', 'integer', 'exists:packages,id'],
        ]);

        $user   = $request->user();
        $amount = (float) $validated['amount'];

        // Generate a unique reference
        $reference = 'PAY-' . strtoupper(uniqid()) . '-' . $user->id;

        // Record the payment intent
        $payment = Payment::create([
            'user_id'       => $user->id,
            'reference'     => $reference,
            'amount'        => $amount,
            'currency'      => 'USD',
            'method'        => 'paynow',
            'status'        => 'pending',
            'description'   => $validated['description'],
            'package_id'    => $validated['package_id'] ?? null,
        ]);

        $result = $this->paynow->initiatePayment(
            $reference,
            $validated['description'],
            $amount
        );

        if (! $result['success']) {
            $payment->update(['status' => 'failed', 'notes' => $result['error'] ?? 'Initiation failed']);
            return response()->json(['message' => $result['error'] ?? 'Payment initiation failed.'], 422);
        }

        // Save poll URL for later status checks
        $payment->update([
            'poll_url'  => $result['poll_url'] ?? null,
            'status'    => 'initiated',
        ]);

        return response()->json([
            'message'      => 'Payment initiated. Redirecting to PayNow.',
            'redirect_url' => $result['redirect_url'],
            'reference'    => $reference,
        ]);
    }

    /**
     * PayNow redirects the user back here after payment (GET).
     * GET /api/paynow/return
     */
    public function return(Request $request): JsonResponse
    {
        $pollUrl = $request->query('poll_url');

        if ($pollUrl) {
            $status = $this->paynow->pollTransaction($pollUrl);
        }

        return response()->json([
            'message' => 'Payment processing. Check your payment status.',
            'status'  => $status ?? 'unknown',
        ]);
    }

    /**
     * PayNow server-to-server status callback (POST).
     * POST /api/paynow/status
     */
    public function status(Request $request): JsonResponse
    {
        $update = $this->paynow->processStatusUpdate();

        if ($update['reference']) {
            $payment = Payment::where('reference', $update['reference'])->first();

            if ($payment) {
                $payment->update([
                    'status'      => match (strtolower($update['status'])) {
                        'paid', 'awaiting delivery', 'delivered' => 'completed',
                        'cancelled', 'failed' => 'failed',
                        default => $payment->status,
                    },
                    'poll_url'    => $update['poll_url'],
                    'paid_at'     => in_array(strtolower($update['status']), ['paid', 'awaiting delivery', 'delivered']) ? now() : $payment->paid_at,
                ]);

                // If payment completed, activate subscription
                if ($payment->status === 'completed' && $payment->package_id) {
                    $this->activateSubscription($payment);
                }
            }
        }

        // PayNow expects this exact response
        return response()->json(['status' => 'ok']);
    }

    /**
     * Poll payment status (used by frontend to check).
     * GET /api/paynow/check?reference=PAY-xxx
     */
    public function check(Request $request): JsonResponse
    {
        $request->validate(['reference' => ['required', 'string']]);

        $payment = Payment::where('reference', $request->reference)
            ->where('user_id', $request->user()->id)
            ->first();

        if (! $payment) {
            return response()->json(['message' => 'Payment not found.'], 404);
        }

        // If we have a poll URL, check with PayNow
        if ($payment->poll_url && $payment->status === 'initiated') {
            $status = $this->paynow->pollTransaction($payment->poll_url);

            if ($status === 'paid' || $status === 'awaiting delivery' || $status === 'delivered') {
                $payment->update(['status' => 'completed', 'paid_at' => now()]);

                if ($payment->package_id) {
                    $this->activateSubscription($payment);
                }
            } elseif ($status === 'cancelled' || $status === 'failed') {
                $payment->update(['status' => 'failed']);
            }
        }

        return response()->json([
            'reference' => $payment->reference,
            'status'    => $payment->status,
            'amount'    => $payment->amount,
        ]);
    }

    /**
     * Activate a subscription after successful payment.
     */
    private function activateSubscription(Payment $payment): void
    {
        $package = \App\Models\Package::find($payment->package_id);
        if (! $package) return;

        $user      = $payment->user;
        $provider  = $user->provider;

        if ($provider) {
            $days = match ($package->billing_period) {
                'monthly'   => 30,
                'quarterly' => 90,
                'yearly'    => 365,
                default     => 30,
            };

            $provider->update([
                'subscription_tier'    => $package->slug ?? 'premium_monthly',
                'subscription_expiry'  => now()->addDays($days),
                'is_featured'          => $package->is_featured ?? false,
            ]);
        }
    }
}
