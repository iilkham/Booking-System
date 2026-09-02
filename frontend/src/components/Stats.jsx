import { Briefcase, CalendarCheck, Users } from 'lucide-react';

function Stats({ servicesCount, bookingsCount }) {
  const stats = [
    { icon: Briefcase, label: 'Доступных услуг', value: servicesCount, color: 'bg-blue-500' },
    { icon: CalendarCheck, label: 'Ваших бронирований', value: bookingsCount, color: 'bg-green-500' },
    { icon: Users, label: 'Довольных клиентов', value: '150+', color: 'bg-purple-500' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className={`${stat.color} p-3 rounded-xl shadow-sm`}>
            <stat.icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Stats;