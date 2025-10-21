<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Task;
use App\Enums\TaskStatuses;
use App\Services\ReportService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
    }

    public function test_can_generate_report_for_project()
    {
        $project = Project::factory()->create();
        Task::factory()->create(['project_id' => $project->id, 'status' => TaskStatuses::DONE->value]);
        Task::factory()->create(['project_id' => $project->id, 'status' => TaskStatuses::PENDING->value]);

        $reportService = app(ReportService::class);
        $report = $reportService->generateReportForProject($project->id);

        $this->assertDatabaseHas('reports', [
            'project_id' => $project->id,
            'total_tasks' => 2,
            'completed_tasks' => 1,
            'pending_tasks' => 1,
        ]);

        $this->assertEquals(2, $report->total_tasks);
        $this->assertEquals(1, $report->completed_tasks);
        $this->assertEquals(1, $report->pending_tasks);
    }

    public function test_can_generate_reports_for_all_projects()
    {
        $project1 = Project::factory()->create();
        $project2 = Project::factory()->create();
        
        Task::factory()->create(['project_id' => $project1->id, 'status' => TaskStatuses::DONE->value]);
        Task::factory()->create(['project_id' => $project2->id, 'status' => TaskStatuses::PENDING->value]);

        $reportService = app(ReportService::class);
        $reports = $reportService->generateReportsForAllProjects();

        $this->assertCount(2, $reports);
        $this->assertDatabaseHas('reports', [
            'project_id' => $project1->id,
            'total_tasks' => 1,
            'completed_tasks' => 1,
        ]);
        $this->assertDatabaseHas('reports', [
            'project_id' => $project2->id,
            'total_tasks' => 1,
            'pending_tasks' => 1,
        ]);
    }
}