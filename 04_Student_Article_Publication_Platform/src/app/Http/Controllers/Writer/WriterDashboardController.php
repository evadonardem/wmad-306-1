<?php

namespace App\Http\Controllers\Writer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WriterDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Writer/Dashboard', [
            'articles' => $request->user()->articles()->latest()->get(),
        ]);
    }
}
