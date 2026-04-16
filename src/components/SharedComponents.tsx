import React from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';
import { cn } from '../utils/cn';

/** 罐内液体：天青色 */
const liquidClass = 'bg-cyan-300';

export const Tank = ({ label, level, temp, unit = 'm', color = liquidClass, max = 2.5, hasAlarm = false }: { label: string, level: number, temp?: number, unit?: string, color?: string, max?: number, hasAlarm?: boolean }) => (
  <div className="flex flex-col items-center gap-3">
    <div className={cn("relative flex h-48 w-28 flex-col-reverse overflow-hidden rounded-t-xl border-2 bg-transparent transition-all", hasAlarm ? "border-red-500 animate-pulse-border" : "panel-frame")}>
      {hasAlarm && <div className="absolute inset-0 z-10 animate-pulse bg-red-500/10 pointer-events-none" />}
      <motion.div initial={{ height: 0 }} animate={{ height: `${Math.min((level / max) * 100, 100)}%` }} className={cn(color, "w-full opacity-90 relative")}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/30" />
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div className={cn("rounded border px-2.5 py-1.5 text-base font-bold", hasAlarm ? "border-red-400 bg-transparent text-red-100" : "panel-frame data-glow bg-transparent")}>
          {level.toFixed(2)} {unit}
        </div>
      </div>
      <div className="absolute right-1.5 top-4 bottom-0 w-2.5 flex flex-col justify-between py-2 opacity-50">
        {[...Array(10)].map((_, i) => <div key={i} className="h-0.5 w-full bg-sky-300/70" />)}
      </div>
    </div>
    <div className="text-center">
      <div className={cn("text-base font-bold tracking-wide", hasAlarm ? "font-extrabold text-red-200" : "panel-title-glow")}>{label}</div>
      {temp !== undefined && (
        <div className={cn("mt-2 rounded-md border bg-transparent px-3 py-1.5 text-sm font-black", hasAlarm ? "border-red-400 text-red-100" : "panel-frame data-glow")}>
          {temp.toFixed(1)} °C
        </div>
      )}
    </div>
  </div>
);

export const FlowBox = ({ title, instant, total, unit = 'm³/h', hasAlarm = false }: { title: string, instant: number, total: number, unit?: string, hasAlarm?: boolean }) => (
  <div className={cn("group w-72 rounded-xl border bg-transparent p-4 transition-all", hasAlarm ? "border-red-500 animate-pulse-border" : "panel-frame hover:border-sky-300/50")}>
    <div className={cn("mb-3 flex items-center justify-between border-b pb-2 text-sm font-black", hasAlarm ? "border-red-400/60 text-red-200" : "panel-frame panel-title-glow")}>
      {title}
      <Activity size={14} className={hasAlarm ? "text-red-600" : "text-sky-500"} />
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-200">瞬时流量:</span>
        <div className={cn("min-w-[110px] rounded border bg-transparent px-3 py-1.5 text-right font-mono text-base font-bold", hasAlarm ? "border-red-400 text-red-100" : "panel-frame data-glow")}>
          {instant.toFixed(1)} <span className="text-xs text-slate-300">{unit}</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-200">累计流量:</span>
        <div className={cn("min-w-[110px] rounded border bg-transparent px-3 py-1.5 text-right font-mono text-base font-bold", hasAlarm ? "border-red-400 text-red-100" : "border-emerald-200/45 data-glow-emerald")}>
          {total.toFixed(1)} <span className="text-xs text-slate-300">m³</span>
        </div>
      </div>
    </div>
  </div>
);
