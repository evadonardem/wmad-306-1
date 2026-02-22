<?php


use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return "Successfully installed Laravel!! Joshkane Gabol";
});

Route::get('/about', function () {
    return "This is the about page. Created by Joshkane Gabol.";
});

Route::get('/insert-user', function () {
    User::create([
        'name' => 'Joshkane Gabol ' . rand(1, 1000000),
        'email' => 'joshkanevangabol' . rand(1, 1000000) . '@example.com',
        'password' => Hash::make('123456'),
    ]);
});