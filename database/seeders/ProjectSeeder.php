<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    private array $testProjects = [
        [
            'name' => 'Website Redesign',
            'description' => 'Complete redesign of the company website with modern UI/UX',
        ],
        [
            'name' => 'Mobile App Development',
            'description' => 'Building a cross-platform mobile application',
        ],
        [
            'name' => 'API Integration',
            'description' => 'Integrating third-party APIs for payment processing',
        ],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->testProjects as $project) {
            Project::create($project);
        }
    }
}
