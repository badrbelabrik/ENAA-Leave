<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReplacementPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'leave_request_id',
        'replacement_user_id',
        'type',
        'catch_up_date',
        'description',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'catch_up_date' => 'date',
        ];
    }

    public function leaveRequest(): BelongsTo
    {
        return $this->belongsTo(LeaveRequest::class);
    }

    public function replacementUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'replacement_user_id');
    }
}
