import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from "./AuthContext";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Hero from './components/Hero';
import Stats from './components/Stats';
import BookingForm from './components/BookingForm';
import MyBookings from './components/MyBookings';
import Login from './components/Login';
import Register from './components/Register';
import { LogOut, User, Crown } from 'lucide-react';
import api from './api';

function AppContent() {
  const { user, logout, loading } = useAuth();
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [view, setView] = useState('services');
  const [bookingsCount, setBookingsCount] = useState(0);

  useEffect(() => {
    if (user) {
      api.get('/api/services')
        .then(response => {
          if (response.data.success) setServices(response.data.data);
        })
        .catch(err => console.error(err));

      api.get('/api/bookings/my', { params: { user_id: user.id } })
        .then(response => {
          if (response.data.success) setBookingsCount(response.data.data.length);
        })
        .catch(err => console.error(err));
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-xl text-gray-500 animate-pulse">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user?.role?.toLowerCase() === 'admin';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      
      <div className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto p-4 max-w-6xl flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Booking System</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <User className="w-5 h-5" />
              <span className="font-medium">{user.name}</span>
              {isAdmin && (
                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                  <Crown className="w-3 h-3" /> АДМИН
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-8 max-w-6xl">
        <Hero />
        <Stats servicesCount={services.length} bookingsCount={bookingsCount} />

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {view === 'services' ? 'Наши услуги' : view === 'admin' ? 'Админ-панель' : 'Мои бронирования'}
          </h2>
          
          <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
            <button 
              onClick={() => setView('services')}
              className={`px-5 py-2 rounded-lg transition-all font-medium ${view === 'services' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Услуги
            </button>
            <button 
              onClick={() => setView('bookings')}
              className={`px-5 py-2 rounded-lg transition-all font-medium ${view === 'bookings' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Мои бронирования
            </button>
            
            {isAdmin && (
              <button 
                onClick={() => setView('admin')}
                className={`px-5 py-2 rounded-lg transition-all font-medium flex items-center gap-2 ${view === 'admin' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-600 hover:bg-purple-50'}`}
              >
                <Crown className="w-4 h-4" />
                Админ-панель
              </button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'services' ? (
            <motion.div key="services" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <motion.div key={service.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ y: -5 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-shadow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-6 flex-grow">{service.description}</p>
                  <div className="flex justify-between items-center border-t border-gray-100 pt-4 mb-4">
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">⏱ {service.duration_minutes} мин</span>
                    <span className="text-lg font-bold text-blue-600">{Number(service.price).toLocaleString('ru-RU')} сум</span>
                  </div>
                  <button onClick={() => setSelectedService(service)} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-200 transition-all">
                    Забронировать
                  </button>
                </motion.div>
              ))}
            </motion.div>
          ) : view === 'admin' && isAdmin ? (
            <motion.div key="admin" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <AdminDashboard />
            </motion.div>
          ) : (
            <motion.div key="bookings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <MyBookings userId={user.id} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedService && (
            <BookingForm service={selectedService} userId={user.id} onClose={() => { setSelectedService(null); setView('bookings'); }} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllBookings();
  }, []);

  const loadAllBookings = async () => {
    try {
      const response = await api.get('/api/admin/bookings');
      if (response.data.success) setBookings(response.data.data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, newStatus) => {
    try {
      await api.put(`/api/admin/bookings/${bookingId}`, { status: newStatus });
      loadAllBookings();
    } catch (error) {
      console.error('Ошибка обновления:', error);
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Загрузка данных...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Crown className="w-6 h-6 text-purple-600" /> Управление всеми бронированиями
      </h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Пока нет ни одного бронирования</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Клиент</th>
                <th className="px-4 py-3">Услуга</th>
                <th className="px-4 py-3">Дата и время</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3 rounded-r-lg text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-800">{booking.user?.name}</div>
                    <div className="text-sm text-gray-500">{booking.user?.email}</div>
                  </td>
                  <td className="px-4 py-4 text-gray-700">{booking.service?.name}</td>
                  <td className="px-4 py-4 text-gray-700">
                    {new Date(booking.booking_date).toLocaleDateString('ru-RU')}<br/>
                    <span className="text-sm text-gray-500">{booking.start_time}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-200' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                      'bg-yellow-100 text-yellow-700 border-yellow-200'
                    }`}>
                      {booking.status === 'confirmed' ? '✅ Подтверждено' : booking.status === 'cancelled' ? '❌ Отменено' : ' Ожидает'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    {booking.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => updateStatus(booking.id, 'confirmed')} className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-600 transition-colors">Подтвердить</button>
                        <button onClick={() => updateStatus(booking.id, 'cancelled')} className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-600 transition-colors">Отменить</button>
                      </div>
                    )}
                    {booking.status !== 'pending' && <span className="text-gray-400 text-sm">Нет действий</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;