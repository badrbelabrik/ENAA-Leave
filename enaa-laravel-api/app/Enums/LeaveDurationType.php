<?php

namespace App\Enums;

enum LeaveDurationType: string
{
    case FULL_DAY = 'full_day';
    case HALF_DAY_MORNING = 'half_day_morning';
    case HALF_DAY_AFTERNOON = 'half_day_afternoon';
}
