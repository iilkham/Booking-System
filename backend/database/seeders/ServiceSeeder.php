<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'name' => 'Консультация',
                'description' => 'Первичная консультация специалиста (30 минут)',
                'duration_minutes' => 30,
                'price' => 50000,
                'is_active' => true,
            ],
            [
                'name' => 'Детальный анализ',
                'description' => 'Полный анализ и рекомендации (1 час)',
                'duration_minutes' => 60,
                'price' => 150000,
                'is_active' => true,
            ],
            [
                'name' => 'Повторная встреча',
                'description' => 'Обсуждение результатов (45 минут)',
                'duration_minutes' => 45,
                'price' => 80000,
                'is_active' => true,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}