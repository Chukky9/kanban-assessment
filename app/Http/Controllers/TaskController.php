<?php

namespace App\Http\Controllers;

use App\Data\Task\CreateTaskData;
use App\Enums\TaskStatuses;
use App\Models\Task;
use App\Services\TaskService;
use Carbon\Carbon;
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
                due_date: $request->due_date ? Carbon::parse($request->due_date) : null,
                status: TaskStatuses::PENDING,
            )
        );

        return redirect()->route('projects.show', ['project' => $task->project])
            ->with('success', 'Task created successfully!');
    }

    public function updateStatus(Request $request, int $taskId)
    {
        $request->validate([
            'status' => 'required|in:' . implode(',', TaskStatuses::values())
        ]);

        $task = $this->taskService->updateTaskStatus($taskId, TaskStatuses::from($request->status));

        return redirect()->route('projects.show', ['project' => $task->project])
            ->with('success', 'Task status updated successfully!');
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

        return redirect()->route('projects.show', ['project' => $task->project])
            ->with('success', 'Task updated successfully!');
    }

    public function destroy(int $taskId)
    {
        $task = Task::find($taskId);
        if (!$task) {
            return redirect()->back()
                ->with('error', 'Task not found!');
        }

        $this->taskService->deleteTask($taskId);

        return redirect()->back()
            ->with('success', 'Task deleted successfully!');
    }
}