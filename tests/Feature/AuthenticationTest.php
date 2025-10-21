<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
    }

    public function test_user_can_register()
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertRedirect('/dashboard');
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'role' => 'member'
        ]);
    }

    public function test_user_can_login()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123')
        ]);

        $response = $this->post('/login', [
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);

        $response->assertRedirect('/dashboard');
        $this->assertAuthenticated();
    }

    public function test_user_can_logout()
    {
        $user = User::factory()->create();
        
        $this->actingAs($user);
        $response = $this->post('/logout');

        $response->assertRedirect('/login');
        $this->assertGuest();
    }

    public function test_user_can_request_password_reset()
    {
        $user = User::factory()->create(['email' => 'test@example.com']);

        $response = $this->post('/forgot-password', [
            'email' => 'test@example.com'
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('status');
    }

    public function test_registration_validation()
    {
        $response = $this->post('/register', [
            'name' => '',
            'email' => 'invalid-email',
            'password' => '123',
            'password_confirmation' => 'different'
        ]);

        $response->assertSessionHasErrors(['name', 'email', 'password']);
    }
}