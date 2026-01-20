
import React, { useEffect, useState } from 'react';

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
    <div className="bg-blue-800 text-white py-1.5 overflow-hidden fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <p className="text-center text-sm md:text-base font-medium">
          We ship to{' '}
          <span className="inline-block min-w-[80px] text-yellow-300 font-bold">
            {CITIES_IN_GHANA[currentIndex]}
          </span>{' '}
          and all other cities in Ghana
        </p>
      </div>
    </div>
  );
};

export default RollingCities;
