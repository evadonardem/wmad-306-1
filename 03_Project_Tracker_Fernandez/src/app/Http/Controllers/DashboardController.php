<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = $request->user();

        $projectCounts = Project::query()
            ->where('user_id', $user->id)
            ->withCount([
                'tasks',
                'tasks as tasks_completed_count' => fn ($query) => $query->where('status', true),
            ])
            ->get(['id']);

        $projectsTotal = $projectCounts->count();
        $projectsCompleted = $projectCounts
            ->filter(fn ($project) => $project->tasks_count > 0 && $project->tasks_completed_count === $project->tasks_count)
            ->count();
        $projectsUnfinished = $projectsTotal - $projectsCompleted;

        $tasksTotal = Task::query()
            ->whereHas('project', fn ($query) => $query->where('user_id', $user->id))
            ->count();

        $tasksCompleted = Task::query()
            ->whereHas('project', fn ($query) => $query->where('user_id', $user->id))
            ->where('status', true)
            ->count();

        $tasksOpen = $tasksTotal - $tasksCompleted;

        $openByPriority = Task::query()
            ->whereHas('project', fn ($query) => $query->where('user_id', $user->id))
            ->where('status', false)
            ->selectRaw("priority, COUNT(*) as aggregate")
            ->groupBy('priority')
            ->pluck('aggregate', 'priority');

        $recentProjects = Project::query()
            ->where('user_id', $user->id)
            ->withCount([
                'tasks',
                'tasks as tasks_completed_count' => fn ($query) => $query->where('status', true),
            ])
            ->get(['id', 'title', 'updated_at'])
            ->map(function ($project) {
                $total = (int) $project->tasks_count;
                $done = (int) $project->tasks_completed_count;
                $progress = $total > 0 ? (int) round(($done / $total) * 100) : 0;
                $isFinished = $total > 0 && $done === $total;

                return [
                    'id' => $project->id,
                    'title' => $project->title,
                    'updated_at' => optional($project->updated_at)->toIso8601String(),
                    'tasks_total' => $total,
                    'tasks_done' => $done,
                    'progress' => $progress,
                    'is_finished' => $isFinished,
                ];
            })
            ->sort(function ($left, $right) {
                if ($left['is_finished'] !== $right['is_finished']) {
                    return $left['is_finished'] <=> $right['is_finished'];
                }

                return strcmp($right['updated_at'] ?? '', $left['updated_at'] ?? '');
            })
            ->take(5)
            ->values();

        $topOpenTasks = Task::query()
            ->whereHas('project', fn ($query) => $query->where('user_id', $user->id))
            ->where('status', false)
            ->with('project:id,title')
            ->orderByRaw("CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END")
            ->orderByDesc('updated_at')
            ->limit(6)
            ->get(['id', 'project_id', 'title', 'priority', 'updated_at'])
            ->map(fn ($task) => [
                'id' => $task->id,
                'title' => $task->title,
                'priority' => $task->priority,
                'updated_at' => optional($task->updated_at)->toIso8601String(),
                'project' => $task->project?->only(['id', 'title']),
            ])
            ->values();

        return Inertia::render('Dashboard', [
            'stats' => [
                'projects' => [
                    'total' => $projectsTotal,
                    'unfinished' => $projectsUnfinished,
                    'finished' => $projectsCompleted,
                ],
                'tasks' => [
                    'total' => $tasksTotal,
                    'open' => $tasksOpen,
                    'completed' => $tasksCompleted,
                    'openByPriority' => [
                        'high' => (int) ($openByPriority['high'] ?? 0),
                        'medium' => (int) ($openByPriority['medium'] ?? 0),
                        'low' => (int) ($openByPriority['low'] ?? 0),
                    ],
                ],
            ],
            'recentProjects' => $recentProjects,
            'topOpenTasks' => $topOpenTasks,
        ]);
    }
}
