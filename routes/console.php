<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule the report generation job
Schedule::command('reports:generate')
    ->dailyAt('00:00')
    ->name('generate-daily-reports')
    ->appendOutputTo(storage_path('logs/scheduler.log'))
    ->withoutOverlapping();
