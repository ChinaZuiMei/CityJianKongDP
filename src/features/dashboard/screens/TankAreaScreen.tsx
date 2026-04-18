import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { getAlarmNames, hasAlarm } from '../lib/alarmUtils';
import { AlarmData, ScadaData } from '../model/types';
import { Tank } from '../ui/SharedComponents';

export const TankAreaScreen = ({ data, alarmData }: { data: ScadaData, alarmData: AlarmData }) => (
  <div className="flex h-full w-full flex-col gap-3 overflow-visible px-2 py-1 xl:px-3 xl:py-2">
    <div className="grid min-h-0 grid-cols-4 gap-3 pb-3 overflow-visible">
      {[
        { id: 'hcl_tank1', label: '1# 盐酸罐', level: data.hcl_tank1_level, max: 3.6, variant: 'storage' as const },
        { id: 'hcl_tank2', label: '2# 盐酸罐', level: data.hcl_tank2_level, max: 3.6, variant: 'storage' as const },
        { id: 'hcl_tank3', label: '3# 盐酸罐', level: data.hcl_tank3_level, max: 3.6, variant: 'storage' as const },
        { id: 'h2so4_tank1', label: '1# 硫酸罐', level: data.h2so4_tank1_level, max: 6.2, variant: 'cone' as const }
      ].map(tank => {
        const alarmNames = getAlarmNames(tank.id, alarmData);
        return (
          <div key={tank.id} className="flex min-h-0 flex-col items-center gap-1.5 overflow-visible px-1 py-1">
            <div className="flex min-h-[34px] w-full flex-col items-center justify-start gap-1">
              {alarmNames.length > 0 ? alarmNames.map((name, idx) => (
                <div key={idx} className="w-full truncate px-2 py-0.5 text-center text-[10px] font-bold text-red-100 animate-pulse xl:text-[11px]">
                  {name}
                </div>
              )) : <div className="h-[26px]" />}
            </div>
            <Tank 
              label={tank.label} 
              level={tank.level} 
              max={tank.max} 
              variant={tank.variant}
              hasAlarm={hasAlarm(tank.id, alarmData)} 
            />
          </div>
        );
      })}
    </div>
    <div className="grid grid-cols-3 gap-3 pt-1">
      {[
        { id: 1, val: data.leak1, component: 'leak1' },
        { id: 2, val: data.leak2, component: 'leak2' },
        { id: 3, val: data.leak3, component: 'leak3' }
      ].map(leak => {
        const isAlarm = hasAlarm(leak.component, alarmData);
        const alarmNames = getAlarmNames(leak.component, alarmData);
        return (
          <div key={leak.id} className="group flex min-h-[92px] flex-col items-center justify-start gap-1.5 overflow-hidden px-2 py-2">
            <div className={cn("flex items-center gap-1 text-xs font-black uppercase tracking-[0.1em] xl:text-sm", isAlarm ? "text-red-200 animate-pulse" : "text-slate-100")}>
              <AlertTriangle size={14} className={cn(isAlarm ? "text-red-400 animate-pulse" : "text-sky-300")} /> 盐酸泄漏 {leak.id}
            </div>
            <div
              className={cn(
                "rounded-lg border px-3 py-1 font-mono text-base font-black transition-all xl:px-4 xl:text-lg",
                isAlarm
                  ? "border-red-400 bg-transparent text-red-100 drop-shadow-[0_0_10px_rgba(239,68,68,0.35)]"
                  : "border-sky-300/70 bg-transparent data-glow"
              )}
            >
              {leak.val.toFixed(3)} <span className="text-[10px] xl:text-xs text-slate-300">ppm</span>
            </div>
            <div className="flex min-h-[32px] flex-col items-center gap-1">
              {alarmNames.map((name, idx) => (
                <div key={idx} className="truncate px-2 py-0.5 text-center text-[10px] font-bold text-red-100 animate-pulse xl:text-[11px]">
                  {name}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
