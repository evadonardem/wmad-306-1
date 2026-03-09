<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Mail\ArticleStatusUpdated;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response|RedirectResponse
    {
        if (auth()->user()->role === 'admin') {
            return redirect()->route('articles.admin');
        }

        return Inertia::render('Articles/Index', [
            'articles' => auth()->user()->articles()->latest()->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Articles/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $request->user()->articles()->create($validated);

        return redirect()->route('articles.index')->with('success', 'Article created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Article $article)
    {
        // Logic for showing a single article will be added later
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Article $article): Response
    {
        Gate::authorize('update', $article);

        if ($article->status !== 'draft') {
            abort(403, 'Only draft articles can be edited.');
        }

        return Inertia::render('Articles/Edit', [
            'article' => $article,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Article $article): RedirectResponse
    {
        Gate::authorize('update', $article);

        if ($article->status !== 'draft') {
            abort(403, 'Only draft articles can be edited.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $article->update($validated);

        return redirect()->route('articles.index')->with('success', 'Article updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $article)
    {
        // Logic for deleting an article will be added later
    }

    /**
     * Submit the article for review.
     */
    public function submit(Article $article): RedirectResponse
    {
        // Add Gate check later to ensure only the author can submit
        if ($article->status === 'draft') {
            $article->status = 'pending_review';
            $article->save();
            return back()->with('success', 'Article submitted for review.');
        }

        return back()->with('error', 'This article cannot be submitted for review.');
    }

    /**
     * Unsubmit the article (revert to draft).
     */
    public function unsubmit(Article $article): RedirectResponse
    {
        if ($article->status === 'pending_review') {
            $article->status = 'draft';
            $article->save();
            return back()->with('success', 'Article unsubmitted successfully.');
        }

        return back()->with('error', 'This article cannot be unsubmitted.');
    }

    /**
     * Show the admin dashboard for reviewing articles.
     */
    public function admin(): Response
    {
        // Add Gate check later to ensure only admins can access
        return Inertia::render('Articles/Admin', [
            // This is the updated line that grabs all three statuses!
            'articles' => Article::whereIn('status', ['pending_review', 'published', 'rejected'])->with('user')->latest()->get(),
        ]);
    }

    /**
     * Update the status of the specified article.
     */
    public function updateStatus(Request $request, Article $article): RedirectResponse
    {
        // Add Gate check later
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:published,rejected,pending_review'],
        ]);

        $article->status = $validated['status'];
        $article->save();

        if ($article->status === 'published' || $article->status === 'rejected') {
            Mail::to($article->user)->send(new ArticleStatusUpdated($article));
        }

        return back()->with('success', 'Article status updated.');
    }
}
