<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Project::class);

        $projects = Project::query()
            ->where('user_id', Auth::id())
            ->withCount([
                'tasks',
                'tasks as tasks_completed_count' => fn ($query) => $query->where('status', true),
            ])
            ->get([
                'id',
                'title',
                'description',
                'created_at',
            ])
            ->sort(function ($left, $right) {
                $leftCompleted = $left->tasks_count > 0 && $left->tasks_completed_count === $left->tasks_count;
                $rightCompleted = $right->tasks_count > 0 && $right->tasks_completed_count === $right->tasks_count;

                if ($leftCompleted !== $rightCompleted) {
                    return $leftCompleted <=> $rightCompleted;
                }

                return $right->created_at <=> $left->created_at;
            })
            ->values();

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return redirect()->route('projects.index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Project::class);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $request->user()->projects()->create($validated);

        return redirect()->route('projects.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        $this->authorize('view', $project);

        $project->load([
            'tasks' => function ($query) {
                $query
                    ->orderByRaw('CASE WHEN status = 0 THEN 0 ELSE 1 END')
                    ->latest();
            },
        ]);

        return Inertia::render('Projects/Show', [
            'project' => $project->only(['id', 'title', 'description', 'created_at']),
            'tasks' => $project->tasks
                ->map(fn ($task) => $task->only(['id', 'title', 'description', 'priority', 'status', 'created_at']))
                ->values(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        return redirect()->route('projects.show', $project);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $project->update($validated);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);

        $project->delete();

        return redirect()->route('projects.index');
    }
}
