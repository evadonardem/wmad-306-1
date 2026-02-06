<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

Route::get('/', function () {
    return "Succesfully installed Laravel Josie";
});

Route::get('/about', function () {
    return "This is the about page. Created by Josie";
});

Route::get('/insert-user', function () {
    //Model (ORM) - Eloquent
    return User::Create([
        'name' => 'Kenjie Sawac' . rand(1, 100000),
        'email' => 'S=Kenjie.Sawac.' . rand(1, 100000) . '@example.com',
        'password' => Hash::make('123456'),
    ]);
});

Route::get('/users', function () {
    return User::where('name', 'like', '%ella%')->get();
});

Route::get('/test-email', function () {
    $user = User::all()->shuffle()->first();
    Mail::raw("Welcome $user->name!", function ($message) use ($user) {
        $message->to($user->email)->subject("Hello from Laravel");
    });
});