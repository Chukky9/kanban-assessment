<?php

namespace App\Enums;

enum UserRoles: string
{
    use EnumToArray;

    case ADMIN = 'admin';
    case MEMBER = 'member';
}
