<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return "Successfully installed Laravel! Joshua Bustamante";
});

Route::get('/about', function () {
    return 'about page';
});

Route::get('/insert-user', function () {
    return User::create([
        'name' => 'Joshua Bustamante' . rand(1, 1000000),
        'email' => 'joshua.bustamante@example.com' . rand(1, 1000000) . '@example.com',
        'password' => Hash::make('12345678'),
    ]);
});

Route::get('/users', function () {
    return User::orderBy('name')->get();
});

Route::get('/test-email', function () {
    $user = User::all()->shuffle()->first();

    Mail::raw(
        "Mabuhay {$user->name}! You're a lucky winner of a PHP 100,000.00", 
        function ($message) use ($user) {
        $message->to($user->email)
                ->subject('Subscibe to to my YouTube channel to avail the prize!');
    });

    return "Email sent to " . $user->email;
});
