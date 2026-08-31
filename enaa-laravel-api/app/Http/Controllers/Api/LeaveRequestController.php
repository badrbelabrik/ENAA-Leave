<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLeaveRequestRequest;
use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\ReplacementPlan;
use App\Services\LeaveCalculatorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class LeaveRequestController extends Controller
{
    public function store(
        StoreLeaveRequestRequest $request,
        LeaveCalculatorService $calculator
    ): JsonResponse {
        $user = $request->user();

        $leaveTypeId = $request->integer('leave_type_id');

        $startDate = \Carbon\Carbon::parse(
            $request->input('start_date')
        );

        $endDate = \Carbon\Carbon::parse(
            $request->input('end_date')
        );

        $durationType = \App\Enums\LeaveDurationType::from(
            $request->input('duration_type')
        );

        /*
        |--------------------------------------------------------------------------
        | Calculate working days
        |--------------------------------------------------------------------------
        */

        $totalDays = $calculator->calculate(
            $startDate,
            $endDate,
            $durationType
        );

        if ($totalDays <= 0) {
            return response()->json([
                'message' => 'The selected period contains no working days.',
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Check leave balance
        |--------------------------------------------------------------------------
        */

        $balance = LeaveBalance::where('user_id', $user->id)
            ->where('leave_type_id', $leaveTypeId)
            ->where('year', $startDate->year)
            ->first();

        if (!$balance) {
            return response()->json([
                'message' => 'No leave balance was found for this leave type.',
            ], 422);
        }

        if ($balance->remaining < $totalDays) {
            return response()->json([
                'message' => 'You do not have enough leave balance.',
                'available' => $balance->remaining,
                'requested' => $totalDays,
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Create leave request
        |--------------------------------------------------------------------------
        */

        $leaveRequest = DB::transaction(function () use (
            $request,
            $user,
            $leaveTypeId,
            $startDate,
            $endDate,
            $durationType,
            $totalDays
        ) {
            $leaveRequest = LeaveRequest::create([
                'user_id' => $user->id,
                'leave_type_id' => $leaveTypeId,
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
                'duration_type' => $durationType->value,
                'total_days' => $totalDays,
                'reason' => $request->input('reason'),
                'status' => 'pending_manager',
            ]);

            /*
            |--------------------------------------------------------------------------
            | Create replacement plan for trainers
            |--------------------------------------------------------------------------
            */

            if ($user->hasRole('trainer')) {
                $plan = $request->input('replacement_plan');

                ReplacementPlan::create([
                    'leave_request_id' => $leaveRequest->id,
                    'type' => $plan['type'],
                    'replacement_user_id' => $plan['replacement_user_id'] ?? null,
                    'catch_up_date' => $plan['catch_up_date'] ?? null,
                    'description' => $plan['description'] ?? null,
                ]);
            }

            return $leaveRequest;
        });

        return response()->json([
            'message' => 'Leave request submitted successfully.',
            'leave_request' => $leaveRequest->load([
                'leaveType',
                'replacementPlan',
            ]),
        ], 201);
    }
}
