import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../utils/cn';
import { hasAlarm, getAlarmNames } from '../utils/alarmUtils';
import { ScadaData, AlarmData } from '../types';
import { Tank } from './SharedComponents';

export const TankAreaScreen = ({ data, alarmData }: { data: ScadaData, alarmData: AlarmData }) => (
  <div className="flex h-full w-full flex-col gap-2 px-4 py-3">
    <div className="flex justify-center gap-10 items-end">
      {[
        { id: 'hcl_tank1', label: '1# 盐酸罐', level: data.hcl_tank1_level, max: 3.6 },
        { id: 'hcl_tank2', label: '2# 盐酸罐', level: data.hcl_tank2_level, max: 3.6 },
        { id: 'hcl_tank3', label: '3# 盐酸罐', level: data.hcl_tank3_level, max: 3.6 },
        { id: 'h2so4_tank1', label: '1# 硫酸罐', level: data.h2so4_tank1_level, max: 6.2 }
      ].map(tank => {
        const alarmNames = getAlarmNames(tank.id, alarmData);
        const outsideAlarms = alarmNames.slice(0, 1);
        const insideAlarms = alarmNames.slice(1);
        return (
          <div key={tank.id} className="relative flex flex-col items-center gap-2 min-w-[130px]">
            {outsideAlarms.length > 0 && (
              <div className="flex w-[140px] flex-col items-center justify-end gap-1 min-h-[56px]">
                {outsideAlarms.map((name, idx) => (
                  <div key={idx} className="w-full rounded border border-red-500 bg-transparent px-3 py-1 text-center text-sm font-bold text-red-100 animate-pulse">
                    {name}
                  </div>
                ))}
              </div>
            )}
            {insideAlarms.length > 0 && (
              <div className="pointer-events-none absolute left-1/2 top-24 z-20 flex w-[150px] -translate-x-1/2 flex-col items-center gap-1">
                {insideAlarms.map((name, idx) => (
                  <div key={idx} className="w-full rounded border border-red-500 bg-transparent px-3 py-1 text-center text-sm font-bold text-red-100 animate-pulse">
                    {name}
                  </div>
                ))}
              </div>
            )}
            <Tank 
              label={tank.label} 
              level={tank.level} 
              max={tank.max} 
              hasAlarm={hasAlarm(tank.id, alarmData)} 
            />
          </div>
        );
      })}
    </div>
    <div className="flex justify-center gap-10 pt-1">
      {[
        { id: 1, val: data.leak1, component: 'leak1' },
        { id: 2, val: data.leak2, component: 'leak2' },
        { id: 3, val: data.leak3, component: 'leak3' }
      ].map(leak => {
        const isAlarm = hasAlarm(leak.component, alarmData);
        const alarmNames = getAlarmNames(leak.component, alarmData);
        return (
          <div key={leak.id} className="flex flex-col items-center gap-2 group min-w-[190px]">
            <div className={cn("flex items-center gap-2 text-base font-black uppercase tracking-wider", isAlarm ? "text-red-200 animate-pulse" : "text-slate-100")}>
              <AlertTriangle size={20} className={cn(isAlarm ? "text-red-400 animate-pulse" : "text-sky-300")} /> 盐酸泄漏 {leak.id}
            </div>
            <div className={cn("rounded-lg border bg-transparent px-6 py-2.5 font-mono text-xl font-black transition-all", isAlarm ? "border-red-500 text-red-100 shadow-[0_0_16px_rgba(239,68,68,0.25)] animate-pulse-border" : "border-sky-300/70 text-slate-100")}>
              {leak.val.toFixed(3)} <span className="text-sm text-slate-300">ppm</span>
            </div>
            {alarmNames.length > 0 && (
              <div className="flex flex-col items-center gap-1 min-h-[48px]">
                {alarmNames.map((name, idx) => (
                  <div key={idx} className="rounded border border-red-500 bg-transparent px-3 py-1 text-center text-sm font-bold text-red-100 animate-pulse">
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);
