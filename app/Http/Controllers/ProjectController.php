<?php

namespace App\Http\Controllers;

use App\Enums\TaskStatuses;
use App\Models\Project;
use App\Models\User;
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

        $projectsWithStats = $projects->map(function ($project) {
            $stats = $this->taskService->getProjectTaskStats($project->id);
            return [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'stats' => $stats,
                'latest_report' => $project->latestReport,
                'created_at' => $project->created_at,
                'updated_at' => $project->updated_at,
            ];
        });

        return Inertia::render('Projects/Index', [
            'projects' => $projectsWithStats
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

        $users = User::select('id', 'name', 'email')->get();

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'tasksByStatus' => $tasksByStatus,
            'users' => $users
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $project = Project::create($request->only(['name', 'description']));

        return redirect()->route('projects.index')
            ->with('success', 'Project created successfully!');
    }

    public function update(Request $request, Project $project)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $project->update($request->only(['name', 'description']));

        return redirect()->route('projects.index')
            ->with('success', 'Project updated successfully!');
    }

    public function destroy(Project $project)
    {
        $project->tasks()->delete();
        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully!');
    }
}