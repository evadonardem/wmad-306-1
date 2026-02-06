<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return "<h1>Successfully installed Laravel, Ancheta Diane!</h1>
            <p>This is the home page of the Laravel application.</p>";
});

Route::get('/about', function () {
    return "<h1>About Page</h1>
            <p>This page was created by Dayaaannnn.</p>";
});

route::get('/insert-user' , function () {
    return User::create([
        'name' => 'John Doe' . rand(1,100),
        'email' => 'john.doe@example.com',
        'password' => Hash::make(12345),
    ]);
});

route::get('/users', function () {
    return User::orderBy('name', 'like', '%th%')->get();
});

route::get('/test-email', function () {
    $user = User::all()->shuffle()->first();
    Mail::raw("MABUHAY KA!! $user->name nanalo ka ng kambing" , function ($message) use ($user) {
        $message->to($user->email)
                ->subject('You are the lucky winner!');
    });
});