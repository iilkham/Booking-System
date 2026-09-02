<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServiceController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/services', [ServiceController::class, 'index']);

Route::get('/schedules', function (Request $request) {
    $serviceId = $request->query('service_id');
    
    $schedules = \App\Models\Schedule::where('service_id', $serviceId)
        ->where('date', '>=', now()->format('Y-m-d'))
        ->orderBy('date')
        ->orderBy('start_time')
        ->get();
    
    return response()->json([
        'success' => true,
        'data' => $schedules
    ], 200, [], JSON_UNESCAPED_UNICODE);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/bookings', function (Request $request) {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'booking_date' => 'required|date',
            'start_time' => 'required|string',
        ]);

        $booking = \App\Models\Booking::create([
            'user_id' => $request->user()->id,
            'service_id' => $request->service_id,
            'booking_date' => $request->booking_date,
            'start_time' => $request->start_time,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true, 
            'data' => $booking, 
            'message' => 'Бронирование успешно создано'
        ], 201, [], JSON_UNESCAPED_UNICODE);
    });

    Route::get('/bookings/my', function (Request $request) {
        $bookings = \App\Models\Booking::where('user_id', $request->user()->id)
            ->with(['service', 'user'])
            ->orderBy('booking_date', 'desc')
            ->get();

        return response()->json(['success' => true, 'data' => $bookings], 200, [], JSON_UNESCAPED_UNICODE);
    });

    Route::get('/admin/services', [ServiceController::class, 'index']);
    Route::post('/admin/services', [ServiceController::class, 'store']);
    Route::put('/admin/services/{id}', [ServiceController::class, 'update']);
    Route::delete('/admin/services/{id}', [ServiceController::class, 'destroy']);

    Route::get('/admin/bookings', function (Request $request) {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Доступ запрещён'], 403);
        }
        
        $bookings = \App\Models\Booking::with(['user', 'service'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json(['success' => true, 'data' => $bookings], 200, [], JSON_UNESCAPED_UNICODE);
    });

    Route::put('/admin/bookings/{id}', function (Request $request, $id) {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Доступ запрещён'], 403);
        }
        
        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled'
        ]);
        
        $booking = \App\Models\Booking::findOrFail($id);
        $booking->update(['status' => $request->status]);
        
        return response()->json(['success' => true, 'message' => 'Статус обновлён', 'data' => $booking], 200, [], JSON_UNESCAPED_UNICODE);
    });
});