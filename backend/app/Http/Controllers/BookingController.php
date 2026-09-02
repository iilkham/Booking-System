<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id'      => 'required|exists:users,id',
            'service_id'   => 'required|exists:services,id',
            'schedule_id'  => 'required|exists:schedules,id',
            'booking_date' => 'required|date|after_or_equal:today',
            'start_time'   => 'required|date_format:H:i',
            'notes'        => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors()
            ], 422, [], JSON_UNESCAPED_UNICODE);
        }

        $bookingDateTime = Carbon::parse($request->booking_date . ' ' . $request->start_time);
        if ($bookingDateTime->isPast()) {
            return response()->json([
                'success' => false,
                'message' => 'Нельзя забронировать время в прошлом'
            ], 400, [], JSON_UNESCAPED_UNICODE);
        }

        $schedule = Schedule::findOrFail($request->schedule_id);
        if (!$schedule->hasAvailableSlots()) {
            return response()->json([
                'success' => false,
                'message' => 'Этот временной слот уже полностью забронирован'
            ], 409, [], JSON_UNESCAPED_UNICODE);
        }

        $booking = Booking::create([
            'user_id'      => $request->user_id,
            'service_id'   => $request->service_id,
            'schedule_id'  => $request->schedule_id,
            'booking_date' => $request->booking_date,
            'start_time'   => $request->start_time,
            'status'       => 'pending',
            'notes'        => $request->notes,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Бронирование успешно создано',
            'data'    => $booking
        ], 201, [], JSON_UNESCAPED_UNICODE);
    }

    public function myBookings(Request $request)
    {
        $userId = $request->query('user_id');

        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'Не указан user_id'
            ], 400, [], JSON_UNESCAPED_UNICODE);
        }

        $bookings = Booking::with(['service', 'schedule'])
            ->where('user_id', $userId)
            ->orderBy('booking_date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $bookings
        ], 200, [], JSON_UNESCAPED_UNICODE);
    }
}