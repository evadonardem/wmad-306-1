<?php


use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

Route::get('/', function () {
    return "Watashi no pēji e yōkoso!";
});

Route::get('/about', function () {
    return "This is about page. Created by me";
});

Route::get('/insert-user', function () {
   return User::create([
        'name' => 'Humiwat, Samuel' . rand(1, 100000),
        'email' => 'humiwatsamuel.com' . rand(1, 100000). '@example.com',
        'password' => Hash::make('12345678'),
    ]);
});

Route::get('/about', function () {
    return User::orderby ('name')->get();
});

Route::get('/test-email', function () {
    $user = User::all()->shuffle()->first();
    Mail::raw("mabuhay $user->name! Na", 
    function ($message)use ($user){
        $message->to ($user->email)-> subject("Your a lucky Winner");
    }
    
    );
});