import React from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';
import { cn } from '../../../utils/cn';
import coneTankImage from '../../../images/硫酸02.png';
import reactorTankImage from '../../../images/反应槽.png';
import storageTankImage from '../../../images/盐酸罐02.png';

/** 罐内液体：天青色 */
const liquidClass = 'bg-cyan-300';

export const Tank = ({
  label,
  level,
  temp,
  unit = 'm',
  color = liquidClass,
  max = 2.5,
  hasAlarm = false,
  variant = 'default',
  labelOffsetClassName,
}: {
  label: string,
  level: number,
  temp?: number,
  unit?: string,
  color?: string,
  max?: number,
  hasAlarm?: boolean,
  variant?: 'default' | 'storage' | 'cone' | 'reactor',
  labelOffsetClassName?: string,
}) => {
  const fillPercent = Math.min((level / max) * 100, 100);
  const isImageTank = variant === 'storage' || variant === 'cone' || variant === 'reactor';
  const tankImage =
    variant === 'cone' ? coneTankImage : variant === 'reactor' ? reactorTankImage : storageTankImage;
  /**
   * 备注（重要）：罐区 `storage`（盐酸罐）与 `cone`（硫酸罐）两张图片的“视觉大小一致”不要再改。
   * 当前做法依赖以下组合来保证不同电脑分辨率/屏幕比例/浏览器下观感一致：
   * - `imageTankSizeClass` 统一外层高度
   * - `<img className="h-full w-auto object-contain" />` 用高度撑满，宽度随图片比例自适应
   * - `imageBaselineAdjustClass` 只做基线微调（用于对齐）
   * 如需调整观感，优先改原始图片资源或只微调 `imageBaselineAdjustClass`，不要改整体尺寸策略。
   */
  const imageTankSizeClass = 'h-[11.75rem]';
  const imageBaselineAdjustClass =
    variant === 'reactor'
      ? '-translate-y-[58px]'
      : variant === 'cone'
        ? '-translate-y-[5px]'
        : '-translate-y-[1px]';

  return (
    <div className="flex flex-col items-center gap-2">
      {isImageTank ? (
        <div className={cn("relative flex items-center justify-center transition-all", imageTankSizeClass)}>
          {hasAlarm ? <div className="absolute inset-0 z-10 rounded-[28px] bg-red-500/8 blur-xl animate-pulse pointer-events-none" /> : null}
          <img
            src={tankImage}
            alt={label}
            className={cn(
              "h-full w-auto object-contain transition-all duration-300",
              imageBaselineAdjustClass,
              hasAlarm &&
                "drop-shadow-[0_0_20px_rgba(239,68,68,0.75)] saturate-[1.15] brightness-[0.92] sepia-[0.35] hue-rotate-[-18deg]",
            )}
            draggable="false"
          />
          {hasAlarm ? <div className="absolute inset-0 z-10 bg-red-500/10 mix-blend-screen pointer-events-none animate-pulse" /> : null}
          {variant === 'reactor' && (
            <div className="absolute inset-x-0 bottom-[1.8rem] z-20 flex justify-center">
              <div className={cn("rounded border px-2 py-0.5 text-xs font-bold shadow-[0_0_12px_rgba(15,23,42,0.35)]", hasAlarm ? "border-red-400 bg-slate-950/50 text-red-100" : "panel-frame bg-slate-950/40 data-glow")}>
                {level.toFixed(2)} {unit}
              </div>
            </div>
          )}
          {variant !== 'reactor' && (
            // 液位数据会再往下，落在图片和名称之间更靠下的位置，因此需要将bottom-3改为-bottom-6
            <div className="absolute inset-x-0 -bottom-8 z-20 flex justify-center">
              <div className={cn("rounded border px-2 py-0.5 text-xs font-bold shadow-[0_0_12px_rgba(15,23,42,0.35)]", hasAlarm ? "border-red-400 bg-slate-950/50 text-red-100" : "panel-frame bg-slate-950/40 data-glow")}>
                {level.toFixed(2)} {unit}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={cn("relative flex h-40 w-24 flex-col-reverse overflow-hidden rounded-t-xl border-2 bg-transparent transition-all", hasAlarm ? "border-red-500 animate-pulse-border" : "panel-frame")}>
          {hasAlarm && <div className="absolute inset-0 z-10 animate-pulse bg-red-500/10 pointer-events-none" />}
          <motion.div initial={{ height: 0 }} animate={{ height: `${fillPercent}%` }} className={cn(color, "w-full opacity-90 relative")}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/30" />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className={cn("rounded border px-2 py-1 text-sm font-bold", hasAlarm ? "border-red-400 bg-transparent text-red-100" : "panel-frame data-glow bg-transparent")}>
              {level.toFixed(2)} {unit}
            </div>
          </div>
          <div className="absolute right-1.5 top-4 bottom-0 w-2.5 flex flex-col justify-between py-2 opacity-50">
            {[...Array(10)].map((_, i) => <div key={i} className="h-0.5 w-full bg-sky-300/70" />)}
          </div>
        </div>
      )}
      <div className={cn("mt-1 flex h-[3.15rem] flex-col items-center text-center", variant === 'reactor' && "-translate-y-6", labelOffsetClassName)}>
        <div className="flex items-center justify-center gap-2">
          <div className={cn("flex h-5 items-center text-sm font-bold tracking-wide", hasAlarm ? "font-extrabold text-red-200" : "panel-title-glow")}>
            {label}
          </div>
          {temp !== undefined && variant === 'reactor' && (
            <div className={cn("rounded-md border bg-transparent px-2 py-0.5 text-[11px] font-black leading-none", hasAlarm ? "border-red-400 text-red-100" : "panel-frame data-glow")}>
              {temp.toFixed(1)} °C
            </div>
          )}
        </div>
        {temp !== undefined && variant !== 'reactor' && (
          <div className={cn("mt-1.5 rounded-md border bg-transparent px-2.5 py-1 text-xs font-black", hasAlarm ? "border-red-400 text-red-100" : "panel-frame data-glow")}>
            {temp.toFixed(1)} °C
          </div>
        )}
      </div>
    </div>
  );
};

export const FlowBox = ({ title, instant, total, unit = 'm³/h', hasAlarm = false }: { title: string, instant: number, total: number, unit?: string, hasAlarm?: boolean }) => (
  <div className={cn("group w-60 rounded-xl border bg-transparent p-3 transition-all", hasAlarm ? "border-red-500 animate-pulse-border" : "panel-frame hover:border-sky-300/50")}>
    <div className={cn("mb-2 flex items-center justify-between border-b pb-2 text-xs font-black", hasAlarm ? "border-red-400/60 text-red-200" : "panel-frame panel-title-glow")}>
      {title}
      <Activity size={12} className={hasAlarm ? "text-red-600" : "text-sky-500"} />
    </div>
    <div className="space-y-2.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-slate-200">瞬时流量:</span>
        <div className={cn("min-w-[98px] rounded border bg-transparent px-2.5 py-1 text-right font-mono text-sm font-bold", hasAlarm ? "border-red-400 text-red-100" : "panel-frame data-glow")}>
          {instant.toFixed(1)} <span className="text-[10px] text-slate-300">{unit}</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-slate-200">累计流量:</span>
        <div className={cn("min-w-[98px] rounded border bg-transparent px-2.5 py-1 text-right font-mono text-sm font-bold", hasAlarm ? "border-red-400 text-red-100" : "border-emerald-200/45 data-glow-emerald")}>
          {total.toFixed(1)} <span className="text-[10px] text-slate-300">m³</span>
        </div>
      </div>
    </div>
  </div>
);
