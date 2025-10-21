<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function __construct(
        private UserService $userService
    ) {}

    public function index()
    {
        $users = User::withTrashed()->get();
        return response()->json($users);
    }

    public function destroy(int $userId): JsonResponse
    {
        $this->userService->deleteUser($userId);
        
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function restore(int $userId): JsonResponse
    {
        $this->userService->restoreUser($userId);
        
        return response()->json(['message' => 'User restored successfully']);
    }
}