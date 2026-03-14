<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RoleSwitchAuditTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_switch_to_owned_role_and_action_is_audited(): void
    {
        Role::query()->firstOrCreate(['name' => 'editor', 'guard_name' => 'web']);
        Role::query()->firstOrCreate(['name' => 'student', 'guard_name' => 'web']);

        $user = User::factory()->create();
        $user->assignRole(['editor', 'student']);

        $response = $this->actingAs($user)->post(route('role.switch'), [
            'role' => 'editor',
        ]);

        $response->assertRedirect(route('editor.dashboard', absolute: false));
        $this->assertSame('editor', session('active_role'));

        $this->assertDatabaseHas('audit_logs', [
            'acting_user_id' => $user->id,
            'action' => 'role_switched',
            'new_state' => 'editor',
            'entity_type' => 'session',
            'entity_label' => 'active_role',
        ]);
    }

    public function test_user_cannot_switch_to_unowned_role(): void
    {
        Role::query()->firstOrCreate(['name' => 'student', 'guard_name' => 'web']);
        Role::query()->firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);

        $user = User::factory()->create();
        $user->assignRole('student');

        $response = $this->actingAs($user)->post(route('role.switch'), [
            'role' => 'admin',
        ]);

        $response->assertSessionHas('error');
        $this->assertDatabaseMissing('audit_logs', [
            'acting_user_id' => $user->id,
            'action' => 'role_switched',
            'new_state' => 'admin',
        ]);
    }
}
