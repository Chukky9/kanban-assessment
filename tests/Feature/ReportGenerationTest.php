<?php

namespace Tests\Feature;

use App\Jobs\GenerateReportJob;
use App\Models\Project;
use App\Models\Task;
use App\Enums\TaskStatuses;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class ReportGenerationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
    }

    // public function test_can_generate_reports_manually()
    // {
    //     // Mock the queue to process immediately
    //     Queue::fake();

    //     $project = Project::factory()->create();
    //     Task::factory()->create(['project_id' => $project->id, 'status' => TaskStatuses::DONE->value]);
    //     Task::factory()->create(['project_id' => $project->id, 'status' => TaskStatuses::PENDING->value]);

    //     $response = $this->post('/reports/generate');
    //     // Process the queue job
    //     $this->artisan('queue:work', ['--once' => true, '--timeout' => 10]);

    //     $response->assertStatus(302);
    //     $this->assertDatabaseHas('reports', [
    //         'project_id' => $project->id,
    //         'total_tasks' => 2,
    //         'completed_tasks' => 1,
    //         'pending_tasks' => 1,
    //     ]);
    // }

    public function test_can_generate_reports_directly()
    {
        $project = Project::factory()->create();
        Task::factory()->create(['project_id' => $project->id, 'status' => TaskStatuses::DONE->value]);
        Task::factory()->create(['project_id' => $project->id, 'status' => TaskStatuses::PENDING->value]);

        // Call the service directly
        $reportService = app(\App\Services\ReportService::class);
        $reportService->generateReportsForAllProjects();

        $this->assertDatabaseHas('reports', [
            'project_id' => $project->id,
            'total_tasks' => 2,
            'completed_tasks' => 1,
            'pending_tasks' => 1,
        ]);
    }

    public function test_report_generation_job_dispatches()
    {
        Queue::fake();

        $this->artisan('reports:generate');

        Queue::assertPushed(GenerateReportJob::class);
    }
}