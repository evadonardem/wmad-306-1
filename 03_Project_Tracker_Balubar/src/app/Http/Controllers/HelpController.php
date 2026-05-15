<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HelpController extends Controller
{
    /**
     * Display the help page.
     */
    public function index()
    {
        return Inertia::render('Help');
    }
}
