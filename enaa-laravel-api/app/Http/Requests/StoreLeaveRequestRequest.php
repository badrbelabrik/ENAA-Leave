<?php

namespace App\Http\Requests;

use App\Enums\LeaveDurationType;
use App\Models\LeaveType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLeaveRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'leave_type_id' => [
                'required',
                'integer',
                'exists:leave_types,id',
            ],

            'start_date' => [
                'required',
                'date',
            ],

            'end_date' => [
                'required',
                'date',
                'after_or_equal:start_date',
            ],

            'duration_type' => [
                'required',
                Rule::enum(LeaveDurationType::class),
            ],

            'reason' => [
                'nullable',
                'string',
                'max:2000',
            ],

            'attachment' => [
                'nullable',
                'file',
                'mimes:pdf,jpg,jpeg,png',
                'max:5120',
            ],

            'replacement_plan' => [
                'nullable',
                'array',
            ],

            'replacement_plan.type' => [
                'required_with:replacement_plan',
                'in:replacement,catch_up',
            ],

            'replacement_plan.replacement_user_id' => [
                'nullable',
                'integer',
                'exists:users,id',
            ],

            'replacement_plan.catch_up_date' => [
                'nullable',
                'date',
                'after_or_equal:end_date',
            ],

            'replacement_plan.description' => [
                'nullable',
                'string',
                'max:2000',
            ],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $user = $this->user();

            if (!$user) {
                return;
            }

            /*
            |--------------------------------------------------------------------------
            | Trainer continuity requirement
            |--------------------------------------------------------------------------
            */

            if ($user->hasRole('trainer')) {
                if (!$this->filled('replacement_plan')) {
                    $validator->errors()->add(
                        'replacement_plan',
                        'A replacement plan is required for trainers.'
                    );

                    return;
                }

                $type = $this->input('replacement_plan.type');

                if ($type === 'replacement') {
                    $replacementUserId = $this->input(
                        'replacement_plan.replacement_user_id'
                    );

                    if (!$replacementUserId) {
                        $validator->errors()->add(
                            'replacement_plan.replacement_user_id',
                            'A replacement trainer must be selected.'
                        );
                    }

                    if (
                        $replacementUserId &&
                        (int) $replacementUserId === (int) $user->id
                    ) {
                        $validator->errors()->add(
                            'replacement_plan.replacement_user_id',
                            'You cannot select yourself as a replacement.'
                        );
                    }
                }

                if ($type === 'catch_up') {
                    if (!$this->filled('replacement_plan.catch_up_date')) {
                        $validator->errors()->add(
                            'replacement_plan.catch_up_date',
                            'A catch-up date is required.'
                        );
                    }
                }
            }
        });
    }
}
