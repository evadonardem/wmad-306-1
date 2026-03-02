<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Inertia\Inertia;
use Inertia\Response;

class StudentDashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Student/Dashboard', [
            'publishedCount' => Article::query()->whereNotNull('published_at')->count(),
        ]);
    }
}
