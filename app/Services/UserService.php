<?php

namespace App\Services;

use App\Data\User\UserCreateData;
use App\Data\User\UserUpdateData;
use App\Enums\TaskStatuses;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserService
{
    public function createUser(UserCreateData $data): User
    {
        $user = User::create([
            'name' => $data->name,
            'email' => $data->email,
            'password' => Hash::make($data->password),
            'role' => $data->role->value,
        ]);
        
        Log::info("User created: {$user->name}", [
            'user_id' => $user->id,
            'email' => $user->email,
            'role' => $user->role
        ]);
        
        return $user;
    }

    public function updateUser(User $user, UserUpdateData $data): User
    {
        $updateData = [
            'name' => $data->name,
            'email' => $data->email,
            'role' => $data->role->value,
        ];

        if (!empty($data->password)) {
            $updateData['password'] = Hash::make($data->password);
        }

        $user->update($updateData);
        
        Log::info("User updated: {$user->name}", [
            'user_id' => $user->id,
            'email' => $user->email,
            'role' => $user->role
        ]);
        
        return $user->refresh();
    }

    public function deleteUser(User $user): bool
    {
        $userName = $user->name;
        $userId = $user->id;

        if ($user->tasks()->exists()) {
            $userTasks = $user->tasks();
            Log::info("User tasks found with count: {$userTasks->count()}. Now unassigning from user.", [
                'user_id' => $userId,
                'user_tasks' => $userTasks->pluck('id')->toArray()
            ]);
            $userTasks->update([
                'assigned_to' => null,
                'status' => TaskStatuses::PENDING->value,
            ]);
        }
        
        $user->delete();
        
        Log::info("User deleted: {$userName}", [
            'user_id' => $userId
        ]);
        
        return true;
    }

    public function restoreUser(int $userId): bool
    {
        $user = User::withTrashed()->find($userId);
        
        if ($user) {
            $user->restore();
            
            Log::info("User restored: {$user->name}", [
                'user_id' => $userId
            ]);
            
            return true;
        }
        
        return false;
    }

    public function getUserStats(int $userId): array
    {
        $user = User::withTrashed()->find($userId);
        
        if (!$user) {
            return [
                'total_tasks' => 0,
                'completed_tasks' => 0,
                'pending_tasks' => 0,
                'in_progress_tasks' => 0,
            ];
        }

        $tasks = $user->tasks;
        
        return [
            'total_tasks' => $tasks->count(),
            'completed_tasks' => $tasks->where('status', TaskStatuses::DONE->value)->count(),
            'pending_tasks' => $tasks->where('status', TaskStatuses::PENDING->value)->count(),
            'in_progress_tasks' => $tasks->where('status', TaskStatuses::IN_PROGRESS->value)->count(),
        ];
    }
}