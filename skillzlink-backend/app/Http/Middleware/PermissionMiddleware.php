<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PermissionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$permissions): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        if ($user->role === 'super_admin') {
            return $next($request);
        }

        $userPermissions = $user->permissions; // Uses getPermissionsAttribute()

        // Check if user has ANY of the required permissions
        $hasPermission = false;
        foreach ($permissions as $permission) {
            if (in_array($permission, $userPermissions)) {
                $hasPermission = true;
                break;
            }
        }

        if (!$hasPermission && !empty($permissions)) {
            return response()->json(['message' => 'Forbidden. You lack the required permissions.'], 403);
        }

        return $next($request);
    }
}
