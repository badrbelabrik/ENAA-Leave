<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $administration = Department::where('name', 'Administration')->first();
        $technical = Department::where('name', 'Technical')->first();
        $teaching = Department::where('name', 'Teaching')->first();
        $hrDepartment = Department::where('name', 'Human Resources')->first();

        /*
        |--------------------------------------------------------------------------
        | Admin
        |--------------------------------------------------------------------------
        */

        $admin = User::create([
            'name' => 'Admin ENAA',
            'email' => 'admin@enaa.local',
            'password' => Hash::make('password'),
            'department_id' => $administration->id,
            'position' => 'Administrator',
        ]);

        $admin->assignRole('admin');

        /*
        |--------------------------------------------------------------------------
        | HR
        |--------------------------------------------------------------------------
        */

        $hr = User::create([
            'name' => 'Emily HR',
            'email' => 'hr@enaa.local',
            'password' => Hash::make('password'),
            'department_id' => $hrDepartment->id,
            'position' => 'HR Manager',
        ]);

        $hr->assignRole('hr');

        /*
        |--------------------------------------------------------------------------
        | Manager
        |--------------------------------------------------------------------------
        */

        $manager = User::create([
            'name' => 'John Manager',
            'email' => 'manager@enaa.local',
            'password' => Hash::make('password'),
            'department_id' => $technical->id,
            'position' => 'Technical Manager',
        ]);

        $manager->assignRole('manager');

        /*
        |--------------------------------------------------------------------------
        | Employee
        |--------------------------------------------------------------------------
        */

        $employee = User::create([
            'name' => 'Sarah Employee',
            'email' => 'employee@enaa.local',
            'password' => Hash::make('password'),
            'department_id' => $technical->id,
            'manager_id' => $manager->id,
            'position' => 'Web Developer',
        ]);

        $employee->assignRole('employee');

        /*
        |--------------------------------------------------------------------------
        | Trainer
        |--------------------------------------------------------------------------
        */

        $trainer = User::create([
            'name' => 'Michael Trainer',
            'email' => 'trainer@enaa.local',
            'password' => Hash::make('password'),
            'department_id' => $teaching->id,
            'manager_id' => $manager->id,
            'position' => 'Trainer',
        ]);

        $trainer->assignRole([
            'employee',
            'trainer',
        ]);
    }
}
