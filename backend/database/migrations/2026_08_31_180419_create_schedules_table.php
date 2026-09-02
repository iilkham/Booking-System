<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained()->onDelete('cascade'); // Связь с услугой
            $table->date('date'); // Дата
            $table->time('start_time'); // Время начала
            $table->time('end_time'); // Время конца
            $table->integer('max_bookings')->default(1); // Макс. количество мест на этот слот
            $table->timestamps();
            
            // Индекс для быстрого поиска свободных слотов
            $table->index(['service_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};