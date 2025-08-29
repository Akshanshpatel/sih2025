


"use client";
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default icon issue in Next.js
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Weather API configuration
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "8ed415630504dcebe83d207b0422869b";
const CACHE_MINUTES = 30;
const RED_RAIN = 20;
const RED_PRESSURE = 1000;

// Indian capitals data
const capitals = [
  { state: "Andhra Pradesh", name: "Amaravati", lat: 16.5730, lon: 80.3580 },
  { state: "Arunachal Pradesh", name: "Itanagar", lat: 27.0844, lon: 93.6053 },
  { state: "Assam", name: "Dispur", lat: 26.1408, lon: 91.7900 },
  { state: "Bihar", name: "Patna", lat: 25.5941, lon: 85.1376 },
  { state: "Chhattisgarh", name: "Raipur", lat: 21.2514, lon: 81.6296 },
  { state: "Goa", name: "Panaji", lat: 15.4909, lon: 73.8278 },
  { state: "Gujarat", name: "Gandhinagar", lat: 23.2156, lon: 72.6369 },
  { state: "Haryana", name: "Chandigarh", lat: 30.7333, lon: 76.7794 },
  { state: "Himachal Pradesh", name: "Shimla", lat: 31.1048, lon: 77.1734 },
  { state: "Jharkhand", name: "Ranchi", lat: 23.3441, lon: 85.3096 },
  { state: "Karnataka", name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
  { state: "Kerala", name: "Thiruvananthapuram", lat: 8.5241, lon: 76.9366 },
  { state: "Madhya Pradesh", name: "Bhopal", lat: 23.2599, lon: 77.4126 },
  { state: "Maharashtra", name: "Mumbai", lat: 19.0760, lon: 72.8777 },
  { state: "Manipur", name: "Imphal", lat: 24.8170, lon: 93.9368 },
  { state: "Meghalaya", name: "Shillong", lat: 25.5788, lon: 91.8933 },
  { state: "Mizoram", name: "Aizawl", lat: 23.7271, lon: 92.7176 },
  { state: "Nagaland", name: "Kohima", lat: 25.6751, lon: 94.1086 },
  { state: "Odisha", name: "Bhubaneswar", lat: 20.2961, lon: 85.8245 },
  { state: "Punjab", name: "Chandigarh", lat: 30.7333, lon: 76.7794 },
  { state: "Rajasthan", name: "Jaipur", lat: 26.9124, lon: 75.7873 },
  { state: "Sikkim", name: "Gangtok", lat: 27.3389, lon: 88.6065 },
  { state: "Tamil Nadu", name: "Chennai", lat: 13.0827, lon: 80.2707 },
  { state: "Telangana", name: "Hyderabad", lat: 17.3850, lon: 78.4867 },
  { state: "Tripura", name: "Agartala", lat: 23.8315, lon: 91.2868 },
  { state: "Uttar Pradesh", name: "Lucknow", lat: 26.8467, lon: 80.9462 },
  { state: "Uttarakhand", name: "Dehradun", lat: 30.3165, lon: 78.0322 },
  { state: "West Bengal", name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { state: "Andaman & Nicobar Islands", name: "Port Blair", lat: 11.6234, lon: 92.7265 },
  { state: "Chandigarh (UT)", name: "Chandigarh", lat: 30.7333, lon: 76.7794 },
  { state: "Dadra & Nagar Haveli and Daman & Diu", name: "Daman", lat: 20.3974, lon: 72.8328 },
  { state: "Delhi (NCT)", name: "New Delhi", lat: 28.6139, lon: 77.2090 },
  { state: "Jammu & Kashmir (UT) — Summer", name: "Srinagar", lat: 34.0837, lon: 74.7973 },
  { state: "Jammu & Kashmir (UT) — Winter", name: "Jammu", lat: 32.7266, lon: 74.8570 },
  { state: "Ladakh (UT)", name: "Leh", lat: 34.1526, lon: 77.5770 },
  { state: "Lakshadweep (UT)", name: "Kavaratti", lat: 10.5667, lon: 72.6369 },
  { state: "Puducherry (UT)", name: "Puducherry", lat: 11.9416, lon: 79.8083 },
];

interface WeatherData {
  temp: number | null;
  pressure: number | null;
  humidity: number | null;
  condition: string;
  rain1h: number;
}

interface CityWeather {
  city: typeof capitals[0];
  weather: WeatherData | null;
  isRed: boolean;
}

export default function WeatherMap() {
  const [cityWeathers, setCityWeathers] = useState<CityWeather[]>([]);
  const [status, setStatus] = useState('idle');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cache helpers
  const cacheKey = (lat: number, lon: number) => `wx:${lat.toFixed(4)},${lon.toFixed(4)}`;
  const isFresh = (ts: number) => (Date.now() - ts) < (CACHE_MINUTES * 60 * 1000);

  const readCache = (lat: number, lon: number) => {
    const key = cacheKey(lat, lon);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      const obj = JSON.parse(raw);
      return isFresh(obj.time) ? obj.data : null;
    } catch {
      return null;
    }
  };

  const writeCache = (lat: number, lon: number, data: any) => {
    const key = cacheKey(lat, lon);
    const obj = { time: Date.now(), data };
    localStorage.setItem(key, JSON.stringify(obj));
  };

  const fetchWeather = async (lat: number, lon: number, force = false) => {
    if (!force) {
      const cached = readCache(lat, lon);
      if (cached) return cached;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    writeCache(lat, lon, data);
    return data;
  };

  const renderWeather = async (force = false) => {
    setIsLoading(true);
    setStatus('loading…');

    const weathers: CityWeather[] = [];

    for (const city of capitals) {
      try {
        if (force) {
          localStorage.removeItem(cacheKey(city.lat, city.lon));
        }
        
        const data = await fetchWeather(city.lat, city.lon, force);
        
        const temp = data?.main?.temp ?? null;
        const pressure = data?.main?.pressure ?? null;
        const humidity = data?.main?.humidity ?? null;
        const condition = data?.weather?.[0]?.description ?? 'N/A';
        const rain1h = (data?.rain && (data.rain['1h'] ?? data.rain['3h'] ?? 0)) || 0;

        const isRed = (rain1h > RED_RAIN) || (pressure !== null && pressure < RED_PRESSURE);

        weathers.push({
          city,
          weather: { temp, pressure, humidity, condition, rain1h },
          isRed
        });
      } catch (err) {
        console.warn('Weather fetch failed for', city.name, err);
        weathers.push({
          city,
          weather: null,
          isRed: false
        });
      }
    }

    setCityWeathers(weathers);
    setLastUpdated(new Date());
    setStatus('ready');
    setIsLoading(false);
  };

  useEffect(() => {
    renderWeather(false);
  }, []);

  const handleRefresh = () => {
    renderWeather(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">🇮🇳 India Weather Map</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Status: {status}</span>
          {lastUpdated && (
            <span>Last updated: {lastUpdated.toLocaleString()}</span>
          )}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Loading...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="h-64 sm:h-80 md:h-96 lg:h-[500px] w-full">
          <MapContainer
            center={[22.9734, 78.6569]}
            zoom={5}
            className="h-full w-full"
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={10}
              attribution='© OpenStreetMap contributors'
            />
            
            {cityWeathers.map((cityWeather, index) => {
              if (!cityWeather.weather) return null;
              
              return (
                <CircleMarker
                  key={`${cityWeather.city.name}-${index}`}
                  center={[cityWeather.city.lat, cityWeather.city.lon]}
                  radius={6}
                  pathOptions={{
                    color: cityWeather.isRed ? '#d62828' : '#2e6cff',
                    fillColor: cityWeather.isRed ? '#d62828' : '#2e6cff',
                    fillOpacity: 0.85,
                    weight: 1
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <div className="font-semibold">{cityWeather.city.name}</div>
                      <div className="text-gray-600 italic">{cityWeather.city.state}</div>
                      <div className="mt-2 space-y-1">
                        <div>🌡 Temp: {cityWeather.weather.temp !== null ? `${cityWeather.weather.temp.toFixed(1)}°C` : '—'}</div>
                        <div>💧 Humidity: {cityWeather.weather.humidity ?? '—'}%</div>
                        <div>📉 Pressure: {cityWeather.weather.pressure ?? '—'} hPa</div>
                        <div>🌦 Condition: {cityWeather.weather.condition}</div>
                        <div>☔ Rain (1h): {cityWeather.weather.rain1h} mm</div>
                        {cityWeather.isRed && (
                          <div className="mt-2">
                            <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                              🚨 RED ZONE
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        <div className="absolute bottom-4 right-4 bg-black/60 text-white p-3 rounded-xl backdrop-blur-sm">
          <div className="text-sm">
            <div><strong>Heatmap:</strong> Rainfall intensity (mm/h)</div>
            <div className="mt-1">
              <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                RED ZONE
              </span>
              <span className="ml-2">→ Rain &gt; 20 mm/h or Pressure &lt; 1000 hPa</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
