<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\AuditLog;
use App\Models\Comment;
use App\Models\EditorialActionLog;
use App\Models\User;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class AdminDashboardController extends Controller
{
    private const MANAGED_ROLES = ['admin', 'writer', 'editor', 'student'];
    private const ACCOUNT_STATUSES = ['active', 'suspended', 'pending', 'deleted'];

    public function __construct(private readonly AuditLogger $auditLogger)
    {
    }

    /** Render the admin dashboard view. */
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => $this->buildDashboardStats(),
            'activity' => $this->buildWeeklyActivity(),
            'recentUsers' => $this->buildRecentUsers(),
            'recentArticles' => $this->buildRecentArticles(),
            'editorialLogs' => $this->buildEditorialLogs(),
            'systemAuditLogs' => $this->buildSystemAuditLogs(),
        ]);
    }

    /** Render the admin user-management view. */
    public function users(): Response
    {
        return Inertia::render('Admin/users', $this->buildAdminUserPayload());
    }

    /** Render system-level audit logs for non-editorial accountability. */
    public function auditLogs(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $action = (string) $request->query('action', 'all');
        $actorId = (int) $request->query('actor', 0);
        $entityType = trim((string) $request->query('entity_type', ''));
        $dateFrom = (string) $request->query('date_from', '');
        $dateTo = (string) $request->query('date_to', '');
        $perPage = (int) $request->query('per_page', 25);
        $sort = (string) $request->query('sort', 'newest');

        $sort = Arr::first(['newest', 'oldest'], fn (string $value) => $value === $sort) ?? 'newest';
        $perPage = in_array($perPage, [10, 25, 50, 100], true) ? $perPage : 25;

        $query = AuditLog::query()->with('actor:id,name,email');

        if ($search !== '') {
            $query->where(function ($q) use ($search): void {
                $q->where('action', 'like', '%'.$search.'%')
                    ->orWhere('entity_label', 'like', '%'.$search.'%')
                    ->orWhere('note', 'like', '%'.$search.'%')
                    ->orWhereHas('actor', function ($actorQuery) use ($search): void {
                        $actorQuery->where('name', 'like', '%'.$search.'%')
                            ->orWhere('email', 'like', '%'.$search.'%');
                    });
            });
        }

        if ($action !== '' && $action !== 'all') {
            $query->where('action', $action);
        }

        if ($actorId > 0) {
            $query->where('acting_user_id', $actorId);
        }

        if ($entityType !== '') {
            $query->where('entity_type', $entityType);
        }

        if ($dateFrom !== '') {
            $query->where('created_at', '>=', Carbon::parse($dateFrom)->startOfDay());
        }
        if ($dateTo !== '') {
            $query->where('created_at', '<=', Carbon::parse($dateTo)->endOfDay());
        }

        $query->orderBy('created_at', $sort === 'oldest' ? 'asc' : 'desc');
        $logs = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Admin/AuditLogs', [
            'logs' => $logs,
            'filters' => [
                'search' => $search,
                'action' => $action,
                'actor' => $actorId > 0 ? (string) $actorId : '',
                'entity_type' => $entityType,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'sort' => $sort,
                'per_page' => $perPage,
            ],
            'actionOptions' => AuditLog::query()->select('action')->distinct()->orderBy('action')->pluck('action')->values(),
            'actorOptions' => User::query()
                ->whereHas('roles', fn ($q) => $q->whereIn('name', self::MANAGED_ROLES))
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (User $user): array => ['value' => (string) $user->id, 'label' => $user->name])
                ->values(),
            'entityTypeOptions' => AuditLog::query()
                ->select('entity_type')
                ->whereNotNull('entity_type')
                ->distinct()
                ->orderBy('entity_type')
                ->pluck('entity_type')
                ->values(),
        ]);
    }

    /** Render full editorial accountability log table with filters and pagination. */
    public function editorialLogs(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $action = (string) $request->query('action', 'all');
        $editorId = (int) $request->query('editor', 0);
        $statusFrom = trim((string) $request->query('status_from', ''));
        $statusTo = trim((string) $request->query('status_to', ''));
        $dateFrom = (string) $request->query('date_from', '');
        $dateTo = (string) $request->query('date_to', '');
        $sort = (string) $request->query('sort', 'newest');
        $perPage = (int) $request->query('per_page', 25);

        $sort = Arr::first(
            ['newest', 'oldest', 'article_asc', 'article_desc', 'editor_asc', 'editor_desc', 'action_asc', 'action_desc'],
            fn (string $value) => $value === $sort
        ) ?? 'newest';
        $perPage = in_array($perPage, [10, 25, 50, 100], true) ? $perPage : 25;

        $query = EditorialActionLog::query()->with(['actor:id,name,email', 'article:id,title']);
        $this->applyEditorialLogFilters($query, [
            'search' => $search,
            'action' => $action,
            'editorId' => $editorId,
            'statusFrom' => $statusFrom,
            'statusTo' => $statusTo,
            'dateFrom' => $dateFrom,
            'dateTo' => $dateTo,
            'sort' => $sort,
        ]);

        $logs = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Admin/EditorialLogs', [
            'logs' => $logs,
            'filters' => [
                'search' => $search,
                'action' => $action,
                'editor' => $editorId > 0 ? (string) $editorId : '',
                'status_from' => $statusFrom,
                'status_to' => $statusTo,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'sort' => $sort,
                'per_page' => $perPage,
            ],
            'actionOptions' => EditorialActionLog::query()
                ->select('action')
                ->distinct()
                ->orderBy('action')
                ->pluck('action')
                ->values(),
            'editorOptions' => User::query()
                ->role('editor')
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (User $user): array => ['value' => (string) $user->id, 'label' => $user->name])
                ->values(),
            'sortOptions' => [
                ['value' => 'newest', 'label' => 'Newest first'],
                ['value' => 'oldest', 'label' => 'Oldest first'],
                ['value' => 'article_asc', 'label' => 'Article A-Z'],
                ['value' => 'article_desc', 'label' => 'Article Z-A'],
                ['value' => 'editor_asc', 'label' => 'Editor A-Z'],
                ['value' => 'editor_desc', 'label' => 'Editor Z-A'],
                ['value' => 'action_asc', 'label' => 'Action A-Z'],
                ['value' => 'action_desc', 'label' => 'Action Z-A'],
            ],
        ]);
    }

    /** Export editorial logs to CSV with the same filters used in the accountability view. */
    public function exportEditorialLogs(Request $request)
    {
        $search = trim((string) $request->query('search', ''));
        $action = (string) $request->query('action', 'all');
        $editorId = (int) $request->query('editor', 0);
        $statusFrom = trim((string) $request->query('status_from', ''));
        $statusTo = trim((string) $request->query('status_to', ''));
        $dateFrom = (string) $request->query('date_from', '');
        $dateTo = (string) $request->query('date_to', '');
        $sort = (string) $request->query('sort', 'newest');

        $sort = Arr::first(
            ['newest', 'oldest', 'article_asc', 'article_desc', 'editor_asc', 'editor_desc', 'action_asc', 'action_desc'],
            fn (string $value) => $value === $sort
        ) ?? 'newest';

        $query = EditorialActionLog::query()->with(['actor:id,name,email']);
        $this->applyEditorialLogFilters($query, [
            'search' => $search,
            'action' => $action,
            'editorId' => $editorId,
            'statusFrom' => $statusFrom,
            'statusTo' => $statusTo,
            'dateFrom' => $dateFrom,
            'dateTo' => $dateTo,
            'sort' => $sort,
        ]);

        $filename = 'editorial-logs-'.now()->format('Ymd-His').'.csv';

        return response()->streamDownload(function () use ($query): void {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, [
                'Timestamp',
                'Article ID',
                'Article Title',
                'Acting User',
                'Acting Email',
                'Acting Role',
                'Action',
                'Previous Status',
                'New Status',
                'Note',
            ]);

            $query->chunk(500, function ($logs) use ($handle): void {
                foreach ($logs as $log) {
                    fputcsv($handle, [
                        optional($log->created_at)->toDateTimeString(),
                        $log->article_id,
                        $log->article_title,
                        $log->actor?->name,
                        $log->actor?->email,
                        $log->acting_role,
                        $log->action,
                        $log->previous_status,
                        $log->new_status,
                        $log->note,
                    ]);
                }
            });

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }

    private function managedUsersQuery()
    {
        return User::query()->whereHas('roles', function ($query): void {
            $query->whereIn('name', self::MANAGED_ROLES);
        });
    }

    private function buildDashboardStats(): array
    {
        $managedUsers = $this->managedUsersQuery();

        $totalUsers = (clone $managedUsers)
            ->where('account_status', '!=', 'deleted')
            ->count();

        $activeUsers = (clone $managedUsers)
            ->where('account_status', 'active')
            ->count();

        $pendingUsers = (clone $managedUsers)
            ->where('account_status', 'pending')
            ->count();

        $writers = (clone $managedUsers)
            ->where('account_status', '!=', 'deleted')
            ->whereHas('roles', fn ($q) => $q->where('name', 'writer'))
            ->count();

        $editors = (clone $managedUsers)
            ->where('account_status', '!=', 'deleted')
            ->whereHas('roles', fn ($q) => $q->where('name', 'editor'))
            ->count();

        $students = (clone $managedUsers)
            ->where('account_status', '!=', 'deleted')
            ->whereHas('roles', fn ($q) => $q->where('name', 'student'))
            ->count();

        $today = Carbon::today();

        $totalArticles = Article::query()->count();
        $publishedArticles = Article::query()->whereNotNull('published_at')->count();
        $pendingArticles = Article::query()->whereNull('published_at')->count();
        $publicArticles = Article::query()->where('is_public', true)->count();
        $newUsersToday = (clone $managedUsers)->whereDate('created_at', $today)->count();
        $newCommentsToday = Comment::query()->whereDate('created_at', $today)->count();

        return [
            'totalUsers' => $totalUsers,
            'activeUsers' => $activeUsers,
            'pendingUsers' => $pendingUsers,
            'writers' => $writers,
            'editors' => $editors,
            'students' => $students,
            'totalArticles' => $totalArticles,
            'publishedArticles' => $publishedArticles,
            'pendingArticles' => $pendingArticles,
            'publicArticles' => $publicArticles,
            'totalComments' => Comment::query()->count(),
            'newUsersToday' => $newUsersToday,
            'newCommentsToday' => $newCommentsToday,
        ];
    }

    private function buildWeeklyActivity(): array
    {
        $days = collect(range(6, 0))->map(function (int $offset): array {
            $day = Carbon::today()->subDays($offset);

            return [
                'date' => $day->toDateString(),
                'label' => $day->format('D'),
                'newUsers' => User::query()->whereDate('created_at', $day)->count(),
                'publishedArticles' => Article::query()->whereDate('published_at', $day)->count(),
                'newComments' => Comment::query()->whereDate('created_at', $day)->count(),
            ];
        });

        return $days->values()->all();
    }

    private function buildRecentUsers(): array
    {
        return $this->managedUsersQuery()
            ->select(['id', 'name', 'email', 'account_status', 'created_at'])
            ->with('roles:name')
            ->orderByDesc('created_at')
            ->limit(6)
            ->get()
            ->map(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name')->values(),
                'account_status' => $user->account_status,
                'created_at' => $user->created_at,
            ])
            ->values()
            ->all();
    }

    private function buildRecentArticles(): array
    {
        return Article::query()
            ->select(['id', 'title', 'published_at', 'created_at', 'is_public', 'user_id'])
            ->with(['author:id,name'])
            ->withCount('comments')
            ->whereNotNull('published_at')
            ->latest('published_at')
            ->limit(6)
            ->get()
            ->map(fn (Article $article): array => [
                'id' => $article->id,
                'title' => $article->title,
                'author' => $article->author?->name,
                'comments_count' => $article->comments_count,
                'is_public' => (bool) $article->is_public,
                'status' => 'Published',
                'created_at' => $article->created_at,
                'published_at' => $article->published_at,
            ])
            ->values()
            ->all();
    }

    private function buildAdminUserPayload(): array
    {
        $users = User::query()
            ->select(['id', 'name', 'email', 'account_status', 'suspended_at', 'created_at'])
            ->with('roles:name')
            ->whereHas('roles', function ($query): void {
                $query->whereIn('name', self::MANAGED_ROLES);
            })
            ->orderBy('name')
            ->get()
            ->map(function (User $user): array {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles->pluck('name')->values(),
                    'account_status' => $user->account_status,
                    'suspended_at' => $user->suspended_at,
                    'created_at' => $user->created_at,
                ];
            });

        return [
            'users' => $users,
            'roles' => Role::query()->whereIn('name', self::MANAGED_ROLES)->pluck('name')->values(),
        ];
    }

    private function buildEditorialLogs(): array
    {
        return EditorialActionLog::query()
            ->with(['actor:id,name,email', 'article:id,title'])
            ->latest()
            ->limit(120)
            ->get()
            ->map(fn (EditorialActionLog $log): array => [
                'id' => $log->id,
                'article_id' => $log->article_id,
                'article_title' => $log->article_title,
                'actor' => [
                    'id' => $log->actor?->id,
                    'name' => $log->actor?->name,
                    'email' => $log->actor?->email,
                ],
                'acting_role' => $log->acting_role,
                'action' => $log->action,
                'previous_status' => $log->previous_status,
                'new_status' => $log->new_status,
                'note' => $log->note,
                'meta' => $log->meta ?? [],
                'created_at' => $log->created_at,
            ])
            ->values()
            ->all();
    }

    private function buildSystemAuditLogs(): array
    {
        return AuditLog::query()
            ->with('actor:id,name,email')
            ->latest()
            ->limit(50)
            ->get()
            ->map(fn (AuditLog $log): array => [
                'id' => $log->id,
                'action' => $log->action,
                'entity_type' => $log->entity_type,
                'entity_id' => $log->entity_id,
                'entity_label' => $log->entity_label,
                'previous_state' => $log->previous_state,
                'new_state' => $log->new_state,
                'note' => $log->note,
                'actor' => [
                    'id' => $log->actor?->id,
                    'name' => $log->actor?->name,
                    'email' => $log->actor?->email,
                ],
                'meta' => $log->meta ?? [],
                'created_at' => $log->created_at,
            ])
            ->values()
            ->all();
    }

    private function applyEditorialLogFilters($query, array $filters): void
    {
        $search = $filters['search'] ?? '';
        $action = $filters['action'] ?? 'all';
        $editorId = (int) ($filters['editorId'] ?? 0);
        $statusFrom = $filters['statusFrom'] ?? '';
        $statusTo = $filters['statusTo'] ?? '';
        $dateFrom = $filters['dateFrom'] ?? '';
        $dateTo = $filters['dateTo'] ?? '';
        $sort = $filters['sort'] ?? 'newest';

        if ($search !== '') {
            $query->where(function ($q) use ($search): void {
                $q->where('article_title', 'like', '%'.$search.'%')
                    ->orWhere('action', 'like', '%'.$search.'%')
                    ->orWhere('note', 'like', '%'.$search.'%')
                    ->orWhereHas('actor', function ($actorQuery) use ($search): void {
                        $actorQuery->where('name', 'like', '%'.$search.'%')
                            ->orWhere('email', 'like', '%'.$search.'%');
                    });
            });
        }

        if ($action !== '' && $action !== 'all') {
            $query->where('action', $action);
        }

        if ($editorId > 0) {
            $query->where('acting_user_id', $editorId);
        }

        if ($statusFrom !== '') {
            $query->where('previous_status', $statusFrom);
        }

        if ($statusTo !== '') {
            $query->where('new_status', $statusTo);
        }

        if ($dateFrom !== '') {
            $query->where('created_at', '>=', Carbon::parse($dateFrom)->startOfDay());
        }

        if ($dateTo !== '') {
            $query->where('created_at', '<=', Carbon::parse($dateTo)->endOfDay());
        }

        switch ($sort) {
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'article_asc':
                $query->orderBy('article_title', 'asc');
                break;
            case 'article_desc':
                $query->orderBy('article_title', 'desc');
                break;
            case 'editor_asc':
                $query->join('users as users_sort', 'users_sort.id', '=', 'editorial_action_logs.acting_user_id')
                    ->orderBy('users_sort.name', 'asc')
                    ->select('editorial_action_logs.*');
                break;
            case 'editor_desc':
                $query->join('users as users_sort', 'users_sort.id', '=', 'editorial_action_logs.acting_user_id')
                    ->orderBy('users_sort.name', 'desc')
                    ->select('editorial_action_logs.*');
                break;
            case 'action_asc':
                $query->orderBy('action', 'asc');
                break;
            case 'action_desc':
                $query->orderBy('action', 'desc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }
    }

    /** Create a managed user account from admin input. */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['string', Rule::in(self::MANAGED_ROLES)],
            'account_status' => ['nullable', Rule::in(self::ACCOUNT_STATUSES)],
            'temporary_password' => ['nullable', 'string', 'min:8'],
        ]);

        $temporaryPassword = $validated['temporary_password'] ?? Str::password(12);

        $user = User::query()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($temporaryPassword),
            'email_verified_at' => now(),
            'account_status' => $validated['account_status'] ?? 'active',
            'suspended_at' => ($validated['account_status'] ?? 'active') === 'suspended' ? now() : null,
        ]);

        $user->syncRoles($validated['roles']);
        $this->auditLogger->log(
            actor: $request->user(),
            action: 'admin_user_created',
            entityType: 'user',
            entityId: $user->id,
            entityLabel: $user->email,
            previousState: null,
            newState: $user->account_status,
            note: 'Admin created account.',
            meta: ['roles' => $validated['roles']],
        );

        return back()->with('success', 'User account created successfully with temporary password: '.$temporaryPassword);
    }

    /** Update profile fields, roles, and status for a managed user. */
    public function update(Request $request, User $user): RedirectResponse
    {
        $oldState = $user->only(['name', 'email', 'account_status']);
        $oldRoles = $user->getRoleNames()->values()->all();
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['string', Rule::in(self::MANAGED_ROLES)],
            'account_status' => ['required', Rule::in(self::ACCOUNT_STATUSES)],
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'account_status' => $validated['account_status'],
            'suspended_at' => $validated['account_status'] === 'suspended' ? now() : null,
        ]);

        $user->syncRoles($validated['roles']);
        $this->auditLogger->log(
            actor: $request->user(),
            action: 'admin_user_updated',
            entityType: 'user',
            entityId: $user->id,
            entityLabel: $user->email,
            previousState: $oldState['account_status'],
            newState: $validated['account_status'],
            note: 'Admin updated account profile/roles.',
            meta: [
                'before' => $oldState,
                'after' => $user->only(['name', 'email', 'account_status']),
                'roles_before' => $oldRoles,
                'roles_after' => $validated['roles'],
            ],
        );

        return back()->with('success', 'User account updated successfully.');
    }

    /** Change the account status of a managed user. */
    public function updateStatus(Request $request, User $user): RedirectResponse
    {
        $previousStatus = (string) $user->account_status;
        $validated = $request->validate([
            'account_status' => ['required', Rule::in(self::ACCOUNT_STATUSES)],
        ]);

        if ($request->user()->id === $user->id && $validated['account_status'] === 'suspended') {
            return back()->with('error', 'Admin cannot suspend the current logged-in account.');
        }

        $user->update([
            'account_status' => $validated['account_status'],
            'suspended_at' => $validated['account_status'] === 'suspended' ? now() : null,
        ]);
        $this->auditLogger->log(
            actor: $request->user(),
            action: 'admin_user_status_changed',
            entityType: 'user',
            entityId: $user->id,
            entityLabel: $user->email,
            previousState: $previousStatus,
            newState: $validated['account_status'],
            note: 'Admin changed account status.',
        );

        return back()->with('success', 'User status updated successfully.');
    }

    /** Replace the assigned roles for a managed user. */
    public function syncRoles(Request $request, User $user): RedirectResponse
    {
        $oldRoles = $user->getRoleNames()->values()->all();
        $validated = $request->validate([
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['string', Rule::in(self::MANAGED_ROLES)],
        ]);

        $user->syncRoles($validated['roles']);
        $this->auditLogger->log(
            actor: $request->user(),
            action: 'admin_user_roles_synced',
            entityType: 'user',
            entityId: $user->id,
            entityLabel: $user->email,
            previousState: implode(',', $oldRoles),
            newState: implode(',', $validated['roles']),
            note: 'Admin synced user roles.',
            meta: [
                'roles_before' => $oldRoles,
                'roles_after' => $validated['roles'],
            ],
        );

        return back()->with('success', 'User roles updated successfully.');
    }

    /** Soft-delete a managed user account and revoke roles. */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        $previousStatus = (string) $user->account_status;
        $oldRoles = $user->getRoleNames()->values()->all();
        if ($request->user()->id === $user->id) {
            return back()->with('error', 'You cannot delete your own account while logged in.');
        }

        $isManagedUser = $user->roles()->whereIn('name', self::MANAGED_ROLES)->exists();

        if (!$isManagedUser) {
            return back()->with('error', 'This account is outside the admin user-management scope.');
        }

        $user->syncRoles([]);

        $user->update([
            'account_status' => 'deleted',
            'suspended_at' => now(),
        ]);
        $this->auditLogger->log(
            actor: $request->user(),
            action: 'admin_user_deleted',
            entityType: 'user',
            entityId: $user->id,
            entityLabel: $user->email,
            previousState: $previousStatus,
            newState: 'deleted',
            note: 'Admin soft-deleted account and revoked roles.',
            meta: [
                'roles_before' => $oldRoles,
            ],
        );

        return back()->with('success', 'User account deleted successfully.');
    }
}
