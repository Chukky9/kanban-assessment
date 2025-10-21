<?php

namespace Tests\Feature;

use App\Enums\UserRoles;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $member;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => UserRoles::ADMIN->value]);
        $this->member = User::factory()->create(['role' => UserRoles::MEMBER->value]);
    }

    public function test_member_cannot_view_users()
    {
        $this->actingAs($this->member);
        
        $response = $this->get('/users');

        $response->assertStatus(403);
    }

    public function test_admin_can_create_user()
    {
        $this->actingAs($this->admin);
        
        $userData = [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'member'
        ];

        $response = $this->post('/users', $userData);

        $response->assertRedirect('/users');
        $this->assertDatabaseHas('users', [
            'email' => 'newuser@example.com',
            'role' => 'member'
        ]);
    }

    public function test_admin_can_update_user()
    {
        $this->actingAs($this->admin);
        
        $user = User::factory()->create();
        $updateData = [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'role' => 'admin'
        ];

        $response = $this->put("/users/{$user->id}", $updateData);

        $response->assertRedirect('/users');
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name',
            'role' => 'admin'
        ]);
    }

    public function test_admin_can_delete_user()
    {
        $this->actingAs($this->admin);
        
        $user = User::factory()->create();

        $response = $this->delete("/users/{$user->id}");

        $response->assertRedirect('/users');
        $this->assertSoftDeleted('users', ['id' => $user->id]);
    }

    public function test_admin_can_restore_user()
    {
        $this->actingAs($this->admin);
        
        $user = User::factory()->create();
        $user->delete(); // Soft delete

        $response = $this->patch("/users/{$user->id}/restore");

        $response->assertRedirect('/users');
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'deleted_at' => null
        ]);
    }
}