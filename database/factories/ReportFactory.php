<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\Report;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Report>
 */
class ReportFactory extends Factory
{

    protected $model = Report::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'total_tasks' => $this->faker->numberBetween(5, 50),
            'completed_tasks' => $this->faker->numberBetween(0, 20),
            'pending_tasks' => $this->faker->numberBetween(0, 15),
            'in_progress_tasks' => $this->faker->numberBetween(0, 10),
            'last_generated_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
