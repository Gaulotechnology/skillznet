<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\RagService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RagController extends Controller
{
    public function ask(Request $request, RagService $rag): JsonResponse
    {
        $validated = $request->validate([
            'question' => ['required', 'string', 'max:2000'],
        ]);

        $result = $rag->query($validated['question']);

        return response()->json($result);
    }

    public function buildIndex(RagService $rag): JsonResponse
    {
        $count = $rag->buildKnowledgeBase();

        return response()->json([
            'message' => "Knowledge base built successfully.",
            'chunks_indexed' => $count,
        ]);
    }

    public function status(RagService $rag): JsonResponse
    {
        $count = \App\Models\DocumentChunk::count();
        $hasApiKey = !empty(env('DEEPSEEK_API_KEY'));

        return response()->json([
            'chunks_stored' => $count,
            'deepseek_configured' => $hasApiKey,
            'mode' => $hasApiKey ? 'deepseek' : 'local',
        ]);
    }
}
