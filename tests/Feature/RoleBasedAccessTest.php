<?php

namespace Tests\Feature;

use App\Enums\UserRoles;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleBasedAccessTest extends TestCase
{
    use RefreshDatabase;
    
    public function setUp(): void
    {
        parent::setUp();
    }

    public function test_admin_can_access_users_module()
    {
        $admin = User::factory()->create(['role' => UserRoles::ADMIN->value]);
        $this->actingAs($admin);

        $response = $this->get('/users');
        $response->assertStatus(200);
    }

    public function test_member_cannot_access_users_module()
    {
        $member = User::factory()->create(['role' => UserRoles::MEMBER->value]);
        $this->actingAs($member);

        $response = $this->get('/users');
        $response->assertStatus(403);
    }

    public function test_guest_cannot_access_protected_routes()
    {
        $response = $this->get('/dashboard');
        $response->assertRedirect('/login');
    }

    public function test_authenticated_user_can_access_dashboard()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get('/dashboard');
        $response->assertStatus(200);
    }
}