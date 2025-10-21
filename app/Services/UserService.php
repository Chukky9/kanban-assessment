<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Log;

class UserService
{
    public function deleteUser(int $userId): bool
    {
        $user = User::findOrFail($userId);
        $user->tasks()->update(['assigned_to' => null]);

        Log::info("User {$userId} tasks unassigned and soft deleted");
        return $user->delete();
    }

    public function restoreUser(int $userId): bool
    {
        return User::withTrashed()->findOrFail($userId)->restore();
    }

    public function forceDeleteUser(int $userId): bool
    {
        return User::withTrashed()->findOrFail($userId)->forceDelete();
    }
}