import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion'; // <-- ДОБАВЬ ЭТУ СТРОКУ!
import { X, Calendar, Clock, MessageSquare } from 'lucide-react';

function BookingForm({ service, userId, onClose }) {
  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (service) loadSchedules();
  }, [service]);

  const loadSchedules = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/schedules?service_id=${service.id}`);
      if (response.data.success) setSchedules(response.data.data);
    } catch (error) {
      console.error('Ошибка загрузки расписания:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const selectedSchedule = schedules.find(s => s.id === selectedTime);
    const startTimeFormatted = selectedSchedule?.start_time ? selectedSchedule.start_time.substring(0, 5) : '';
    const bookingDateFormatted = selectedDate.includes('T') ? selectedDate.split('T')[0] : selectedDate;

    const bookingData = {
      user_id: userId,
      service_id: service.id,
      schedule_id: selectedTime,
      booking_date: bookingDateFormatted,
      start_time: startTimeFormatted,
      notes: notes,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/bookings', bookingData);
      if (response.data.success) {
        toast.success('🎉 Бронирование успешно создано!');
        setTimeout(onClose, 1500);
      }
    } catch (error) {
      let errorMessage = 'Произошла ошибка при бронировании';
      if (error.response?.status === 422) {
        errorMessage = Object.values(error.response.data.errors).flat().join('\n');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const availableDates = [...new Set(schedules.map(s => s.date))];
  const availableTimes = schedules.filter(s => s.date === selectedDate);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Бронирование: <span className="text-blue-600">{service?.name}</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium text-sm">
              <Calendar className="w-4 h-4 text-blue-500" /> Выберите дату
            </label>
            <select 
              value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(''); }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              required
            >
              <option value="">-- Выберите дату --</option>
              {availableDates.map(date => (
                <option key={date} value={date}>{new Date(date).toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium text-sm">
              <Clock className="w-4 h-4 text-blue-500" /> Выберите время
            </label>
            <select 
              value={selectedTime}
              onChange={(e) => setSelectedTime(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 disabled:opacity-50"
              disabled={!selectedDate}
              required
            >
              <option value="">-- Выберите время --</option>
              {availableTimes.map(schedule => (
                <option key={schedule.id} value={schedule.id}>{schedule.start_time.substring(0, 5)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium text-sm">
              <MessageSquare className="w-4 h-4 text-blue-500" /> Комментарий
            </label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
              rows="3"
              placeholder="Ваши пожелания..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">
              Отмена
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-200 transition-all disabled:opacity-50">
              {loading ? 'Обработка...' : 'Подтвердить'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default BookingForm;