<?php

use App\Models\User;
use Illuminate\Foundation\Auth\User as AuthUser;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return "Successfully installed Laravel! Bhenny Benlor D. Rivera.";
});

Route::get('/about', function () {
    return "This is the about page. Created by Bhenny Benlor D. Rivera!";
});

route::get('/insert-user', function () {
    return User::create([
        'name' => 'Bhenny Benlor D. Rivera',
        'email' => 'bhenny'. rand(1, 10000000) .'@example.com',
        'password' => Hash::make('12345678'),
    ]);

});

Route::get('/users', function () {
    return User::orderBy('name')->where('name', 'like', '%th%')->get();
});

Route::get('/test-email', function () {
    $user = User::all()->shuffle()->first();

    Mail::raw(
        "Mabuhay {$user->name}! Nanalo ka ng 10,000 PHP!", 
        function ($message) use ($user) {
            $message->to($user->email)
                ->subject('You are a Lucky Winner');
    });
});