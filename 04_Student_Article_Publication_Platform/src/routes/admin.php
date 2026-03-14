<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\WriterApplicationController;
use Illuminate\Support\Facades\Route;

// Register admin-only account management routes.
Route::middleware(['auth', 'verified', 'role:admin', 'permission:manage accounts'])
    ->prefix('admin')
    ->as('admin.')
    ->group(function (): void {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('/users', [AdminDashboardController::class, 'users'])->name('users.index');
        Route::get('/writer-applications', [WriterApplicationController::class, 'index'])->name('writer-applications.index');
        Route::post('/writer-applications/{writerApplication}/accept', [WriterApplicationController::class, 'accept'])->name('writer-applications.accept');
        Route::post('/writer-applications/{writerApplication}/reject', [WriterApplicationController::class, 'reject'])->name('writer-applications.reject');
        Route::get('/editorial-logs', [AdminDashboardController::class, 'editorialLogs'])->name('editorial-logs.index');
        Route::get('/audit-logs', [AdminDashboardController::class, 'auditLogs'])->name('audit-logs.index');
        Route::get('/editorial-logs/export', [AdminDashboardController::class, 'exportEditorialLogs'])->name('editorial-logs.export');
        Route::post('/users', [AdminDashboardController::class, 'store'])->name('users.store');
        Route::delete('/users/{user}', [AdminDashboardController::class, 'destroy'])->name('users.destroy');
        Route::patch('/users/{user}', [AdminDashboardController::class, 'update'])->name('users.update');
        Route::patch('/users/{user}/status', [AdminDashboardController::class, 'updateStatus'])->name('users.update-status');
        Route::patch('/users/{user}/roles', [AdminDashboardController::class, 'syncRoles'])->name('users.sync-roles');
    });
