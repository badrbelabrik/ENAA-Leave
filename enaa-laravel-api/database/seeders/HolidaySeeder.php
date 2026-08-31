<?php

namespace Database\Seeders;

use App\Models\Holiday;
use Illuminate\Database\Seeder;

class HolidaySeeder extends Seeder
{
    public function run(): void
    {
        $holidays = [
            [
                'name' => 'New Year',
                'date' => '2026-01-01',
            ],
            [
                'name' => 'Labour Day',
                'date' => '2026-05-01',
            ],
            [
                'name' => 'Throne Day',
                'date' => '2026-07-30',
            ],
            [
                'name' => 'Oued Ed-Dahab Day',
                'date' => '2026-08-14',
            ],
            [
                'name' => 'Revolution Day',
                'date' => '2026-08-20',
            ],
            [
                'name' => 'Youth Day',
                'date' => '2026-08-21',
            ],
            [
                'name' => 'Green March Day',
                'date' => '2026-11-06',
            ],
            [
                'name' => 'Independence Day',
                'date' => '2026-11-18',
            ],
        ];

        foreach ($holidays as $holiday) {
            Holiday::create($holiday);
        }
    }
}
