<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

// 1. Home Page
Route::get('/', function () {
    return "<h1>Successfully installed Laravel, Bankin Ivan!</h1>
            <p>This is the home page of the Laravel application.</p>";
});

// 2. About Page (The one you requested)
Route::get('/about', function () {
    return "<h1>Successfully installed Laravel, Bankin Ivan!</h1>";
});

// 3. Insert a Test User
Route::get('/insert-user', function () {
    return User::create([
        'name' => 'Hisoka Zoldyk ' . rand(1, 100),
        'email' => 'hisoka.' . rand(1, 1000) . '@example.com', // Added random to avoid unique email errors
        'password' => Hash::make('12345'),
    ]);
});

// 4. Search Users (Fixed: changed orderBy to where)
Route::get('/users', function () {
    return User::where('name', 'like', '%th%')->get();
});

// 5. Test Email
Route::get('/test-email', function () {
    $user = User::all()->shuffle()->first();

    if (!$user) {
        return "No users found. Please visit /insert-user first!";
    }

    Mail::raw("MABUHAY KA!! $user->name nanalo ka ng Commision", function ($message) use ($user) {
        $message->to($user->email)
                ->subject('You are the top 3 winner!');
    });

    return "Email sent to $user->name! Check your Mailtrap/Mailpit dashboard.";
});
