<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // only return projects belonging to the authenticated user
        $projects = auth()->user()->projects()->with('tasks')->get();

        return inertia('Projects/Index', [
            'projects' => $projects,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        auth()->user()->projects()->create($request->validated());

        return redirect()->back();
    }
    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        // the user must own the project before showing details
        $this->authorize('view', $project);

        $project->load('tasks');

        return inertia('Tasks/Index', [
            'project' => $project,
        ]);
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        // ensure the authenticated user owns this project
        $this->authorize('update', $project);

        $project->update($request->validated());

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        // only the owner may delete
        $this->authorize('delete', $project);

        $project->delete();

        return redirect()->back();
    }
}
