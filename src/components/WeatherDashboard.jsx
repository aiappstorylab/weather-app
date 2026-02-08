import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, MapPin, Calendar } from 'lucide-react';
import { CITIES, getBaseDateTime } from '../utils/weatherUtils';
import WeatherCard from './WeatherCard';

// API Key - 실제 운영 환경에서는 .env 파일에서 관리해야 합니다.
const SERVICE_KEY = '실제_API_키_입력';

const WeatherDashboard = () => {
    const [weatherData, setWeatherData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchWeatherData = async () => {
        setLoading(true);
        setError(null);
        const { baseDate, baseTime } = getBaseDateTime();

        try {
            const promises = CITIES.map(async (city) => {
                const response = await axios.get('/api/weather/getVilageFcst', {
                    params: {
                        serviceKey: SERVICE_KEY,
                        pageNo: 1,
                        numOfRows: 1000,
                        dataType: 'JSON',
                        base_date: baseDate,
                        base_time: baseTime,
                        nx: city.nx,
                        ny: city.ny,
                    },
                });

                const items = response.data.response?.body?.items?.item;
                if (!items) throw new Error(`${city.name} 데이터를 불러올 수 없습니다.`);

                // 현재 시간과 가장 가까운 예보 데이터 필터링 (TMP, SKY, PTY, POP)
                const currentData = {
                    city: city.name,
                    temp: items.find(i => i.category === 'TMP')?.fcstValue || '-',
                    sky: items.find(i => i.category === 'SKY')?.fcstValue || '1',
                    pty: items.find(i => i.category === 'PTY')?.fcstValue || '0',
                    pop: items.find(i => i.category === 'POP')?.fcstValue || '0',
                };

                return currentData;
            });

            const results = await Promise.all(promises);
            setWeatherData(results);
            setLastUpdated(new Date());
        } catch (err) {
            console.error('Weather API Error:', err);
            setError('날씨 데이터를 불러오는 중 오류가 발생했습니다. 서비스 키를 확인해 주세요.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeatherData();
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-indigo-400 mb-2">
                            <MapPin size={18} />
                            <span className="text-sm font-semibold uppercase tracking-widest">South Korea</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            5대 도시 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">날씨 예보</span>
                        </h1>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-3">
                        <div className="flex items-center gap-2 text-white/60 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                            <Calendar size={16} />
                            <span className="text-sm">{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</span>
                        </div>
                        <button
                            onClick={fetchWeatherData}
                            disabled={loading}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                        >
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                            데이터 새로고침
                        </button>
                    </div>
                </header>

                {/* Status Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <p className="font-medium text-sm">{error}</p>
                    </div>
                )}

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {loading && weatherData.length === 0 ? (
                        Array(5).fill(0).map((_, i) => (
                            <div key={i} className="h-64 rounded-2xl bg-white/5 border border-white/5 animate-pulse" />
                        ))
                    ) : (
                        weatherData.map((data) => (
                            <WeatherCard key={data.city} data={data} />
                        ))
                    )}
                </div>

                {/* Footer info */}
                <footer className="mt-12 text-center">
                    <p className="text-white/40 text-sm">
                        기상청 단기예보 조회서비스 2.0 API를 사용합니다. {lastUpdated && `최종 업데이트: ${lastUpdated.toLocaleTimeString()}`}
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default WeatherDashboard;
