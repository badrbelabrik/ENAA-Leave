<?php

namespace App\Services;

use App\Enums\LeaveDurationType;
use App\Models\Holiday;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class LeaveCalculatorService
{
    /**
     * Calculate working days between two dates,
     * excluding weekends and registered holidays.
     */
    public function calculate(
        Carbon $startDate,
        Carbon $endDate,
        LeaveDurationType $durationType
    ): float {
        $holidays = Holiday::whereBetween(
            'date',
            [
                $startDate->toDateString(),
                $endDate->toDateString(),
            ]
        )
            ->pluck('date')
            ->map(fn ($date) => Carbon::parse($date)->toDateString())
            ->toArray();

        $workingDays = 0;

        $period = CarbonPeriod::create(
            $startDate,
            $endDate
        );

        foreach ($period as $date) {
            if ($date->isWeekend()) {
                continue;
            }

            if (in_array($date->toDateString(), $holidays)) {
                continue;
            }

            $workingDays++;
        }

        /*
        |--------------------------------------------------------------------------
        | Half-day
        |--------------------------------------------------------------------------
        */

        if (
            $startDate->isSameDay($endDate) &&
            in_array($durationType, [
                LeaveDurationType::HALF_DAY_MORNING,
                LeaveDurationType::HALF_DAY_AFTERNOON,
            ])
        ) {
            return 0.5;
        }

        return $workingDays;
    }
}
