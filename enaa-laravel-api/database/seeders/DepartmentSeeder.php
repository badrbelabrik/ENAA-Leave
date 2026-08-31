<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        Department::insert([
            [
                'name' => 'Administration',
                'description' => 'Administrative team',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Technical',
                'description' => 'Technical team',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Teaching',
                'description' => 'Teaching staff',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Human Resources',
                'description' => 'Human Resources department',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
