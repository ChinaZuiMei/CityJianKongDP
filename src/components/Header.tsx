import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '../utils/cn';

export const Header = ({
  connected,
  alarmCount,
  onAlarmClick,
  workshops,
  selectedWorkshop,
  onWorkshopChange,
}: {
  connected: boolean,
  alarmCount: number,
  onAlarmClick: () => void,
  workshops: string[],
  selectedWorkshop: string,
  onWorkshopChange: (workshop: string) => void,
}) => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-between items-center px-6 py-2 bg-white/75 border-b border-sky-200 text-slate-900 text-sm font-mono backdrop-blur-md z-50">
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-sky-600" />
        {time.toLocaleDateString()} {time.toLocaleTimeString()}
      </div>
      <div className="flex items-center gap-4">
        <span className={cn("flex items-center gap-1.5", connected ? "text-emerald-800" : "text-amber-700")}>
          <span className={cn("w-2 h-2 rounded-full", connected ? "bg-emerald-500 animate-pulse" : "bg-amber-500")} />
          {connected ? 'MQTT 已连接' : 'MQTT 连接中...'}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sky-800 text-xs font-bold tracking-wider">车间</span>
          <select
            value={selectedWorkshop}
            onChange={(e) => onWorkshopChange(e.target.value)}
            className="rounded-md border border-sky-300 bg-white px-3 py-1 text-xs font-bold text-slate-900 outline-none transition-colors hover:border-sky-500"
          >
            {workshops.map((workshop) => (
              <option key={workshop} value={workshop}>
                {workshop}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={onAlarmClick}
          className={cn("flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer", alarmCount > 0 ? "text-red-800" : "text-emerald-800")}
        >
          <AlertTriangle size={14} className={alarmCount > 0 ? "animate-pulse" : ""} />
          {alarmCount > 0 ? `${alarmCount} 个报警` : '系统正常'}
        </button>
      </div>
    </div>
  );
};
