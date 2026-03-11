<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Article;
use App\Models\Category;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $role = $user->getRoleNames()->first();

        $stats = [];
        $articles = [];
        $categories = [];

        // Writer Data
        if ($user->hasRole('writer')) {

            $articles = Article::with(['status','category'])
                ->where('writer_id', $user->id)
                ->latest()
                ->get();

            $categories = Category::orderBy('name')->get();

            $stats = [
                'draft' => $articles->where('status.name','draft')->count(),
                'submitted' => $articles->where('status.name','submitted')->count(),
                'needs_revision' => $articles->where('status.name','needs_revision')->count(),
                'published' => $articles->where('status.name','published')->count(),
            ];
        }

        // Editor Data
        if ($user->hasRole('editor')) {

            $articles = Article::with(['status','category','writer'])
                ->whereHas('status', function ($q) {
                    $q->whereIn('name', ['submitted','needs_revision']);
                })
                ->latest()
                ->get();

            $stats = [
                'submitted' => $articles->where('status.name','submitted')->count(),
                'needs_revision' => $articles->where('status.name','needs_revision')->count(),
            ];
        }

        // Student Data
        if ($user->hasRole('student')) {

            $articles = Article::with(['status','category','writer'])
                ->whereHas('status', fn($q) => $q->where('name','published'))
                ->latest()
                ->get();

            $stats = [
                'published' => $articles->count(),
            ];
        }

        return Inertia::render('Dashboard', [
            'role' => $role,
            'stats' => $stats,
            'articles' => $articles,
            'categories' => $categories,
        ]);
    }
}