<?php

namespace Database\Seeders;

use App\Models\LeaveType;
use Illuminate\Database\Seeder;

class LeaveTypeSeeder extends Seeder
{
    public function run(): void
    {
        LeaveType::insert([
            [
                'name' => 'Paid Leave',
                'code' => 'PAID',
                'description' => 'Annual paid leave',
                'default_quota' => 22,
                'unit' => 'days',
                'requires_document' => false,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sick Leave',
                'code' => 'SICK',
                'description' => 'Leave due to illness',
                'default_quota' => 10,
                'unit' => 'days',
                'requires_document' => true,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Marriage Leave',
                'code' => 'MARRIAGE',
                'description' => 'Exceptional leave for marriage',
                'default_quota' => 3,
                'unit' => 'days',
                'requires_document' => false,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Birth Leave',
                'code' => 'BIRTH',
                'description' => 'Exceptional leave for the birth of a child',
                'default_quota' => 3,
                'unit' => 'days',
                'requires_document' => true,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
