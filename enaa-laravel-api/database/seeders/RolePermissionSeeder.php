<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'view own leave requests',
            'create leave request',
            'cancel own leave request',

            'view team leave requests',
            'approve manager requests',
            'reject manager requests',

            'approve HR requests',
            'reject HR requests',

            'view team calendar',
            'view global calendar',

            'manage leave types',
            'manage leave quotas',

            'export leave reports',

            'manage users',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        $admin = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);

        $hr = Role::firstOrCreate([
            'name' => 'hr',
            'guard_name' => 'web',
        ]);

        $manager = Role::firstOrCreate([
            'name' => 'manager',
            'guard_name' => 'web',
        ]);

        $employee = Role::firstOrCreate([
            'name' => 'employee',
            'guard_name' => 'web',
        ]);

        $trainer = Role::firstOrCreate([
            'name' => 'trainer',
            'guard_name' => 'web',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Admin
        |--------------------------------------------------------------------------
        */

        $admin->syncPermissions(
            Permission::all()
        );

        /*
        |--------------------------------------------------------------------------
        | HR
        |--------------------------------------------------------------------------
        */

        $hr->syncPermissions([
            'view global calendar',
            'approve HR requests',
            'reject HR requests',
            'manage leave types',
            'manage leave quotas',
            'export leave reports',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Manager
        |--------------------------------------------------------------------------
        */

        $manager->syncPermissions([
            'view team leave requests',
            'approve manager requests',
            'reject manager requests',
            'view team calendar',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Employee
        |--------------------------------------------------------------------------
        */

        $employee->syncPermissions([
            'view own leave requests',
            'create leave request',
            'cancel own leave request',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Trainer
        |--------------------------------------------------------------------------
        */

        $trainer->syncPermissions([
            'view own leave requests',
            'create leave request',
            'cancel own leave request',
        ]);
    }
}
