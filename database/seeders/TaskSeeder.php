<?php

namespace Database\Seeders;

use App\Enums\TaskStatuses;
use App\Enums\UserRoles;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = Project::all();
        $users = User::where('role', UserRoles::MEMBER->value)->get();

        foreach ($projects as $project) {
            // Create tasks for each project
            Task::create([
                'project_id' => $project->id,
                'title' => 'Project Planning',
                'description' => 'Define project scope and requirements',
                'status' => TaskStatuses::DONE->value,
                'assigned_to' => $users->random()->id,
                'due_date' => Carbon::now()->subDays(5),
            ]);

            Task::create([
                'project_id' => $project->id,
                'title' => 'Design Phase',
                'description' => 'Create wireframes and mockups',
                'status' => TaskStatuses::IN_PROGRESS->value,
                'assigned_to' => $users->random()->id,
                'due_date' => Carbon::now()->addDays(3),
            ]);

            Task::create([
                'project_id' => $project->id,
                'title' => 'Development',
                'description' => 'Implement core functionality',
                'status' => TaskStatuses::PENDING->value,
                'assigned_to' => $users->random()->id,
                'due_date' => Carbon::now()->addDays(7),
            ]);

            Task::create([
                'project_id' => $project->id,
                'title' => 'Testing',
                'description' => 'Quality assurance and bug fixes',
                'status' => TaskStatuses::PENDING->value,
                'assigned_to' => $users->random()->id,
                'due_date' => Carbon::now()->addDays(10),
            ]);
        }
    }
}
