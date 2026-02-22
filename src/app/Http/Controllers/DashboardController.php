<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $q = trim((string) $request->query('q', ''));

        $projectsQuery = Project::query()
            ->where('user_id', $user->id)
            ->withCount([
                'tasks',
                'tasks as tasks_completed' => fn ($q) => $q->where('status', 'completed'),
            ]);

        if ($q !== '') {
            $projectsQuery->where(function ($query) use ($q): void {
                $query
                    ->where('title', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%")
                    ->orWhereHas('tasks', function ($taskQuery) use ($q): void {
                        $taskQuery
                            ->where('title', 'like', "%{$q}%")
                            ->orWhere('description', 'like', "%{$q}%");
                    });
            });
        }

        $projects = $projectsQuery
            ->latest()
            ->limit(8)
            ->get();

        $tasksBase = Task::query()->whereHas('project', function ($query) use ($user): void {
            $query->where('user_id', $user->id);
        });

        if ($q !== '') {
            $tasksBase->where(function ($query) use ($q): void {
                $query
                    ->where('title', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%");
            });
        }

        $projectsCount = Project::query()->where('user_id', $user->id)->count();
        $tasksCount = (clone $tasksBase)->count();
        $completedCount = (clone $tasksBase)->where('status', 'completed')->count();
        $pendingCount = (clone $tasksBase)->where('status', 'pending')->count();

        $priorityCounts = (clone $tasksBase)
            ->selectRaw('priority, COUNT(*) as count')
            ->groupBy('priority')
            ->pluck('count', 'priority');

        $priorities = ['low', 'medium', 'high'];
        $priorityData = collect($priorities)->map(fn ($p) => [
            'label' => ucfirst($p),
            'key' => $p,
            'value' => (int) ($priorityCounts[$p] ?? 0),
        ])->values();

        $weeks = collect(range(6, 0))->map(function (int $weeksAgo) {
            $start = Carbon::now()->subWeeks($weeksAgo)->startOfWeek();
            $end = (clone $start)->endOfWeek();
            return [
                'label' => $start->format('M j'),
                'start' => $start,
                'end' => $end,
            ];
        });

        $weeklyData = $weeks->map(function (array $week) use ($user) {
            $createdProjects = Project::query()
                ->where('user_id', $user->id)
                ->whereBetween('created_at', [$week['start'], $week['end']])
                ->count();

            $created = Task::query()
                ->whereHas('project', fn ($q) => $q->where('user_id', $user->id))
                ->whereBetween('created_at', [$week['start'], $week['end']])
                ->count();

            $completed = Task::query()
                ->whereHas('project', fn ($q) => $q->where('user_id', $user->id))
                ->where('status', 'completed')
                ->whereBetween('updated_at', [$week['start'], $week['end']])
                ->count();

            return [
                'label' => $week['label'],
                'created_projects' => $createdProjects,
                'created' => $created,
                'completed' => $completed,
            ];
        })->values();

        $priorityByProject = Project::query()
            ->where('user_id', $user->id)
            ->withCount([
                'tasks as low' => fn ($q) => $q->where('priority', 'low'),
                'tasks as medium' => fn ($q) => $q->where('priority', 'medium'),
                'tasks as high' => fn ($q) => $q->where('priority', 'high'),
                'tasks as total' => fn ($q) => $q,
            ])
            ->orderBy('updated_at', 'desc')
            ->limit(10)
            ->get()
            ->map(fn (Project $p) => [
                'id' => $p->id,
                'title' => $p->title,
                'low' => (int) ($p->low ?? 0),
                'medium' => (int) ($p->medium ?? 0),
                'high' => (int) ($p->high ?? 0),
                'total' => (int) ($p->total ?? 0),
            ])
            ->values();

        $progressByProject = Project::query()
            ->where('user_id', $user->id)
            ->withCount([
                'tasks as tasks_total',
                'tasks as tasks_completed' => fn ($q) => $q->where('status', 'completed'),
            ])
            ->orderBy('updated_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function (Project $project) {
                $total = (int) $project->tasks_total;
                $completed = (int) $project->tasks_completed;
                $pct = $total === 0 ? 0 : (int) round(($completed / $total) * 100);
                return [
                    'id' => $project->id,
                    'title' => $project->title,
                    'total' => $total,
                    'completed' => $completed,
                    'pct' => $pct,
                ];
            })
            ->values();

        return Inertia::render('Dashboard', [
            'q' => $q,
            'stats' => [
                'projects' => $projectsCount,
                'tasks' => $tasksCount,
                'completed' => $completedCount,
                'pending' => $pendingCount,
            ],
            'charts' => [
                'priority' => $priorityData,
                'priority_projects' => $priorityByProject,
                'weekly' => $weeklyData,
                'progress' => $progressByProject,
            ],
            'projects' => $projects,
        ]);
    }
}
