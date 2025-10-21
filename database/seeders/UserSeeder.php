<?php

namespace Database\Seeders;

use App\Enums\UserRoles;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{

    private array $testUsers = [
        [
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'password',
            'role' => 'admin',
        ],
        [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password',
            'role' => 'member',
        ],
        [
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'password' => 'password',
            'role' => 'member',
        ],
    ];
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->testUsers as $user) {
            User::create([
                'name' => $user['name'],
                'email' => $user['email'],
                'password' => Hash::make($user['password']),
                'role' => UserRoles::tryFrom($user['role']) ?? UserRoles::MEMBER,
            ]);
        }
    }
}
