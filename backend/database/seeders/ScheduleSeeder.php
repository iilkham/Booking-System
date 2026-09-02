<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Schedule;
use Carbon\Carbon;

class ScheduleSeeder extends Seeder
{
    public function run(): void
    {
        // Получаем все активные услуги
        $services = \App\Models\Service::where('is_active', true)->get();
        
        // Создаем расписание на следующие 5 дней
        for ($i = 1; $i <= 5; $i++) {
            $date = Carbon::now()->addDays($i)->format('Y-m-d');
            
            foreach ($services as $service) {
                // Для каждой услуги создаем слоты с 09:00 до 17:00 с шагом в 1 час
                $startHour = 9;
                $endHour = 17;
                
                for ($hour = $startHour; $hour < $endHour; $hour++) {
                    $startTime = sprintf('%02d:00:00', $hour);
                    $endTime = sprintf('%02d:00:00', $hour + 1);
                    
                    Schedule::create([
                        'service_id' => $service->id,
                        'date' => $date,
                        'start_time' => $startTime,
                        'end_time' => $endTime,
                        'max_bookings' => 1,
                    ]);
                }
            }
        }
    }
}