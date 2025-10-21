<?php

namespace App\Models;

use App\Enums\TaskStatuses;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'status',
        'assigned_to',
        'due_date',
    ];

    protected function casts(): array
    {
        return [
            'due_date' => 'date',
            'status' => TaskStatuses::class,
        ];
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
