<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/users');
});

Route::get('/users', function () {
    return Inertia::render('Welcome');
});
