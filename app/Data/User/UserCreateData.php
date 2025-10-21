<?php

namespace App\Data\User;

use App\Enums\UserRoles;
use Spatie\LaravelData\Data;

class UserCreateData extends Data
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
        public UserRoles $role = UserRoles::MEMBER,
    ) {}
}
