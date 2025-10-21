<?php

namespace App\Enums;

enum TaskStatuses: string
{
    use EnumToArray;

    case PENDING = 'pending';
    case IN_PROGRESS = 'in-progress';
    case DONE = 'done';
}