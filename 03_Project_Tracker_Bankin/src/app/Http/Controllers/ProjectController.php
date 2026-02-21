<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('tasks')->get();
        return view('projects.index', compact('projects'));
    }

    public function create()
    {
        return view('projects.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|max:255',
            'description' => 'required',
            'status' => 'required|in:pending,in_progress,completed',
            'difficulty' => 'required|in:easy,medium,hard',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        Project::create($validated);

        return redirect()->route('home');
    }

    public function show(Project $project)
    {
        return view('projects.show', compact('project'));
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return response()->json(['success' => true]);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|max:255',
            'description' => 'sometimes|required',
            'status' => 'sometimes|required|in:pending,in_progress,completed',
            'difficulty' => 'sometimes|required|in:easy,medium,hard',
            'end_date' => 'sometimes|nullable|date',
            'progress' => 'sometimes|integer|min:0|max:100',
            'is_favorite' => 'sometimes|boolean',
        ]);

        $project->update($validated);

        return response()->json(['message' => 'Project updated', 'project' => $project]);
    }
}
