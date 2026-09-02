<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'date',
        'start_time',
        'end_time',
        'max_bookings',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function hasAvailableSlots()
    {
        return $this->bookings()->where('status', '!=', 'cancelled')->count() < $this->max_bookings;
    }
}