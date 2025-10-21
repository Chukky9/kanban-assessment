<?php

namespace App\Http\Controllers;

use App\Enums\TaskStatuses;
use App\Models\Project;
use App\Services\TaskService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function __construct(
        private TaskService $taskService
    ) {}

    public function index()
    {
        $projects = Project::with(['tasks', 'latestReport'])->get();
        
        return Inertia::render('Projects/Index', [
            'projects' => $projects
        ]);
    }

    public function show(Project $project)
    {
        $project->load(['tasks.assignedUser', 'latestReport']);
        
        $tasksByStatus = [
            'pending' => $this->taskService->getTasksByStatus($project->id, TaskStatuses::PENDING),
            'in-progress' => $this->taskService->getTasksByStatus($project->id, TaskStatuses::IN_PROGRESS),
            'done' => $this->taskService->getTasksByStatus($project->id, TaskStatuses::DONE),
        ];

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'tasksByStatus' => $tasksByStatus
        ]);
    }
}