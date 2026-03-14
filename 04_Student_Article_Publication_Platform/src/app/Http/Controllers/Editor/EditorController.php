<?php

namespace App\Http\Controllers\Editor;

use App\Events\NewArticlePublished;
use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\EditorialActionLog;
use App\Services\EditorialMailService;
use App\Services\EditorialWorkflowService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class EditorController extends Controller
{
    public function __construct(
        private readonly EditorialWorkflowService $workflowService,
        private readonly EditorialMailService $mailService,
    ) {
    }

    /** Show a claimed article in side-by-side review mode. */
    public function show(Request $request, Article $article): Response|RedirectResponse
    {
        $this->authorize('view', $article);

        if ((int) $article->user_id === (int) $request->user()->id) {
            return redirect()->route('editor.dashboard')->with('error', 'You cannot review your own submission.');
        }

        if ((int) $article->claimed_by_editor_id !== (int) $request->user()->id) {
            return redirect()->route('editor.dashboard')->with('error', 'Claim this article before reviewing.');
        }

        return Inertia::render('Editor/ReviewArticle', [
            'article' => $article->load([
                'author:id,name',
                'category:id,name',
                'status:id,name,slug',
                'revisions' => fn ($query) => $query->with('requester:id,name')->latest(),
                'comments' => fn ($query) => $query->with('user:id,name')->latest(),
                'editorialLogs' => fn ($query) => $query->with('actor:id,name')->latest(),
            ]),
            'availableRoles' => $request->user()->getRoleNames()->values(),
        ]);
    }

    /** Claim an article for first-come, first-served review. */
    public function claim(Request $request, Article $article): RedirectResponse
    {
        $this->authorize('publish', $article);
        $previousStatus = $article->status?->slug;

        if ((int) $article->user_id === (int) $request->user()->id) {
            return back()->with('error', 'You cannot claim your own submission.');
        }

        try {
            $fresh = $this->workflowService->claim($article, (int) $request->user()->id)->load('status');
        } catch (ValidationException $exception) {
            $firstMessage = collect($exception->errors())->flatten()->first() ?? 'Unable to claim article.';
            return back()->with('error', $firstMessage);
        }

        $this->logAction(
            article: $fresh,
            request: $request,
            action: 'claimed_for_review',
            previousStatus: $previousStatus,
            newStatus: $fresh->status?->slug,
            note: null,
            meta: [
                'claimed_at' => optional($fresh->claimed_at)?->toISOString(),
            ],
        );
        $this->mailService->sendArticleClaimedToAuthor($fresh->loadMissing('author:id,name,email'), $request->user());

        return back()->with('success', 'Article claimed successfully.');
    }

    /** Release a previously claimed article back into the review queue. */
    public function release(Request $request, Article $article): RedirectResponse
    {
        $this->authorize('publish', $article);

        if ((int) $article->claimed_by_editor_id !== (int) $request->user()->id) {
            return back()->with('error', 'Only the claiming editor can release this article.');
        }

        $previousStatus = $article->status?->slug;

        $article = $this->workflowService->release($article)->load('status');

        $this->logAction(
            article: $article,
            request: $request,
            action: 'released_claim',
            previousStatus: $previousStatus,
            newStatus: $article->status?->slug,
            note: null,
            meta: [],
        );

        return back()->with('success', 'Article released back to the queue.');
    }

    /** Request content updates from the writer for an article. */
    public function requestRevision(Request $request, Article $article): RedirectResponse
    {
        $this->authorize('requestRevision', $article);
        $previousStatus = $article->status?->slug;

        if ((int) $article->user_id === (int) $request->user()->id) {
            return back()->with('error', 'You cannot request revisions for your own article.');
        }

        if ((int) $article->claimed_by_editor_id !== (int) $request->user()->id) {
            return back()->with('error', 'Claim this article before sending a revision request.');
        }

        $validated = $request->validate([
            'notes' => ['required', 'string'],
        ]);

        $article->revisions()->create([
            'requested_by' => $request->user()->id,
            'notes' => $validated['notes'],
        ]);

        $fresh = $this->workflowService->returnForRevision($article, $validated['notes'])->load('status');
        $this->logAction(
            article: $fresh,
            request: $request,
            action: 'returned_for_revision',
            previousStatus: $previousStatus,
            newStatus: $fresh->status?->slug,
            note: $validated['notes'],
            meta: [],
        );
        $this->mailService->sendEditorialOutcomeToAuthor(
            $fresh->loadMissing('author:id,name,email'),
            'revision_requested',
            $validated['notes'],
        );

        return redirect()->route('editor.dashboard')->with('success', 'Revision request sent to writer.');
    }

    /** Reject an entry with a required reason. */
    public function reject(Request $request, Article $article): RedirectResponse
    {
        $this->authorize('publish', $article);
        $previousStatus = $article->status?->slug;

        if ((int) $article->user_id === (int) $request->user()->id) {
            return back()->with('error', 'You cannot reject your own article.');
        }

        if ((int) $article->claimed_by_editor_id !== (int) $request->user()->id) {
            return back()->with('error', 'Claim this article before rejecting it.');
        }

        $validated = $request->validate([
            'reason' => ['required', 'string'],
        ]);

        $fresh = $this->workflowService->reject($article, (int) $request->user()->id, $validated['reason'])->load('status');
        $this->logAction(
            article: $fresh,
            request: $request,
            action: 'rejected_entry',
            previousStatus: $previousStatus,
            newStatus: $fresh->status?->slug,
            note: $validated['reason'],
            meta: [],
        );
        $this->mailService->sendEditorialOutcomeToAuthor(
            $fresh->loadMissing('author:id,name,email'),
            'rejected',
            $validated['reason'],
        );

        return redirect()->route('editor.dashboard')->with('success', 'Entry rejected and archived from queue.');
    }

    /** Publish a submitted article for authenticated readers. */
    public function publish(Request $request, Article $article): RedirectResponse
    {
        $this->authorize('publish', $article);
        $previousStatus = $article->status?->slug;

        if ((int) $article->user_id === (int) $request->user()->id) {
            return back()->with('error', 'You cannot publish your own article as editor.');
        }

        if ((int) $article->claimed_by_editor_id !== (int) $request->user()->id) {
            return back()->with('error', 'Claim this article before publishing.');
        }

        $fresh = $this->workflowService->publish($article)->load('status');
        $this->logAction(
            article: $fresh,
            request: $request,
            action: 'accepted_and_published',
            previousStatus: $previousStatus,
            newStatus: $fresh->status?->slug,
            note: null,
            meta: [
                'published_at' => optional($fresh->published_at)?->toISOString(),
            ],
        );
        $this->mailService->sendEditorialOutcomeToAuthor($fresh->loadMissing('author:id,name,email'), 'published');

        event(new NewArticlePublished($article->fresh(['category'])));

        return redirect()->route('editor.dashboard')->with('success', 'Article published successfully.');
    }

    /** Approve a published article for public homepage visibility. */
    public function approvePublic(Request $request, Article $article): RedirectResponse
    {
        $this->authorize('approvePublic', $article);
        $previousStatus = $article->status?->slug;
        $wasPublic = (bool) $article->is_public;

        if ($article->user_id === $request->user()->id) {
            return back()->with('error', 'You cannot approve your own article for public listing.');
        }

        $fresh = $this->workflowService->approvePublic($article, (int) $request->user()->id)->load('status');
        $this->logAction(
            article: $fresh,
            request: $request,
            action: 'public_visibility_changed',
            previousStatus: $previousStatus,
            newStatus: $fresh->status?->slug,
            note: null,
            meta: [
                'was_public' => $wasPublic,
                'is_public' => (bool) $fresh->is_public,
                'public_approved_at' => optional($fresh->public_approved_at)?->toISOString(),
            ],
        );

        return back()->with('success', 'Article approved for public landing visibility.');
    }

    private function logAction(
        Article $article,
        Request $request,
        string $action,
        ?string $previousStatus,
        ?string $newStatus,
        ?string $note,
        array $meta = [],
    ): void {
        EditorialActionLog::query()->create([
            'article_id' => $article->id,
            'article_title' => $article->title,
            'acting_user_id' => $request->user()->id,
            'acting_role' => 'editor',
            'action' => $action,
            'previous_status' => $previousStatus,
            'new_status' => $newStatus,
            'note' => $note,
            'meta' => $meta,
        ]);
    }
}
