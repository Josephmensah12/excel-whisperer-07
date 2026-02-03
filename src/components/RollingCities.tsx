
import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

const CITIES_IN_GHANA = [
  "Accra", "Kumasi", "Tamale", "Sekondi-Takoradi", "Cape Coast", 
  "Sunyani", "Techiman", "Koforidua", "Ho", "Wa", 
  "Bolgatanga", "Nalerigu", "Damongo", "Dambai", "Goaso",
  "Tema", "Obuasi", "Teshie", "Bawku", "Nungua", 
  "Madina", "Nsawam", "Winneba", "Agona Swedru", "Asamankese"
];

const RollingCities = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % CITIES_IN_GHANA.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-navy text-primary-foreground py-2 overflow-hidden fixed w-full top-0 z-50 border-b border-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2">
        <MapPin className="h-4 w-4 text-accent flex-shrink-0" />
        <p className="text-center text-sm font-medium">
          Delivering to{' '}
          <span className="inline-block min-w-[100px] text-accent font-bold transition-all duration-300">
            {CITIES_IN_GHANA[currentIndex]}
          </span>{' '}
          <span className="hidden sm:inline">& all regions across Ghana</span>
          <span className="sm:hidden">& all of Ghana</span>
        </p>
      </div>
    </div>
  );
};

export default RollingCities;
