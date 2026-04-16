import React from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';
import { cn } from '../utils/cn';

/** 罐内液体：天青色 */
const liquidClass = 'bg-cyan-300';

export const Tank = ({ label, level, temp, unit = 'm', color = liquidClass, max = 2.5, hasAlarm = false }: { label: string, level: number, temp?: number, unit?: string, color?: string, max?: number, hasAlarm?: boolean }) => (
  <div className="flex flex-col items-center gap-3">
    <div className={cn("relative w-28 h-48 rounded-t-xl border-2 overflow-hidden flex flex-col-reverse shadow-lg transition-all bg-sky-100/90", hasAlarm ? "border-red-500 animate-pulse-border" : "border-sky-300")}>
      {hasAlarm && <div className="absolute inset-0 bg-red-200/35 animate-pulse z-10 pointer-events-none" />}
      <motion.div initial={{ height: 0 }} animate={{ height: `${Math.min((level / max) * 100, 100)}%` }} className={cn(color, "w-full opacity-90 relative")}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/50" />
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div className={cn("backdrop-blur-sm px-2.5 py-1.5 rounded border font-bold text-base shadow-md", hasAlarm ? "bg-red-100 border-red-400 text-red-900" : "bg-white/95 border-sky-200 text-slate-900")}>
          {level.toFixed(2)} {unit}
        </div>
      </div>
      <div className="absolute right-1.5 top-4 bottom-0 w-2.5 flex flex-col justify-between py-2 opacity-50">
        {[...Array(10)].map((_, i) => <div key={i} className="h-0.5 w-full bg-sky-300" />)}
      </div>
    </div>
    <div className="text-center">
      <div className={cn("font-bold text-base tracking-wide", hasAlarm ? "text-red-800 font-extrabold" : "text-slate-900")}>{label}</div>
      {temp !== undefined && (
        <div className={cn("px-3 py-1.5 rounded-md mt-2 font-black text-sm shadow border", hasAlarm ? "bg-red-100 border-red-400 text-red-900" : "bg-white border-sky-200 text-slate-900")}>
          {temp.toFixed(1)} °C
        </div>
      )}
    </div>
  </div>
);

export const FlowBox = ({ title, instant, total, unit = 'm³/h', hasAlarm = false }: { title: string, instant: number, total: number, unit?: string, hasAlarm?: boolean }) => (
  <div className={cn("border p-4 rounded-xl shadow-md w-72 group transition-all bg-white/85", hasAlarm ? "border-red-500 animate-pulse-border shadow-red-100/80" : "border-sky-200 hover:border-sky-400")}>
    <div className={cn("font-black mb-3 text-sm border-b pb-2 flex items-center justify-between", hasAlarm ? "text-red-800 border-red-300" : "text-sky-800 border-sky-200")}>
      {title}
      <Activity size={14} className={hasAlarm ? "text-red-600" : "text-sky-500"} />
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-slate-700 text-sm font-medium">瞬时流量:</span>
        <div className={cn("px-3 py-1.5 rounded border font-mono font-bold text-base min-w-[110px] text-right shadow-inner", hasAlarm ? "bg-red-50 border-red-400 text-red-900" : "bg-sky-50 border-sky-200 text-sky-900")}>
          {instant.toFixed(1)} <span className="text-xs text-slate-600">{unit}</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-slate-700 text-sm font-medium">累计流量:</span>
        <div className={cn("px-3 py-1.5 rounded border font-mono font-bold text-base min-w-[110px] text-right shadow-inner", hasAlarm ? "bg-red-50 border-red-400 text-red-900" : "bg-emerald-50 border-emerald-200 text-emerald-900")}>
          {total.toFixed(1)} <span className="text-xs text-slate-600">m³</span>
        </div>
      </div>
    </div>
  </div>
);
