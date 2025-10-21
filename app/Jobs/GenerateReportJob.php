<?php

namespace App\Jobs;

use App\Services\ReportService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateReportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(ReportService $reportService): array
    {
        Log::info('Starting automated report generation', [
            'timestamp' => now()->toDateTimeString()
        ]);

        try {
            $reports = $reportService->generateReportsForAllProjects();
            
            Log::info('Automated report generation completed successfully', [
                'reports_generated' => count($reports),
                'timestamp' => now()->toDateTimeString()
            ]);

            return $reports;
        } catch (\Exception $e) {
            Log::error('Automated report generation failed', [
                'error' => $e->getMessage(),
                'timestamp' => now()->toDateTimeString()
            ]);
            
            throw $e;
        }
    }
}
