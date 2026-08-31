<?php

namespace App\Enums;

enum LeaveRequestStatus: string
{
    case PENDING_MANAGER = 'pending_manager';
    case PENDING_HR = 'pending_hr';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
    case NEEDS_CLARIFICATION = 'needs_clarification';
    case CANCELLED = 'cancelled';
}
