<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Project $project;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->project = Project::factory()->create();
        $this->actingAs($this->user);
    }

    public function test_can_create_task()
    {
        $taskData = [
            'project_id' => $this->project->id,
            'title' => 'Test Task',
            'description' => 'Test task description',
            'assigned_to' => $this->user->id,
            'due_date' => now()->addDays(7)->format('Y-m-d')
        ];

        $response = $this->post('/tasks', $taskData);

        $response->assertStatus(302);
        $this->assertDatabaseHas('tasks', [
            'title' => 'Test Task',
            'project_id' => $this->project->id
        ]);
    }

    public function test_can_update_task_status()
    {
        $task = Task::factory()->create([
            'project_id' => $this->project->id,
            'status' => 'pending'
        ]);

        $response = $this->patch("/tasks/{$task->id}/status", [
            'status' => 'in-progress'
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'status' => 'in-progress'
        ]);
    }

    public function test_can_update_task()
    {
        $task = Task::factory()->create(['project_id' => $this->project->id]);
        $updateData = [
            'title' => 'Updated Task Title',
            'description' => 'Updated description',
            'assigned_to' => $this->user->id
        ];

        $response = $this->put("/tasks/{$task->id}", $updateData);

        $response->assertStatus(302);
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Updated Task Title'
        ]);
    }

    public function test_can_delete_task()
    {
        $task = Task::factory()->create(['project_id' => $this->project->id]);

        $response = $this->delete("/tasks/{$task->id}");

        $response->assertStatus(302);
        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    public function test_task_creation_validation()
    {
        $response = $this->post('/tasks', [
            'project_id' => $this->project->id,
            'title' => '',
            'assigned_to' => 999 // Non-existent user
        ]);

        $response->assertSessionHasErrors(['title', 'assigned_to']);
    }
}