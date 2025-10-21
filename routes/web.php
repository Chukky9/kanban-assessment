<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

Route::prefix('projects')->as('projects.')->group(function () {
    Route::get('/', [ProjectController::class, 'index'])->name('index');
    Route::get('/{project}', [ProjectController::class, 'show'])->name('show');
});

Route::prefix('tasks')->as('tasks.')->group(function () {
    Route::post('/', [TaskController::class, 'store'])->name('store');
    Route::patch('/{task}/status', [TaskController::class, 'updateStatus'])->name('updateStatus');
    Route::put('/{task}', [TaskController::class, 'update'])->name('update');
    Route::delete('/{task}', [TaskController::class, 'destroy'])->name('destroy');
});

Route::prefix('reports')->as('reports.')->group(function () {
    Route::get('/', [ReportController::class, 'index'])->name('index');
    Route::post('/generate', [ReportController::class, 'generate'])->name('generate');
});

Route::get('/test-queue', function () {
    if (app()->environment('local')) {
        \App\Jobs\GenerateReportJob::dispatch();
        return 'Job dispatched!';
    }
    return 'Job not dispatched in production!';
});

Route::get('/test-scheduler', function () {
    if (app()->environment('local')) {
        \Illuminate\Support\Facades\Artisan::call('schedule:run');
        return 'Scheduler executed!';
    }
    return 'Scheduler not executed in production!';
});

Route::prefix('users')->as('users.')->group(function () {
    Route::get('/', [UserController::class, 'index'])->name('index');
    Route::delete('/{userId}', [UserController::class, 'destroy'])->name('destroy');
    Route::patch('/{userId}/restore', [UserController::class, 'restore'])->name('restore');
});