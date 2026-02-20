<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

// Guest-only authentication routes
Route::middleware('guest')->group(function () {
    // Registration: show form
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    // Registration: submit form
    Route::post('register', [RegisteredUserController::class, 'store']);

    // Login: show form
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    // Login: submit credentials
    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    // Password reset link: show request form
    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    // Password reset link: send email
    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    // Reset password: show form with token
    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    // Reset password: submit new password
    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

// Authenticated-only routes for verification and account security
Route::middleware('auth')->group(function () {
    // Email verification prompt
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    // Verify email link
    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    // Resend verification email
    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    // Confirm password for sensitive actions
    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    // Confirm password submission
    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    // Update password while authenticated
    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    // Logout current user
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
