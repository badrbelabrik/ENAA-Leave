<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('replacement_plans', function (Blueprint $table) {
            $table->id();

            $table->foreignId('leave_request_id')
                ->unique()
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('replacement_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('type');

            $table->date('catch_up_date')->nullable();

            $table->text('description')->nullable();

            $table->string('status')->default('pending');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('replacement_plans');
    }
};
