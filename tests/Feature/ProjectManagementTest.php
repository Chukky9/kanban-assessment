<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->actingAs($this->user);
    }

    public function test_can_view_projects_index()
    {
        Project::factory()->count(3)->create();

        $response = $this->get('/projects');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Projects/Index')
                ->has('projects', 3)
        );
    }

    public function test_can_create_project()
    {
        $projectData = [
            'name' => 'Test Project',
            'description' => 'Test project description'
        ];

        $response = $this->post('/projects', $projectData);

        $response->assertRedirect('/projects');
        $this->assertDatabaseHas('projects', $projectData);
    }

    public function test_can_view_project_details()
    {
        $project = Project::factory()->create();

        $response = $this->get("/projects/{$project->id}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Projects/Show')
                ->has('project')
                ->has('tasksByStatus')
                ->has('users')
        );
    }

    public function test_can_update_project()
    {
        $project = Project::factory()->create();
        $updateData = [
            'name' => 'Updated Project Name',
            'description' => 'Updated description'
        ];

        $response = $this->put("/projects/{$project->id}", $updateData);

        $response->assertRedirect('/projects');
        $this->assertDatabaseHas('projects', $updateData);
    }

    public function test_can_delete_project()
    {
        $project = Project::factory()->create();

        $response = $this->delete("/projects/{$project->id}");

        $response->assertRedirect('/projects');
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    public function test_project_creation_validation()
    {
        $response = $this->post('/projects', [
            'name' => '',
            'description' => ''
        ]);

        $response->assertSessionHasErrors(['name']);
    }
}