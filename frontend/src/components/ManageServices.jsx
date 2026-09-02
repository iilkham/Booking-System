import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import ManageServices from './components/ManageServices';

function ManageServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration_minutes: ''
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/admin/services');
      if (response.data.success) {
        setServices(response.data.data);
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await axios.put(`http://127.0.0.1:8000/api/admin/services/${editingService.id}`, formData);
        toast.success('Услуга обновлена');
      } else {
        await axios.post('http://127.0.0.1:8000/api/admin/services', formData);
        toast.success('Услуга создана');
      }
      setShowForm(false);
      setEditingService(null);
      setFormData({ name: '', description: '', price: '', duration_minutes: '' });
      loadServices();
    } catch (error) {
      toast.error('Ошибка при сохранении');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration_minutes: service.duration_minutes
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить эту услугу?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/admin/services/${id}`);
        toast.success('Услуга удалена');
        loadServices();
      } catch (error) {
        toast.error('Ошибка при удалении');
      }
    }
  };

  if (loading) return <div className="text-center py-10">Загрузка...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🛠 Управление услугами</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingService(null);
            setFormData({ name: '', description: '', price: '', duration_minutes: '' });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Добавить услугу
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingService ? 'Редактировать услугу' : 'Новая услуга'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Цена (сум)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Длительность (мин)</label>
                  <input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({...formData, duration_minutes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                {editingService ? 'Сохранить' : 'Создать'}
              </button>
            </form>
          </div>
        </div>
      )}

      {services.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Нет услуг</p>
      ) : (
        <div className="space-y-3">
          {services.map(service => (
            <div key={service.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <div className="flex-grow">
                <h3 className="font-bold text-gray-800">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="text-blue-600 font-semibold">{Number(service.price).toLocaleString('ru-RU')} сум</span>
                  <span className="text-gray-500">⏱ {service.duration_minutes} мин</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageServices;