<?php

namespace App\Http\Controllers;

use App\Models\ProjectChange;
use Illuminate\Http\Request;

class ProjectChangeController extends Controller
{
    // List changes for a project
    public function index($projectId)
    {
        $changes = ProjectChange::where('project_id', $projectId)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($changes);
    }

    // Store a new change (optional, for manual logging)
    public function store(Request $request, $projectId)
    {
        $validated = $request->validate([
            'change_type' => 'required|string',
            'description' => 'nullable|string',
        ]);
        $change = ProjectChange::create([
            'project_id' => $projectId,
            'change_type' => $validated['change_type'],
            'description' => $validated['description'] ?? null,
            'user_id' => auth()->id(),
        ]);
        return response()->json($change, 201);
    }
}
