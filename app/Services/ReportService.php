<?php

namespace App\Services;

use App\Models\Report;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Support\Facades\Log;

class ReportService
{
    public function generateReportForProject(int $projectId): Report
    {
        $project = Project::findOrFail($projectId);
        $stats = $this->calculateProjectStats($projectId);
        
        $report = Report::updateOrCreate(
            ['project_id' => $projectId],
            [
                'total_tasks' => $stats['total_tasks'],
                'completed_tasks' => $stats['completed_tasks'],
                'pending_tasks' => $stats['pending_tasks'],
                'in_progress_tasks' => $stats['in_progress_tasks'],
                'last_generated_at' => now(),
            ]
        );

        Log::info("Report generated for project: {$project->name}", [
            'project_id' => $projectId,
            'stats' => $stats
        ]);

        return $report;
    }

    public function generateReportsForAllProjects(): array
    {
        $projects = Project::all();
        $reports = [];

        foreach ($projects as $project) {
            $reports[] = $this->generateReportForProject($project->id);
        }

        Log::info("Generated reports for all projects", [
            'total_projects' => $projects->count(),
            'reports_generated' => count($reports)
        ]);

        return $reports;
    }

    public function calculateProjectStats(int $projectId): array
    {
        $tasks = Task::where('project_id', $projectId)->get();
        
        return [
            'total_tasks' => $tasks->count(),
            'completed_tasks' => $tasks->where('status', 'done')->count(),
            'pending_tasks' => $tasks->where('status', 'pending')->count(),
            'in_progress_tasks' => $tasks->where('status', 'in-progress')->count(),
        ];
    }

    public function getLatestReport(int $projectId): ?Report
    {
        return Report::where('project_id', $projectId)
            ->latest('last_generated_at')
            ->first();
    }

    public function getAllLatestReports(): array
    {
        $projects = Project::with('latestReport')->get();
        
        return $projects->map(function ($project) {
            return [
                'project' => $project,
                'report' => $project->latestReport,
                'stats' => $this->calculateProjectStats($project->id)
            ];
        })->toArray();
    }
}