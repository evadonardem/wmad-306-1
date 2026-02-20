<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return "Successfully installed Laravel! Dexter Sueno.";
});
Route::get('/about', function () {
    return "This is about page. Created by Dexter Sueno.";
});

Route::get('/insert-user', function () {
    return User::create([
        'name' => 'Dexter Sueno ' . rand(1, 100000),
        'email' => 'dexter.sueno' . rand(1, 100000) . '@example.com',
        'password' => Hash::make('123456'),
    ]);
});
Route::get('/users', function () {
    return User::orderBy('name')->where ('name','like', '%ith%')->get();

});
Route::get('/test-email', function () {
    $user = User::all()->shuffle()->first();
    Mail::raw(
        "Mabuhay $user->name! Nanalo ka nang Php.1,000,000.00",
        function ($message) use ($user) {
        $message->to($user->email)
                ->subject('Your a lucky winner! Congratulations!');
    });
});