<?php

namespace App\Data\Task;

use App\Enums\TaskStatuses;
use Carbon\Carbon;
use Spatie\LaravelData\Data;

class CreateTaskData extends Data
{
    public function __construct(
        public string $title,
        public string $description,
        public int $project_id,
        public int $assigned_to,
        public TaskStatuses $status,
        public Carbon|null $due_date = null,
    ) {}
}
