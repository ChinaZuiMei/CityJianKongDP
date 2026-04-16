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
    <div className="panel-frame z-50 flex items-center justify-between border-b bg-transparent px-6 py-2 text-sm font-mono text-slate-100">
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-sky-300" />
        {time.toLocaleDateString()} {time.toLocaleTimeString()}
      </div>
      <div className="flex items-center gap-4">
        <span className={cn("flex items-center gap-1.5", connected ? "text-emerald-300" : "text-amber-300")}>
          <span className={cn("w-2 h-2 rounded-full", connected ? "bg-emerald-500 animate-pulse" : "bg-amber-500")} />
          {connected ? 'MQTT 已连接' : 'MQTT 连接中...'}
        </span>
        <div className="flex items-center gap-2">
          <span className="panel-title-glow text-xs font-bold tracking-wider">车间</span>
          <select
            value={selectedWorkshop}
            onChange={(e) => onWorkshopChange(e.target.value)}
            className="panel-frame data-glow rounded-md border bg-transparent px-3 py-1 text-xs font-bold outline-none transition-colors hover:border-sky-300/50"
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
          className={cn("flex cursor-pointer items-center gap-1.5 transition-opacity hover:opacity-80", alarmCount > 0 ? "text-red-300" : "text-emerald-300")}
        >
          <AlertTriangle size={14} className={alarmCount > 0 ? "animate-pulse" : ""} />
          {alarmCount > 0 ? `${alarmCount} 个报警` : '系统正常'}
        </button>
      </div>
    </div>
  );
};
