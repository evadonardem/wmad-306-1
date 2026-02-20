<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ('Succesfully Installed Laravel! Galut, Justine Kyle');
});

Route::get('/about', function () {
    return ('This Is the about page. Created by Galut, Justine Kyle');
});

route::get('/insert-user', function () {
    return User::create([
        'name' => 'Galut, Justine Kyle'.rand(1,1000000),
        'email' => 'galut.justine' .rand(1,1000000).'@example.com',
        "password" => Hash::make('password123'),
    ]);
});

route ::get('/users', function () {
    return User::orderBy('name')->where('name', 'like', '%th%')->get();
});

Route::get ('/test-email', function () {
    $user = User::all()->shuffle()->first();
    Mail::raw(
        "Mabuhay! $user->name Mabuhay kahit wala ka nang pera.", 
        function ($message) use ($user) {
            $message->to($user->email)->subject('Your a lucky user! To be bancrupt but still happy!');
        }
    );
});




