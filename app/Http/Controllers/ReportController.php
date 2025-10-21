<?php

namespace App\Http\Controllers;

use App\Jobs\GenerateReportJob;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function __construct(
        private ReportService $reportService
    ) {}

    public function index()
    {
        $reports = $this->reportService->getAllLatestReports();
        
        return Inertia::render('Reports/Index', [
            'reports' => $reports
        ]);
    }

    public function generate()
    {
        GenerateReportJob::dispatch();
        
        return response()->json([
            'message' => 'Report generation job dispatched successfully',
            'status' => 'queued'
        ]);
    }
}