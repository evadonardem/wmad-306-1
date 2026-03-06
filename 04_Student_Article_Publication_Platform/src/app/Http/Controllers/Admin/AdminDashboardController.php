<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
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

    /** Render the admin dashboard view. */
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => $this->buildDashboardStats(),
            'activity' => $this->buildWeeklyActivity(),
            'recentUsers' => $this->buildRecentUsers(),
            'recentArticles' => $this->buildRecentArticles(),
        ]);
    }

    /** Render the admin user-management view. */
    public function users(): Response
    {
        return Inertia::render('Admin/users', $this->buildAdminUserPayload());
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

        return back()->with('success', 'User account created successfully with temporary password: '.$temporaryPassword);
    }

    /** Update profile fields, roles, and status for a managed user. */
    public function update(Request $request, User $user): RedirectResponse
    {
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

        return back()->with('success', 'User account updated successfully.');
    }

    /** Change the account status of a managed user. */
    public function updateStatus(Request $request, User $user): RedirectResponse
    {
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

        return back()->with('success', 'User status updated successfully.');
    }

    /** Replace the assigned roles for a managed user. */
    public function syncRoles(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['string', Rule::in(self::MANAGED_ROLES)],
        ]);

        $user->syncRoles($validated['roles']);

        return back()->with('success', 'User roles updated successfully.');
    }

    /** Soft-delete a managed user account and revoke roles. */
    public function destroy(Request $request, User $user): RedirectResponse
    {
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

        return back()->with('success', 'User account deleted successfully.');
    }
}


