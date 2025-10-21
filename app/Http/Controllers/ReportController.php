<?php

namespace App\Http\Controllers;

use App\Jobs\GenerateReportJob;
use App\Models\Project;
use App\Models\Report;
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
        $reports = Report::with('project')->latest('last_generated_at')->get();
        
        // Get chart data
        $chartData = $this->getChartData();
        
        return Inertia::render('Reports/Index', [
            'reports' => $reports,
            'chartData' => $chartData
        ]);
    }

    public function generate()
    {
        GenerateReportJob::dispatch();
        
        return response()->json([
            'message' => 'Reports generation started!',
            'status' => 'queued'
        ]);
    }

    private function getChartData()
    {
        $projects = Project::with(['tasks', 'reports'])->get();
        
        // Bar chart data - Task completion by project
        $barChartData = [
            'labels' => $projects->pluck('name')->toArray(),
            'datasets' => [
                [
                    'label' => 'Completed Tasks',
                    'data' => $projects->map(function ($project) {
                        return $project->tasks->where('status', 'done')->count();
                    })->toArray(),
                    'backgroundColor' => 'rgba(34, 197, 94, 0.8)',
                    'borderColor' => 'rgba(34, 197, 94, 1)',
                    'borderWidth' => 1
                ],
                [
                    'label' => 'Pending Tasks',
                    'data' => $projects->map(function ($project) {
                        return $project->tasks->where('status', 'pending')->count();
                    })->toArray(),
                    'backgroundColor' => 'rgba(251, 191, 36, 0.8)',
                    'borderColor' => 'rgba(251, 191, 36, 1)',
                    'borderWidth' => 1
                ],
                [
                    'label' => 'In Progress Tasks',
                    'data' => $projects->map(function ($project) {
                        return $project->tasks->where('status', 'in-progress')->count();
                    })->toArray(),
                    'backgroundColor' => 'rgba(249, 115, 22, 0.8)',
                    'borderColor' => 'rgba(249, 115, 22, 1)',
                    'borderWidth' => 1
                ]
            ]
        ];

        // Pie chart data - Project distribution
        $totalTasks = $projects->sum(function ($project) {
            return $project->tasks->count();
        });

        $pieChartData = [
            'labels' => $projects->pluck('name')->toArray(),
            'datasets' => [
                [
                    'data' => $projects->map(function ($project) {
                        return $project->tasks->count();
                    })->toArray(),
                    'backgroundColor' => [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(236, 72, 153, 0.8)',
                    ],
                    'borderColor' => [
                        'rgba(59, 130, 246, 1)',
                        'rgba(16, 185, 129, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(239, 68, 68, 1)',
                        'rgba(139, 92, 246, 1)',
                        'rgba(236, 72, 153, 1)',
                    ],
                    'borderWidth' => 2
                ]
            ]
        ];

        // Line chart data - Task completion over time
        $lineChartData = [
            'labels' => $this->getLast7Days(),
            'datasets' => [
                [
                    'label' => 'Tasks Completed',
                    'data' => $this->getTaskCompletionOverTime(),
                    'backgroundColor' => 'rgba(59, 130, 246, 0.1)',
                    'borderColor' => 'rgba(59, 130, 246, 1)',
                    'borderWidth' => 2,
                    'fill' => true,
                    'tension' => 0.4
                ]
            ]
        ];

        return [
            'barChart' => $barChartData,
            'pieChart' => $pieChartData,
            'lineChart' => $lineChartData
        ];
    }

    private function getLast7Days()
    {
        $days = [];
        for ($i = 6; $i >= 0; $i--) {
            $days[] = now()->subDays($i)->format('M j');
        }
        return $days;
    }

    private function getTaskCompletionOverTime()
    {
        // This is a simplified version - in a real app, you'd query actual completion data
        return [2, 4, 3, 5, 7, 6, 8];
    }
}