<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LeaveApprovalController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LeaveRequestController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post(
        '/leave-requests',
        [LeaveRequestController::class, 'store']
    );

    Route::get(
        '/leave-requests',
        [LeaveRequestController::class, 'index']
    );

    Route::get(
        '/leave-requests/{leaveRequest}',
        [LeaveRequestController::class, 'show']
    );

    Route::delete(
        '/leave-requests/{leaveRequest}',
        [LeaveRequestController::class, 'destroy']
    );

    Route::post(
        '/leave-requests/{leaveRequest}/approve',
        [LeaveApprovalController::class, 'approve']
    );

    Route::post(
        '/leave-requests/{leaveRequest}/reject',
        [LeaveApprovalController::class, 'reject']
    );
});
