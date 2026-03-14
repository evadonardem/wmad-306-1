<?php

namespace App\Http\Controllers;

use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RoleSwitchController extends Controller
{
    public function __construct(private readonly AuditLogger $auditLogger)
    {
    }

    /** Persist active role in session and redirect to that role dashboard. */
    public function __invoke(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'string', Rule::in(['admin', 'editor', 'writer', 'student'])],
        ]);

        $role = $validated['role'];
        $user = $request->user();

        if (!$user || !$user->hasRole($role)) {
            return back()->with('error', 'You do not have access to that role.');
        }

        $previousRole = (string) $request->session()->get('active_role', '');
        $request->session()->put('active_role', $role);
        $this->auditLogger->log(
            actor: $user,
            action: 'role_switched',
            entityType: 'session',
            entityId: null,
            entityLabel: 'active_role',
            previousState: $previousRole !== '' ? $previousRole : null,
            newState: $role,
            note: 'User switched active dashboard role.',
        );

        return match ($role) {
            'admin' => redirect()->route('admin.dashboard'),
            'editor' => redirect()->route('editor.dashboard'),
            'writer' => redirect()->route('writer.dashboard'),
            'student' => redirect()->route('student.dashboard'),
            default => redirect()->route('dashboard'),
        };
    }
}
