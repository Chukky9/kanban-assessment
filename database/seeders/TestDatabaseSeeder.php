<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class TestDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create test users
        User::create([
            'name' => 'Test Admin',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Test User',
            'email' => 'user@test.com',
            'password' => bcrypt('password'),
            'role' => 'member',
        ]);

        // Create test projects
        $project1 = Project::create([
            'name' => 'Test Project 1',
            'description' => 'Test project description',
        ]);

        $project2 = Project::create([
            'name' => 'Test Project 2',
            'description' => 'Another test project',
        ]);

        // Create test tasks
        Task::create([
            'project_id' => $project1->id,
            'title' => 'Test Task 1',
            'description' => 'Test task description',
            'status' => 'pending',
            'assigned_to' => 2,
        ]);

        Task::create([
            'project_id' => $project1->id,
            'title' => 'Test Task 2',
            'description' => 'Another test task',
            'status' => 'done',
            'assigned_to' => 2,
        ]);
    }
}