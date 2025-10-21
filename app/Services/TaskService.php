<?php

namespace App\Services;

use App\Data\Task\CreateTaskData;
use App\Enums\TaskStatuses;
use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;

class TaskService
{
    public function createTask(CreateTaskData $data): Task
    {
        return Task::create([
            'title' => $data->title,
            'description' => $data->description,
            'project_id' => $data->project_id,
            'assigned_to' => $data->assigned_to,
            'status' => $data->status->value,
            'due_date' => $data->due_date?->toDateString(),
        ]);
    }

    public function updateTaskStatus(int $taskId, TaskStatuses $status): Task
    {
        $task = Task::findOrFail($taskId);
        $task->update(['status' => $status->value]);
        
        Log::info("Task {$taskId} status updated to {$status->value}");
        
        return $task->refresh();
    }

    public function updateTask(int $taskId, array $data): Task
    {
        $task = Task::findOrFail($taskId);
        $task->update($data);
        
        return $task->refresh();
    }

    public function getTasksByProject(int $projectId): Collection
    {
        return Task::where('project_id', $projectId)
            ->with(['assignedUser', 'project'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getTasksByStatus(int $projectId, TaskStatuses $status): Collection
    {
        return Task::where('project_id', $projectId)
            ->where('status', $status->value)
            ->with(['assignedUser'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getProjectTaskStats(int $projectId): array
    {
        $tasks = Task::where('project_id', $projectId)->get();
        
        return [
            'total_tasks' => $tasks->count(),
            'completed_tasks' => $tasks->where('status', TaskStatuses::DONE->value)->count(),
            'pending_tasks' => $tasks->where('status', TaskStatuses::PENDING->value)->count(),
            'in_progress_tasks' => $tasks->where('status', TaskStatuses::IN_PROGRESS->value)->count(),
        ];
    }

    public function deleteTask(int $taskId): bool
    {
        $task = Task::findOrFail($taskId);
        return $task->delete();
    }
}