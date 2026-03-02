<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin', 'permission:manage accounts'])
    ->prefix('admin')
    ->as('admin.')
    ->group(function (): void {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('/users', [AdminDashboardController::class, 'users'])->name('users.index');
        Route::post('/users', [AdminDashboardController::class, 'store'])->name('users.store');
        Route::delete('/users/{user}', [AdminDashboardController::class, 'destroy'])->name('users.destroy');
        Route::patch('/users/{user}', [AdminDashboardController::class, 'update'])->name('users.update');
        Route::patch('/users/{user}/status', [AdminDashboardController::class, 'updateStatus'])->name('users.update-status');
        Route::patch('/users/{user}/roles', [AdminDashboardController::class, 'syncRoles'])->name('users.sync-roles');
    });
