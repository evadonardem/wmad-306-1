<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\WriterApplication;
use App\Services\EditorialMailService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WriterApplicationController extends Controller
{
    public function __construct(private readonly EditorialMailService $mailService)
    {
    }

    /** Render writer application page for student users. */
    public function create(Request $request): Response
    {
        $latest = WriterApplication::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->first();

        return Inertia::render('Student/WriterApplication', [
            'latestApplication' => $latest,
        ]);
    }

    /** Submit a writer application for admin review. */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasRole('writer')) {
            return back()->with('error', 'You already have writer access.');
        }

        $hasPending = WriterApplication::query()
            ->where('user_id', $user->id)
            ->where('status', 'pending')
            ->exists();

        if ($hasPending) {
            return back()->with('error', 'You already have a pending writer application.');
        }

        $validated = $request->validate([
            'motivation' => ['required', 'string', 'min:20', 'max:2000'],
            'experience' => ['nullable', 'string', 'max:2000'],
            'topics' => ['nullable', 'string', 'max:2000'],
        ]);

        $application = WriterApplication::query()->create([
            'user_id' => $user->id,
            'status' => 'pending',
            'motivation' => $validated['motivation'],
            'experience' => $validated['experience'] ?? null,
            'topics' => $validated['topics'] ?? null,
        ]);

        $this->mailService->sendWriterApplicationSubmitted($application);

        return redirect()
            ->route('student.writer-application.create')
            ->with('success', 'Application sent. The admin team will review your request.');
    }
}
