'use client';

import { useState, useEffect } from 'react';

interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
  description: string;
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

export default function WeatherWidget({ locale }: { locale: string }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Using Open-Meteo API (free, no API key needed)
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=50.8333&longitude=7.2167&current_weather=true&daily=weathercode&timezone=Europe/Berlin'
        );
        
        if (!response.ok) throw new Error('Weather fetch failed');
        
        const data = await response.json();
        const current = data.current_weather;
        
        // Map WMO weather codes to conditions
        const code = current.weathercode;
        let condition = 'clear';
        let description = locale === 'de' ? 'Klar' : 'Clear';
        
        if (code >= 0 && code <= 3) {
          condition = 'clear';
          description = locale === 'de' ? 'Klar' : 'Clear';
        } else if (code >= 45 && code <= 48) {
          condition = 'fog';
          description = locale === 'de' ? 'Nebel' : 'Fog';
        } else if (code >= 51 && code <= 67) {
          condition = 'drizzle';
          description = locale === 'de' ? 'Nieselregen' : 'Drizzle';
        } else if (code >= 71 && code <= 77) {
          condition = 'snow';
          description = locale === 'de' ? 'Schnee' : 'Snow';
        } else if (code >= 80 && code <= 82) {
          condition = 'rain';
          description = locale === 'de' ? 'Regen' : 'Rain';
        } else if (code >= 95 && code <= 99) {
          condition = 'thunderstorm';
          description = locale === 'de' ? 'Gewitter' : 'Thunderstorm';
        } else {
          condition = 'clouds';
          description = locale === 'de' ? 'Bewölkt' : 'Cloudy';
        }
        
        setWeather({
          temp: Math.round(current.temperature),
          condition,
          icon: weatherIcons[condition] || '🌡️',
          description,
        });
      } catch (error) {
        console.error('Weather fetch error:', error);
        // Fallback data
        setWeather({
          temp: 18,
          condition: 'clear',
          icon: '☀️',
          description: locale === 'de' ? 'Klar' : 'Clear',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Update every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [locale]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
        <div className="animate-spin text-lg">🌡️</div>
        <span className="text-white text-sm font-medium">
          {locale === 'de' ? 'Laden...' : 'Loading...'}
        </span>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-5 py-3 border border-white/30">
      <div className="text-3xl animate-pulse">
        {weather.icon}
      </div>
      <div className="flex flex-col">
        <span className="text-white text-2xl font-bold leading-none">
          {weather.temp}°C
        </span>
        <span className="text-white/80 text-xs">
          {weather.description}
        </span>
        <span className="text-white/60 text-[10px]">
          Lohmar
        </span>
      </div>
    </div>
  );
}
