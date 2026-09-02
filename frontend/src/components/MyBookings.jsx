import { useState, useEffect } from 'react';
import axios from 'axios';

function MyBookings({ userId }) { 
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadBookings();
    }
  }, [userId]);

  const loadBookings = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/bookings/my?user_id=2');
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error('Ошибка загрузки бронирований:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'confirmed') return 'bg-green-100 text-green-700';
    if (status === 'cancelled') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const getStatusText = (status) => {
    if (status === 'confirmed') return 'Подтверждено';
    if (status === 'cancelled') return 'Отменено';
    return 'Ожидает';
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Загрузка...</div>;
  }

  if (bookings.length === 0) {
    return <div className="text-center py-10 text-gray-600">У вас пока нет бронирований</div>;
  }

  return (
    <div className="space-y-4">
      {bookings.map(booking => (
        <div key={booking.id} className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{booking.service?.name}</h3>
            <p className="text-gray-600 text-sm">
              {new Date(booking.booking_date).toLocaleDateString('ru-RU')} в {booking.start_time}
            </p>
            {booking.notes && <p className="text-gray-500 text-xs mt-1">💬 {booking.notes}</p>}
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
              {getStatusText(booking.status)}
            </span>
            <p className="text-blue-600 font-bold mt-2">
              {Number(booking.service?.price).toLocaleString('ru-RU')} сум
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyBookings;