<?php

namespace Tests\Unit;

use App\Enums\LeaveDurationType;
use App\Models\Holiday;
use App\Services\LeaveCalculatorService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeaveCalculatorServiceTest extends TestCase
{
    use RefreshDatabase;

    private LeaveCalculatorService $calculator;

    protected function setUp(): void
    {
        parent::setUp();

        $this->calculator = app(LeaveCalculatorService::class);
    }

    public function test_it_calculates_working_days(): void
    {
        $result = $this->calculator->calculate(
            Carbon::parse('2026-09-07'),
            Carbon::parse('2026-09-11'),
            LeaveDurationType::FULL_DAY
        );

        $this->assertEquals(5, $result);
    }

    public function test_it_excludes_weekends(): void
    {
        $result = $this->calculator->calculate(
            Carbon::parse('2026-09-04'),
            Carbon::parse('2026-09-07'),
            LeaveDurationType::FULL_DAY
        );

        $this->assertEquals(2, $result);
    }

    public function test_it_excludes_holidays(): void
    {
        Holiday::create([
            'name' => 'Test Holiday',
            'date' => '2026-09-09',
        ]);

        $result = $this->calculator->calculate(
            Carbon::parse('2026-09-07'),
            Carbon::parse('2026-09-11'),
            LeaveDurationType::FULL_DAY
        );

        $this->assertEquals(4, $result);
    }

    public function test_it_calculates_half_day(): void
    {
        $result = $this->calculator->calculate(
            Carbon::parse('2026-09-07'),
            Carbon::parse('2026-09-07'),
            LeaveDurationType::HALF_DAY_MORNING
        );

        $this->assertEquals(0.5, $result);
    }

    public function test_it_calculates_afternoon_half_day(): void
    {
        $result = $this->calculator->calculate(
            Carbon::parse('2026-09-07'),
            Carbon::parse('2026-09-07'),
            LeaveDurationType::HALF_DAY_AFTERNOON
        );

        $this->assertEquals(0.5, $result);
    }
}
