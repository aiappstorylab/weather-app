import React from 'react';
import * as LucideIcons from 'lucide-react';
import { getWeatherStatus } from '../utils/weatherUtils';

const WeatherCard = ({ data }) => {
    const { city, temp, sky, pty, pop } = data;
    const status = getWeatherStatus(sky, pty);
    const IconComponent = LucideIcons[status.icon] || LucideIcons.HelpCircle;

    return (
        <div className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105 group bg-gradient-to-br ${status.color} border border-white/20 backdrop-blur-md shadow-xl`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">{city}</h3>
                    <p className="text-sm text-white/70">{status.text}</p>
                </div>
                <div className="p-2 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
                    <IconComponent size={32} className="text-white" strokeWidth={1.5} />
                </div>
            </div>

            <div className="flex items-end gap-1 mb-6">
                <span className="text-5xl font-bold text-white tracking-tighter">{temp}</span>
                <span className="text-2xl font-medium text-white/80 pb-1">°C</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="flex flex-col">
                    <span className="text-xs text-white/60 uppercase tracking-wider mb-1">강수확률</span>
                    <div className="flex items-center gap-1">
                        <LucideIcons.Umbrella size={14} className="text-white/60" />
                        <span className="text-sm font-semibold text-white">{pop}%</span>
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-white/60 uppercase tracking-wider mb-1">상태</span>
                    <span className="text-sm font-semibold text-white">{status.text}</span>
                </div>
            </div>

            {/* Decorative background circle */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
        </div>
    );
};

export default WeatherCard;
