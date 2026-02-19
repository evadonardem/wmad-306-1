<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail; // Added this line

Route::get('/', function () {
    return "Successfully installed Laravel Ivan Bankin";
});

Route::get('/about', function () {
    return "This is the about page. Created by Ivan Bankin.";
});

Route::get('/insert-user', function () {
    return User::create([
        'name' => 'Ivan Bankin ' . rand(1, 1000000),
        'email' => 'ivan.bankin' . rand(1, 1000000) . '@example.com',
        'password' => Hash::make('12345678'),
    ]);
});

Route::get('/users', function () {
    return User::all();
});

Route::get('/test-email', function () {
    // Get a random user or fail if the table is empty
    $user = User::inRandomOrder()->first();

    if (!$user) {
        return "No users found in the database!";
    }

    Mail::raw("MABUHAY KA!! $user->name nanalo ka ng kambing", function ($message) use ($user) {
        $message->to($user->email)
                ->subject('You are the lucky winner!');
    });

    return "Email sent to $user->email!";
});

