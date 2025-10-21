<?php

namespace Tests\Feature;

use App\Enums\TaskStatuses;
use App\Enums\UserRoles;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IntegrationTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
    }

    public function test_complete_project_workflow()
    {
        // Create admin user
        $admin = User::factory()->create(['role' => UserRoles::ADMIN->value]);
        $this->actingAs($admin);

        // Create project
        $projectData = [
            'name' => 'Integration Test Project',
            'description' => 'Test project for integration testing'
        ];
        
        $this->post('/projects', $projectData);
        $project = Project::where('name', 'Integration Test Project')->first();

        // Create task
        $taskData = [
            'project_id' => $project->id,
            'title' => 'Integration Test Task',
            'description' => 'Test task for integration testing',
            'assigned_to' => $admin->id
        ];
        
        $this->post('/tasks', $taskData);
        $task = Task::where('title', 'Integration Test Task')->first();

        // Update task status
        $this->patch("/tasks/{$task->id}/status", ['status' => TaskStatuses::IN_PROGRESS->value]);

        // Generate reports
        $this->post('/reports/generate');

        // Verify everything was created
        $this->assertDatabaseHas('projects', ['name' => 'Integration Test Project']);
        $this->assertDatabaseHas('tasks', [
            'title' => 'Integration Test Task',
            'status' => 'in-progress'
        ]);
    }

    public function test_kanban_board_functionality()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $project = Project::factory()->create();
        
        // Create tasks in different statuses
        Task::factory()->create(['project_id' => $project->id, 'status' => TaskStatuses::PENDING->value]);
        Task::factory()->create(['project_id' => $project->id, 'status' => TaskStatuses::IN_PROGRESS->value]);
        Task::factory()->create(['project_id' => $project->id, 'status' => TaskStatuses::DONE->value]);

        $response = $this->get("/projects/{$project->id}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Projects/Show')
                ->has('tasksByStatus.pending', 1)
                ->has('tasksByStatus.in-progress', 1)
                ->has('tasksByStatus.done', 1)
        );
    }
}