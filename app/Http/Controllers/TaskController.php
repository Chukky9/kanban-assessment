<?php

namespace App\Http\Controllers;

use App\Data\Task\CreateTaskData;
use App\Enums\TaskStatuses;
use App\Services\TaskService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TaskController extends Controller
{
    public function __construct(
        private TaskService $taskService
    ) {}

    public function store(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
        ]);

        $task = $this->taskService->createTask(
            new CreateTaskData(
                project_id: $request->project_id,
                title: $request->title,
                description: $request->description,
                assigned_to: $request->assigned_to,
                due_date: $request->due_date,
                status: TaskStatuses::PENDING,
            )
        );

        return response()->json($task->load('assignedUser'));
    }

    public function updateStatus(Request $request, int $taskId)
    {
        $request->validate([
            'status' => 'required|in:pending,in-progress,done'
        ]);

        $task = $this->taskService->updateTaskStatus($taskId, TaskStatuses::from($request->status));

        return response()->json([
            'task' => $task->load('assignedUser'),
            'message' => 'Task status updated successfully'
        ]);
    }

    public function update(Request $request, int $taskId)
    {
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
        ]);

        $task = $this->taskService->updateTask($taskId, $request->all());

        return response()->json($task->load('assignedUser'));
    }

    public function destroy(int $taskId)
    {
        $this->taskService->deleteTask($taskId);

        return response()->json(['message' => 'Task deleted successfully']);
    }
}