<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Services\TaskService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        private TaskService $taskService
    ) {}

    public function index()
    {
        $projects = Project::with(['tasks', 'latestReport'])->get();
        
        $projectsWithStats = $projects->map(function ($project) {
            $stats = $this->taskService->getProjectTaskStats($project->id);
            return [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'stats' => $stats,
                'latest_report' => $project->latestReport
            ];
        });

        return Inertia::render('Dashboard', [
            'projects' => $projectsWithStats
        ]);
    }
}