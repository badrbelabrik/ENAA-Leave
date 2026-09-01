<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use App\Services\WorkflowEngineService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use InvalidArgumentException;

class LeaveApprovalController extends Controller
{
    public function approve(
        Request $request,
        LeaveRequest $leaveRequest,
        WorkflowEngineService $workflow
    ): JsonResponse {
        try {
            $leaveRequest = $workflow->approve(
                $leaveRequest,
                $request->user()
            );

            return response()->json([
                'message' => 'Leave request approved successfully.',
                'leave_request' => $leaveRequest->load([
                    'user',
                    'leaveType',
                    'replacementPlan',
                    'approvals.approver',
                ]),
            ]);
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 403);
        }
    }

    public function reject(
        Request $request,
        LeaveRequest $leaveRequest,
        WorkflowEngineService $workflow
    ): JsonResponse {
        $data = $request->validate([
            'comment' => ['nullable', 'string', 'max:2000'],
        ]);

        try {
            $leaveRequest = $workflow->reject(
                $leaveRequest,
                $request->user(),
                $data['comment'] ?? null
            );

            return response()->json([
                'message' => 'Leave request rejected successfully.',
                'leave_request' => $leaveRequest->load([
                    'user',
                    'leaveType',
                    'replacementPlan',
                    'approvals.approver',
                ]),
            ]);
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 403);
        }
    }
}
