<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WriterApplication;
use App\Services\AuditLogger;
use App\Services\EditorialMailService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WriterApplicationController extends Controller
{
    public function __construct(
        private readonly EditorialMailService $mailService,
        private readonly AuditLogger $auditLogger,
    ) {
    }

    /** Render writer application moderation table for admins. */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $status = (string) $request->query('status', 'all');
        $sort = (string) $request->query('sort', 'newest');
        $perPage = (int) $request->query('per_page', 25);
        $perPage = in_array($perPage, [10, 25, 50, 100], true) ? $perPage : 25;

        $query = WriterApplication::query()
            ->with(['applicant:id,name,email', 'reviewer:id,name,email']);

        if ($search !== '') {
            $query->where(function ($q) use ($search): void {
                $q->where('motivation', 'like', '%'.$search.'%')
                    ->orWhere('experience', 'like', '%'.$search.'%')
                    ->orWhere('topics', 'like', '%'.$search.'%')
                    ->orWhereHas('applicant', function ($sub) use ($search): void {
                        $sub->where('name', 'like', '%'.$search.'%')
                            ->orWhere('email', 'like', '%'.$search.'%');
                    });
            });
        }

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        if ($sort === 'oldest') {
            $query->oldest('created_at');
        } elseif ($sort === 'reviewed_newest') {
            $query->orderByDesc('reviewed_at');
        } else {
            $query->latest('created_at');
        }

        return Inertia::render('Admin/WriterApplications', [
            'applications' => $query->paginate($perPage)->withQueryString(),
            'filters' => [
                'search' => $search,
                'status' => $status,
                'sort' => $sort,
                'per_page' => $perPage,
            ],
            'statusOptions' => [
                ['value' => 'all', 'label' => 'All statuses'],
                ['value' => 'pending', 'label' => 'Pending'],
                ['value' => 'accepted', 'label' => 'Accepted'],
                ['value' => 'rejected', 'label' => 'Rejected'],
            ],
        ]);
    }

    /** Accept a writer application and grant writer role. */
    public function accept(Request $request, WriterApplication $writerApplication): RedirectResponse
    {
        if ($writerApplication->status !== 'pending') {
            return back()->with('error', 'Only pending applications can be accepted.');
        }

        $validated = $request->validate([
            'admin_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $writerApplication->update([
            'status' => 'accepted',
            'admin_notes' => $validated['admin_notes'] ?? null,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        $applicant = $writerApplication->applicant;
        if ($applicant && !$applicant->hasRole('writer')) {
            $applicant->assignRole('writer');
        }

        $this->mailService->sendWriterApplicationDecision($writerApplication->refresh()->load('applicant:id,name,email'), true);

        $this->auditLogger->log(
            actor: $request->user(),
            action: 'writer_application_accepted',
            entityType: 'writer_application',
            entityId: $writerApplication->id,
            entityLabel: 'Writer application #'.$writerApplication->id,
            previousState: 'pending',
            newState: 'accepted',
            note: $validated['admin_notes'] ?? null,
        );

        return back()->with('success', 'Application accepted. Writer role granted and email sent.');
    }

    /** Reject a writer application and notify applicant. */
    public function reject(Request $request, WriterApplication $writerApplication): RedirectResponse
    {
        if ($writerApplication->status !== 'pending') {
            return back()->with('error', 'Only pending applications can be rejected.');
        }

        $validated = $request->validate([
            'admin_notes' => ['required', 'string', 'max:2000'],
        ]);

        $writerApplication->update([
            'status' => 'rejected',
            'admin_notes' => $validated['admin_notes'],
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        $this->mailService->sendWriterApplicationDecision($writerApplication->refresh()->load('applicant:id,name,email'), false);

        $this->auditLogger->log(
            actor: $request->user(),
            action: 'writer_application_rejected',
            entityType: 'writer_application',
            entityId: $writerApplication->id,
            entityLabel: 'Writer application #'.$writerApplication->id,
            previousState: 'pending',
            newState: 'rejected',
            note: $validated['admin_notes'],
        );

        return back()->with('success', 'Application rejected and email sent.');
    }
}
