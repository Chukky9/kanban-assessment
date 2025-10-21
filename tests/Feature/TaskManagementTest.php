<?php

namespace Tests\Feature;

use App\Enums\TaskStatuses;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
    }

    public function test_can_create_task()
    {
        $project = Project::factory()->create();
        $user = User::factory()->create();

        $response = $this->post('/tasks', [
            'project_id' => $project->id,
            'title' => 'Test Task',
            'description' => 'Test Description',
            'assigned_to' => $user->id,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('tasks', [
            'title' => 'Test Task',
            'project_id' => $project->id,
        ]);
    }

    public function test_can_update_task_status()
    {
        $task = Task::factory()->create(['status' => TaskStatuses::PENDING->value]);

        $response = $this->patch("/tasks/{$task->id}/status", [
            'status' => TaskStatuses::IN_PROGRESS->value
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'status' => TaskStatuses::IN_PROGRESS->value
        ]);
    }
}
