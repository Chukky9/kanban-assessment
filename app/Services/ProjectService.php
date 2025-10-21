<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Support\Facades\Log;

class ProjectService
{
    public function createProject(array $data): Project
    {
        $project = Project::create($data);
        
        Log::info("Project created: {$project->name}", [
            'project_id' => $project->id,
            'name' => $project->name
        ]);
        
        return $project;
    }

    public function updateProject(Project $project, array $data): Project
    {
        $project->update($data);
        
        Log::info("Project updated: {$project->name}", [
            'project_id' => $project->id,
            'name' => $project->name
        ]);
        
        return $project->fresh();
    }

    public function deleteProject(Project $project): bool
    {
        $projectName = $project->name;
        $projectId = $project->id;
        
        $project->delete();
        
        Log::info("Project deleted: {$projectName}", [
            'project_id' => $projectId
        ]);
        
        return true;
    }

    public function getProjectsWithStats()
    {
        return Project::with(['tasks', 'latestReport'])->get()->map(function ($project) {
            $stats = $this->calculateProjectStats($project->id);
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
    }

    private function calculateProjectStats(int $projectId): array
    {
        $tasks = \App\Models\Task::where('project_id', $projectId)->get();
        
        return [
            'total_tasks' => $tasks->count(),
            'completed_tasks' => $tasks->where('status', 'done')->count(),
            'pending_tasks' => $tasks->where('status', 'pending')->count(),
            'in_progress_tasks' => $tasks->where('status', 'in-progress')->count(),
        ];
    }
}