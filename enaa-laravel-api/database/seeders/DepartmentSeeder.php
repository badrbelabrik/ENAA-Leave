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
                'description' => 'Équipe administrative',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Technique',
                'description' => 'Équipe technique',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Pédagogie',
                'description' => 'Corps professoral',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ressources Humaines',
                'description' => 'Service RH',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
