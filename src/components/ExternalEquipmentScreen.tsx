import React from 'react';
import { Factory, Activity, Settings, LayoutDashboard } from 'lucide-react';
import { cn } from '../utils/cn';
import { hasAlarm, getAlarmNames } from '../utils/alarmUtils';
import { ScadaData, AlarmData } from '../types';

const equipmentValueClass = "rounded-md border px-3 py-1 text-sm font-black shadow-md";
const bottomAlarmBadgeClass = "absolute -bottom-9 left-1/2 -translate-x-1/2 w-max max-w-[170px] rounded border border-red-500 bg-red-100 px-2.5 py-1 text-xs font-bold text-center text-red-900 shadow-md z-20";
const towerAlarmBadgeClass = "absolute left-1/2 top-[42px] -translate-x-1/2 w-max max-w-[170px] rounded border border-red-500 bg-red-100 px-2.5 py-1 text-xs font-bold text-center text-red-900 shadow-md z-20";

const externalEquipmentAreaStyles = {
  container: "grid h-full grid-rows-2 gap-3 px-4 py-3",
  oldPlantPanel: "relative h-[calc(100%-28px)] min-h-[190px] overflow-hidden rounded-xl border border-sky-200/55 bg-transparent",
  oldPlantGrid: "relative z-10 grid h-full grid-cols-[1fr_1fr_1fr_1fr] items-center gap-3 px-4",
  drumPanel: "relative h-[calc(100%-28px)] min-h-[190px] overflow-hidden rounded-xl border border-cyan-200/55 bg-transparent",
  drumGrid: "relative z-10 grid h-full grid-cols-[1fr_1fr_1fr_0.95fr] items-center gap-3 px-4",
  fanIcon: "w-16 h-16 object-contain drop-shadow-lg",
  towerIcon: "w-14 h-24 object-contain drop-shadow-lg",
};

export const ExternalEquipmentScreen = ({ data, alarmData }: { data: ScadaData, alarmData: AlarmData }) => (
    <div className="external-screen w-full h-full bg-transparent">
      <div className={externalEquipmentAreaStyles.container}>
        {/* 聚铝老厂 */}
        <div className="relative min-h-0">
          <div className="mb-2 flex items-center justify-end gap-2 text-right text-sm font-black uppercase tracking-[0.16em] text-sky-800">
            <Factory size={18} /> 聚铝老厂
          </div>

          <div className={externalEquipmentAreaStyles.oldPlantPanel}>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              {/* 技改风格：粉色背景装饰线 - 匹配图片中的连续折线 */}
              <polyline
                  points="0,25% 5%,25% 5%,10% 15%,10% 15%,25% 25%,25% 25%,10% 35%,10% 35%,25% 45%,25% 45%,10% 55%,10% 55%,25% 65%,25% 65%,10% 75%,10% 75%,25% 85%,25% 85%,10% 95%,10% 95%,25% 100%,25%"
                  fill="none"
                  stroke="#fbcfe8"
                  strokeWidth="1.5"
                  opacity="0.55"
              />

              {/* 蓝色工艺流程线 - 匹配图片中的连接方式 */}
              {/* 1. 风机 -> 洗涤塔1 */}
              <polyline
                  points="18%,45% 25%,45% 25%,18% 37.5%,18%"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
              />
              {/* 2. 洗涤塔1 -> 洗涤塔2 */}
              <polyline
                  points="42%,55% 50%,55% 50%,18% 62.5%,18%"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
              />
              {/* 3. 洗涤塔2 -> 洗涤塔3 */}
              <polyline
                  points="67%,55% 75%,55% 75%,18% 87.5%,18%"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
              />
              {/* 4. 洗涤塔3 出口 */}
              <polyline
                  points="92%,55% 100%,55%"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
              />

              {/* 底部循环回流线 */}
              <line x1="37.5%" y1="75%" x2="87.5%" y2="75%" stroke="#38bdf8" strokeWidth="2" opacity="0.75" />
              <line x1="37.5%" y1="75%" x2="37.5%" y2="65%" stroke="#38bdf8" strokeWidth="2" opacity="0.75" />
              <line x1="62.5%" y1="75%" x2="62.5%" y2="65%" stroke="#38bdf8" strokeWidth="2" opacity="0.75" />
              <line x1="87.5%" y1="75%" x2="87.5%" y2="65%" stroke="#38bdf8" strokeWidth="2" opacity="0.75" />
            </svg>

            <div className={externalEquipmentAreaStyles.oldPlantGrid}>
              {/* 风机 */}
              <div className={cn("relative flex flex-col items-center gap-2 rounded-lg p-2 transition-all", hasAlarm('old_fan', alarmData) && "border-2 border-red-500 bg-red-50 animate-pulse-border")}>
                <img src="/src/images/风机.png" alt="风机" className={externalEquipmentAreaStyles.fanIcon} referrerPolicy="no-referrer" />
                <div className={cn("text-xs font-bold", hasAlarm('old_fan', alarmData) ? "text-red-800 animate-pulse" : "text-slate-800")}>风机</div>
                <div className={cn(equipmentValueClass, hasAlarm('old_fan', alarmData) ? "border-red-500 bg-red-100 text-red-900 animate-pulse" : "border-sky-300 bg-gradient-to-r from-sky-100 to-sky-200 text-slate-900")}>
                  {data.old_fan_v.toFixed(1)} A
                </div>
                {hasAlarm('old_fan', alarmData) && getAlarmNames('old_fan', alarmData).map((name, idx) => (
                    <div key={idx} className={towerAlarmBadgeClass}>{name}</div>
                ))}
              </div>

              {/* 洗涤塔1 + 循环泵1 */}
              <div className="relative flex flex-col items-center gap-1">
                <img src="/src/images/洗涤塔.png" alt="洗涤塔" className={externalEquipmentAreaStyles.towerIcon} referrerPolicy="no-referrer" />
                <div className="text-sky-800 text-xs font-bold">洗涤塔1</div>
                <div className="flex flex-col items-center gap-1 mt-1">
                  <Settings className={cn(hasAlarm('old_pump1', alarmData) ? "text-red-600 animate-spin-slow" : "text-sky-600", data.old_pump1_v > 0 && !hasAlarm('old_pump1', alarmData) && "animate-spin-slow")} size={20} />
                  <div className={cn("text-xs font-bold", hasAlarm('old_pump1', alarmData) ? "text-red-800 animate-pulse" : "text-slate-700")}>循环泵1</div>
                  <div className={cn("border px-2 py-0.5 rounded font-mono text-xs shadow-inner", hasAlarm('old_pump1', alarmData) ? "bg-red-100 border-red-500 text-red-900 animate-pulse" : "bg-white border-sky-200 text-sky-900")}>
                    {data.old_pump1_v.toFixed(1)} A
                  </div>
                </div>
                {hasAlarm('old_pump1', alarmData) && getAlarmNames('old_pump1', alarmData).map((name, idx) => (
                    <div key={idx} className={towerAlarmBadgeClass}>{name}</div>
                ))}
              </div>

              {/* 洗涤塔2 + 循环泵2 */}
              <div className="relative flex flex-col items-center gap-1">
                <img src="/src/images/洗涤塔.png" alt="洗涤塔" className={externalEquipmentAreaStyles.towerIcon} referrerPolicy="no-referrer" />
                <div className="text-sky-800 text-xs font-bold">洗涤塔2</div>
                <div className="flex flex-col items-center gap-1 mt-1">
                  <Settings className={cn(hasAlarm('old_pump2', alarmData) ? "text-red-600 animate-spin-slow" : "text-sky-600", data.old_pump2_v > 0 && !hasAlarm('old_pump2', alarmData) && "animate-spin-slow")} size={20} />
                  <div className={cn("text-xs font-bold", hasAlarm('old_pump2', alarmData) ? "text-red-800 animate-pulse" : "text-slate-700")}>循环泵2</div>
                  <div className={cn("border px-2 py-0.5 rounded font-mono text-xs shadow-inner", hasAlarm('old_pump2', alarmData) ? "bg-red-100 border-red-500 text-red-900 animate-pulse" : "bg-white border-sky-200 text-sky-900")}>
                    {data.old_pump2_v.toFixed(1)} A
                  </div>
                </div>
                {hasAlarm('old_pump2', alarmData) && getAlarmNames('old_pump2', alarmData).map((name, idx) => (
                    <div key={idx} className={towerAlarmBadgeClass}>{name}</div>
                ))}
              </div>

              {/* 洗涤塔3 + 循环泵3 */}
              <div className="relative flex flex-col items-center gap-1">
                <img src="/src/images/洗涤塔.png" alt="洗涤塔" className={externalEquipmentAreaStyles.towerIcon} referrerPolicy="no-referrer" />
                <div className="text-sky-800 text-xs font-bold">洗涤塔3</div>
                <div className="flex flex-col items-center gap-1 mt-1">
                  <Settings className={cn(hasAlarm('old_pump3', alarmData) ? "text-red-600 animate-spin-slow" : "text-sky-600", data.old_pump3_v > 0 && !hasAlarm('old_pump3', alarmData) && "animate-spin-slow")} size={20} />
                  <div className={cn("text-xs font-bold", hasAlarm('old_pump3', alarmData) ? "text-red-800 animate-pulse" : "text-slate-700")}>循环泵3</div>
                  <div className={cn("border px-2 py-0.5 rounded font-mono text-xs shadow-inner", hasAlarm('old_pump3', alarmData) ? "bg-red-100 border-red-500 text-red-900 animate-pulse" : "bg-white border-sky-200 text-sky-900")}>
                    {data.old_pump3_v.toFixed(1)} A
                  </div>
                </div>
                {hasAlarm('old_pump3', alarmData) && getAlarmNames('old_pump3', alarmData).map((name, idx) => (
                    <div key={idx} className={towerAlarmBadgeClass}>{name}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 滚筒干燥 */}
        <div className="relative min-h-0">
          <div className="mb-2 flex items-center justify-end gap-2 text-right text-sm font-black uppercase tracking-[0.16em] text-cyan-900">
            <Activity size={18} /> 滚筒干燥
          </div>

          <div className={externalEquipmentAreaStyles.drumPanel}>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              {/* 粉色背景装饰线 */}
              <polyline
                  points="0,25% 5%,25% 5%,10% 15%,10% 15%,25% 25%,25% 25%,10% 35%,10% 35%,25% 45%,25% 45%,10% 55%,10% 55%,25% 65%,25% 65%,10% 75%,10% 75%,25% 85%,25% 85%,10% 95%,10% 95%,25% 100%,25%"
                  fill="none"
                  stroke="#a5f3fc"
                  strokeWidth="1.5"
                  opacity="0.5"
              />

              {/* 蓝色工艺流程线 */}
              {/* 1. 风机 -> 洗涤塔1 */}
              <polyline
                  points="18%,45% 25%,45% 25%,18% 37.5%,18%"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
              />
              {/* 2. 洗涤塔1 -> 洗涤塔2 */}
              <polyline
                  points="42%,55% 50%,55% 50%,18% 62.5%,18%"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
              />
              {/* 3. 洗涤塔2 -> 离心机 */}
              <polyline
                  points="67%,55% 75%,55% 75%,55% 85%,55%"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
              />

              {/* 底部循环回流线 */}
              <line x1="37.5%" y1="75%" x2="62.5%" y2="75%" stroke="#22d3ee" strokeWidth="2" opacity="0.75" />
              <line x1="37.5%" y1="75%" x2="37.5%" y2="65%" stroke="#22d3ee" strokeWidth="2" opacity="0.75" />
              <line x1="62.5%" y1="75%" x2="62.5%" y2="65%" stroke="#22d3ee" strokeWidth="2" opacity="0.75" />
            </svg>

            <div className={externalEquipmentAreaStyles.drumGrid}>
              {/* 风机 */}
              <div className={cn("relative flex flex-col items-center gap-2 rounded-lg p-2 transition-all", hasAlarm('drum_fan', alarmData) && "border-2 border-red-500 bg-red-50 animate-pulse-border")}>
                <img src="/src/images/风机.png" alt="风机" className={externalEquipmentAreaStyles.fanIcon} referrerPolicy="no-referrer" />
                <div className={cn("text-xs font-bold", hasAlarm('drum_fan', alarmData) ? "text-red-800 animate-pulse" : "text-slate-800")}>风机</div>
                <div className={cn(equipmentValueClass, hasAlarm('drum_fan', alarmData) ? "border-red-500 bg-red-100 text-red-900 animate-pulse" : "border-cyan-300 bg-gradient-to-r from-cyan-100 to-cyan-200 text-slate-900")}>
                  {data.drum_fan_v.toFixed(1)} A
                </div>
                {hasAlarm('drum_fan', alarmData) && getAlarmNames('drum_fan', alarmData).map((name, idx) => (
                    <div key={idx} className={towerAlarmBadgeClass}>{name}</div>
                ))}
              </div>

              {/* 洗涤塔1 + 循环泵1 */}
              <div className="relative flex flex-col items-center gap-1">
                <img src="/src/images/洗涤塔.png" alt="洗涤塔" className={externalEquipmentAreaStyles.towerIcon} referrerPolicy="no-referrer" />
                <div className="text-cyan-900 text-xs font-bold">洗涤塔1</div>
                <div className="flex flex-col items-center gap-1 mt-1">
                  <Settings className={cn(hasAlarm('drum_pump1', alarmData) ? "text-red-600 animate-spin-slow" : "text-cyan-600", data.drum_pump1_v > 0 && !hasAlarm('drum_pump1', alarmData) && "animate-spin-slow")} size={20} />
                  <div className={cn("text-xs font-bold", hasAlarm('drum_pump1', alarmData) ? "text-red-800 animate-pulse" : "text-slate-700")}>循环泵1</div>
                  <div className={cn("border px-2 py-0.5 rounded font-mono text-xs shadow-inner", hasAlarm('drum_pump1', alarmData) ? "bg-red-100 border-red-500 text-red-900 animate-pulse" : "bg-white border-cyan-200 text-cyan-900")}>
                    {data.drum_pump1_v.toFixed(1)} A
                  </div>
                </div>
                {hasAlarm('drum_pump1', alarmData) && getAlarmNames('drum_pump1', alarmData).map((name, idx) => (
                    <div key={idx} className={towerAlarmBadgeClass}>{name}</div>
                ))}
              </div>

              {/* 洗涤塔2 + 循环泵2 */}
              <div className="relative flex flex-col items-center gap-1">
                <img src="/src/images/洗涤塔.png" alt="洗涤塔" className={externalEquipmentAreaStyles.towerIcon} referrerPolicy="no-referrer" />
                <div className="text-cyan-900 text-xs font-bold">洗涤塔2</div>
                <div className="flex flex-col items-center gap-1 mt-1">
                  <Settings className={cn(hasAlarm('drum_pump2', alarmData) ? "text-red-600 animate-spin-slow" : "text-cyan-600", data.drum_pump2_v > 0 && !hasAlarm('drum_pump2', alarmData) && "animate-spin-slow")} size={20} />
                  <div className={cn("text-xs font-bold", hasAlarm('drum_pump2', alarmData) ? "text-red-800 animate-pulse" : "text-slate-700")}>循环泵2</div>
                  <div className={cn("border px-2 py-0.5 rounded font-mono text-xs shadow-inner", hasAlarm('drum_pump2', alarmData) ? "bg-red-100 border-red-500 text-red-900 animate-pulse" : "bg-white border-cyan-200 text-cyan-900")}>
                    {data.drum_pump2_v.toFixed(1)} A
                  </div>
                </div>
                {hasAlarm('drum_pump2', alarmData) && getAlarmNames('drum_pump2', alarmData).map((name, idx) => (
                    <div key={idx} className={towerAlarmBadgeClass}>{name}</div>
                ))}
              </div>

              {/* 离心机 */}
              <div className={cn("relative flex flex-col items-center gap-2 rounded-lg p-2 transition-all", hasAlarm('old_centrifuge', alarmData) && "border-2 border-red-500 bg-red-50 animate-pulse-border")}>
                <LayoutDashboard className={cn(hasAlarm('old_centrifuge', alarmData) ? "text-red-600 animate-bounce" : "text-sky-600", data.drum_centrifuge_v > 0 && !hasAlarm('old_centrifuge', alarmData) && "animate-bounce")} size={32} />
                <div className={cn("text-xs font-bold", hasAlarm('old_centrifuge', alarmData) ? "text-red-800 animate-pulse" : "text-slate-800")}>离心机</div>
                <div className={cn(equipmentValueClass, hasAlarm('old_centrifuge', alarmData) ? "border-red-500 bg-red-100 text-red-900 animate-pulse" : "border-sky-300 bg-gradient-to-r from-sky-100 to-blue-100 text-slate-900")}>
                  {data.drum_centrifuge_v.toFixed(1)} A
                </div>
                {hasAlarm('old_centrifuge', alarmData) && getAlarmNames('old_centrifuge', alarmData).map((name, idx) => (
                    <div key={idx} className={bottomAlarmBadgeClass}>{name}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
);
