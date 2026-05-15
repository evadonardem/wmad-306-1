<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponder
{
    protected function ok(mixed $data, string $message = 'Success'): JsonResponse
    {
        return response()->json([
            'status'  => 'ok',
            'message' => $message,
            'data'    => $data,
        ]);
    }

    protected function created(mixed $data, string $message = 'Created'): JsonResponse
    {
        return response()->json([
            'status'  => 'ok',
            'message' => $message,
            'data'    => $data,
        ], 201);
    }

    protected function deleted(string $message = 'Deleted successfully'): JsonResponse
    {
        return response()->json([
            'status'  => 'ok',
            'message' => $message,
        ]);
    }

    protected function notFound(string $resource = 'Resource'): JsonResponse
    {
        return response()->json([
            'status'  => 'error',
            'message' => "{$resource} not found or you do not have access to it.",
        ], 404);
    }

    protected function conflict(string $message): JsonResponse
    {
        return response()->json([
            'status'  => 'error',
            'message' => $message,
        ], 422);
    }
}
