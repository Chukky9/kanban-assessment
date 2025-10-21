<?php

namespace App\Http\Controllers;

use App\Data\User\UserCreateData;
use App\Data\User\UserUpdateData;
use App\Enums\UserRoles;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct(
        private UserService $userService
    ) {}

    public function index()
    {
        $users = User::withTrashed()->with(['tasks'])->get();
        
        $usersWithStats = $users->map(function ($user) {
            $stats = $this->userService->getUserStats($user->id);
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'stats' => $stats,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'deleted_at' => $user->deleted_at,
            ];
        });

        return Inertia::render('Users/Index', [
            'users' => $usersWithStats
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:' . implode(',', UserRoles::values()),
        ]);

        $this->userService->createUser(new UserCreateData(
            name: $request->name,
            email: $request->email,
            password: $request->password,
            role: UserRoles::from($request->role),
        ));

        return redirect()->route('users.index')
            ->with('success', 'User created successfully!');
    }

    public function update(Request $request, int $userId)
    {
        $user = User::find($userId);
        if (!$user) {
            return redirect()->route('users.index')
                ->with('error', 'User not found!');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'role' => 'required|in:' . implode(',', UserRoles::values()),
        ]);

        $this->userService->updateUser($user, new UserUpdateData(
            name: $request->name,
            email: $request->email,
            password: $request?->password ?? null,
            role: UserRoles::from($request->role),
        ));

        return redirect()->route('users.index')
            ->with('success', 'User updated successfully!');
    }

    public function destroy(int $userId)
    {
        $user = User::find($userId);
        if (!$user) {
            return redirect()->route('users.index')
                ->with('error', 'User not found!');
        }

        $this->userService->deleteUser($user);

        return redirect()->route('users.index')
            ->with('success', 'User deleted successfully!');
    }

    public function restore(int $userId)
    {
        $this->userService->restoreUser($userId);

        return redirect()->route('users.index')
            ->with('success', 'User restored successfully!');
    }
}