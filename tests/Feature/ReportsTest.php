<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportsTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->actingAs($this->user);
    }

    public function test_can_view_reports()
    {
        Report::factory()->count(3)->create();

        $response = $this->get('/reports');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Reports/Index')
                ->has('reports', 3)
                ->has('chartData')
        );
    }

    public function test_can_generate_reports()
    {
        Project::factory()->count(2)->create();

        $response = $this->post('/reports/generate');

        $this->artisan('queue:work', ['--once' => true]);
        $response->assertJson([
            'message' => 'Reports generation started!',
            'status' => 'queued'
        ]);
        $response->assertStatus(200);
    }

    public function test_reports_contain_chart_data()
    {
        $project = Project::factory()->create();
        Report::factory()->create(['project_id' => $project->id]);

        $response = $this->get('/reports');

        $response->assertInertia(fn ($page) => 
            $page->has('chartData')
                ->has('chartData.barChart')
                ->has('chartData.pieChart')
                ->has('chartData.lineChart')
        );
    }
}