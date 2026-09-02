import { Calendar, Clock, Star } from 'lucide-react';

function Hero() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 mb-8 text-white relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24 blur-2xl"></div>
      
      <div className="relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Система бронирования услуг
        </h1>
        <p className="text-blue-100 text-lg mb-8 max-w-2xl">
          Забронируйте удобное время для консультации с нашими специалистами. 
          Быстро, просто и без лишних звонков.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <Calendar className="w-5 h-5" />
            <span>Гибкий выбор даты</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <Clock className="w-5 h-5" />
            <span>Удобное время</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <Star className="w-5 h-5" />
            <span>Опытные специалисты</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;