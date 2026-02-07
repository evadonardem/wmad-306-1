<?php
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use App\Models\User;
Route::get('/', function () {
    return "Successfuly installed Laravel Allen Teligo";
});

Route::get('/about', function () {
    return "This is a the about page. Created by Allen Teligo";
});

Route::get('/insert-user', function () {
    User::create([
        'name' => 'Allen Teligo',
        'email' => '',
        'password' => Hash::make('123456'),
        ]);
});

