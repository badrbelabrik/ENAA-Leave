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
                'name' => 'Congés payés',
                'code' => 'CP',
                'description' => 'Congés annuels payés',
                'default_quota' => 22,
                'unit' => 'days',
                'requires_document' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Congé maladie',
                'code' => 'MAL',
                'description' => 'Absence pour raison médicale',
                'default_quota' => 10,
                'unit' => 'days',
                'requires_document' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Congé mariage',
                'code' => 'MAR',
                'description' => 'Congé exceptionnel pour mariage',
                'default_quota' => 3,
                'unit' => 'days',
                'requires_document' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Congé naissance',
                'code' => 'NAIS',
                'description' => 'Congé exceptionnel pour naissance',
                'default_quota' => 3,
                'unit' => 'days',
                'requires_document' => true,
                'is_active' => true,
            ],
        ]);
    }
}
