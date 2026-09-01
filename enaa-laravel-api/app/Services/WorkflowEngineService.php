<?php

namespace App\Services;

use App\Enums\LeaveRequestStatus;
use App\Models\LeaveApproval;
use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class WorkflowEngineService
{
    /**
     * Approve a leave request according to its current workflow status.
     */
    public function approve(
        LeaveRequest $leaveRequest,
        User $approver
    ): LeaveRequest {
        return DB::transaction(function () use (
            $leaveRequest,
            $approver
        ) {
            $status = $leaveRequest->status->value;

            if ($status === LeaveRequestStatus::PENDING_MANAGER->value) {
                $this->approveByManager(
                    $leaveRequest,
                    $approver
                );

                return $leaveRequest->refresh();
            }

            if ($status === LeaveRequestStatus::PENDING_HR->value) {
                $this->approveByHr(
                    $leaveRequest,
                    $approver
                );

                return $leaveRequest->refresh();
            }

            throw new InvalidArgumentException(
                'This leave request cannot be approved in its current status.'
            );
        });
    }

    /**
     * Reject a leave request.
     */
    public function reject(
        LeaveRequest $leaveRequest,
        User $approver,
        ?string $comment = null
    ): LeaveRequest {
        return DB::transaction(function () use (
            $leaveRequest,
            $approver,
            $comment
        ) {
            $status = $leaveRequest->status->value;

            if (
                !in_array(
                    $status,
                    [
                        LeaveRequestStatus::PENDING_MANAGER->value,
                        LeaveRequestStatus::PENDING_HR->value,
                    ],
                    true
                )
            ) {
                throw new InvalidArgumentException(
                    'This leave request cannot be rejected in its current status.'
                );
            }

            if (
                $status === LeaveRequestStatus::PENDING_MANAGER->value
            ) {
                $this->ensureManagerCanApprove(
                    $leaveRequest,
                    $approver
                );

                $level = 'manager';
            } else {
                $this->ensureHrCanApprove($approver);

                $level = 'hr';
            }

            LeaveApproval::create([
                'leave_request_id' => $leaveRequest->id,
                'approver_id' => $approver->id,
                'level' => $level,
                'status' => 'rejected',
                'comment' => $comment,
                'approved_at' => now(),
            ]);

            $leaveRequest->update([
                'status' => LeaveRequestStatus::REJECTED->value,
                'rejection_reason' => $comment,
            ]);

            return $leaveRequest->refresh();
        });
    }

    /**
     * Handle manager approval.
     */
    private function approveByManager(
        LeaveRequest $leaveRequest,
        User $approver
    ): void {
        $this->ensureManagerCanApprove(
            $leaveRequest,
            $approver
        );

        LeaveApproval::create([
            'leave_request_id' => $leaveRequest->id,
            'approver_id' => $approver->id,
            'level' => 'manager',
            'status' => 'approved',
            'approved_at' => now(),
        ]);

        $leaveRequest->update([
            'status' => LeaveRequestStatus::PENDING_HR->value,
        ]);
    }

    /**
     * Handle HR approval.
     */
    private function approveByHr(LeaveRequest $leaveRequest, User $approver): void
    {
        $this->ensureHrCanApprove($approver);

        $balance = LeaveBalance::where('user_id', $leaveRequest->user_id)
            ->where('leave_type_id', $leaveRequest->leave_type_id)
            ->where('year', $leaveRequest->start_date->year)
            ->lockForUpdate()
            ->first();

        if (!$balance) {
            throw new InvalidArgumentException(
                'No leave balance was found for this employee and leave type.'
            );
        }

        $requestedDays = (float) $leaveRequest->total_days;

        if ((float) $balance->remaining < $requestedDays) {
            throw new InvalidArgumentException(
                'Insufficient leave balance.'
            );
        }

        LeaveApproval::create([
            'leave_request_id' => $leaveRequest->id,
            'approver_id' => $approver->id,
            'level' => 'hr',
            'status' => 'approved',
            'approved_at' => now(),
        ]);

        $balance->update([
            'used' => (float) $balance->used + $requestedDays,
            'remaining' => (float) $balance->remaining - $requestedDays,
        ]);

        $leaveRequest->update([
            'status' => LeaveRequestStatus::APPROVED->value,
            'approved_at' => now(),
        ]);
    }

    /**
     * Ensure that the approver is the employee's manager.
     */
    private function ensureManagerCanApprove(
        LeaveRequest $leaveRequest,
        User $approver
    ): void {
        $employee = $leaveRequest->user;

        if (!$employee) {
            throw new InvalidArgumentException(
                'The employee associated with this leave request was not found.'
            );
        }

        if (
            !$employee->manager_id ||
            (int) $employee->manager_id !== (int) $approver->id
        ) {
            throw new InvalidArgumentException(
                'You are not authorized to approve this leave request.'
            );
        }
    }

    /**
     * Ensure that the approver has the HR role.
     */
    private function ensureHrCanApprove(
        User $approver
    ): void {
        if (!$approver->hasRole('hr')) {
            throw new InvalidArgumentException(
                'Only HR can approve this leave request.'
            );
        }
    }
}
