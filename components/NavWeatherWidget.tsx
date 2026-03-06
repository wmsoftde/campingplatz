'use client';

import { useState, useEffect } from 'react';

interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
}

const weatherIcons: Record<string, string> = {
  'clear': '☀️',
  'clouds': '☁️',
  'rain': '🌧️',
  'drizzle': '🌦️',
  'thunderstorm': '⛈️',
  'snow': '🌨️',
  'mist': '🌫️',
  'fog': '🌫️',
};

export default function NavWeatherWidget({ locale }: { locale: string }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=50.8333&longitude=7.2167&current_weather=true&timezone=Europe/Berlin'
        );
        
        if (!response.ok) throw new Error('Weather fetch failed');
        
        const data = await response.json();
        const current = data.current_weather;
        
        const code = current.weathercode;
        let condition = 'clear';
        
        if (code >= 0 && code <= 3) condition = 'clear';
        else if (code >= 45 && code <= 48) condition = 'fog';
        else if (code >= 51 && code <= 67) condition = 'drizzle';
        else if (code >= 71 && code <= 77) condition = 'snow';
        else if (code >= 80 && code <= 82) condition = 'rain';
        else if (code >= 95 && code <= 99) condition = 'thunderstorm';
        else condition = 'clouds';
        
        setWeather({
          temp: Math.round(current.temperature),
          condition,
          icon: weatherIcons[condition] || '🌡️',
        });
      } catch (error) {
        setWeather({
          temp: 18,
          condition: 'clear',
          icon: '☀️',
        });
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [locale]);

  if (!weather) {
    return (
      <div className="flex items-center gap-1 text-gray-600 text-sm">
        <span className="animate-spin">🌡️</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-gray-700 text-sm">
      <span className="text-lg">{weather.icon}</span>
      <span className="font-semibold">{weather.temp}°C</span>
      <span className="text-xs text-gray-500 ml-1">Lohmar</span>
    </div>
  );
}
