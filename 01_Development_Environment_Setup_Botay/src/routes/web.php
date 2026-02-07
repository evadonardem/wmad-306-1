<?php

use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

Route::get('/', function (){
    return "Successfully installed Laravel! Yesha Nicka";
});
Route::get('/about', function (){
    return "This is the about page. Created by Yesha Nicka";
});

Route::get('/insert-user', function (){
    User::create([
        'name' => 'Yesha Nicka' . rand(1, 1000),
        'email' => 'yesha.nicka' . rand(1, 1000) . '@example.com',
        'password' => Hash::make('123456'),
    ]);
    return "User created successfully!";
});

Route::get('/users', function (){
    return User::orderBy('name')->get();
});

Route::get('/test-email', function (){
    $user = User::all()->shuffle()->first();

    Mail::raw("Mabuhay {$user->name}! Nanalo ka ng Php.100,000.00",
        function ($message) use ($user) {
            $message->to($user->email)
                    ->subject('Congratulations!');
        });
});