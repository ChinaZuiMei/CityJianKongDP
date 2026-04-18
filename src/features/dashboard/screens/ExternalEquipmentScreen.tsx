import React from 'react';
import { Settings } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { getAlarmNames, hasAlarm } from '../lib/alarmUtils';
import { AlarmData, ScadaData } from '../model/types';
import fanDrumImage from '../../../images/风机_滚筒.png';
import scrubberTowerImage from '../../../images/洗涤塔.png';
import centrifugeImage from '../../../images/img_5.png';

const equipmentValueClass = "rounded-md px-3 py-1 text-sm font-black bg-transparent";
const alarmBadgeInlineClass =
  "mt-1 w-max max-w-[170px] rounded bg-red-500/5 px-2.5 py-1 text-center text-xs font-bold text-red-100 shadow-[0_0_14px_rgba(239,68,68,0.25)]";
const panelClass = "relative h-full min-h-0 overflow-visible rounded-xl bg-transparent pb-2";
const fanIconClass = "h-18 w-18 object-contain";
const towerIconClass = "h-28 w-16 object-contain";
const centrifugeIconClass = "h-14 w-20 object-contain";

const OldPlantBlock = ({ data, alarmData }: { data: ScadaData; alarmData: AlarmData }) => (
  <div className="relative min-h-0">
    <div className={panelClass}>
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

            <div className="relative z-10 grid h-full grid-cols-[0.95fr_1fr_1fr_1fr] items-center gap-2 px-3">
              {/* 风机 */}
              <div
                className={cn(
                  "relative flex flex-col items-center gap-2 rounded-lg p-2 transition-all",
                  hasAlarm('old_fan', alarmData) && "bg-red-500/5 shadow-[0_0_16px_rgba(239,68,68,0.35)] animate-pulse"
                )}
              >
                <img src={fanDrumImage} alt="风机" className={fanIconClass} />
                <div className={cn("text-xs font-bold", hasAlarm('old_fan', alarmData) ? "text-red-200 animate-pulse" : "panel-title-glow")}>风机</div>
                <div
                  className={cn(
                    equipmentValueClass,
                    hasAlarm('old_fan', alarmData)
                      ? "text-red-100 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.35)]"
                      : "data-glow"
                  )}
                >
                  {data.old_fan_v.toFixed(1)} A
                </div>
                {hasAlarm('old_fan', alarmData) && getAlarmNames('old_fan', alarmData).map((name, idx) => (
                    <div key={idx} className={alarmBadgeInlineClass}>{name}</div>
                ))}
              </div>

              {/* 洗涤塔1 + 循环泵1 */}
              <div className="relative flex flex-col items-center gap-1">
                <img src={scrubberTowerImage} alt="洗涤塔" className={towerIconClass} />
                <div className="panel-title-glow text-xs font-bold">洗涤塔1</div>
                <div className="flex flex-col items-center gap-1 mt-1">
                  <Settings className={cn(hasAlarm('old_pump1', alarmData) ? "text-red-600 animate-spin-slow" : "text-sky-600", data.old_pump1_v > 0 && !hasAlarm('old_pump1', alarmData) && "animate-spin-slow")} size={20} />
                  <div className={cn("text-xs font-bold", hasAlarm('old_pump1', alarmData) ? "text-red-200 animate-pulse" : "panel-title-glow")}>循环泵1</div>
                  <div
                    className={cn(
                      "rounded bg-transparent px-2 py-0.5 font-mono text-xs",
                      hasAlarm('old_pump1', alarmData)
                        ? "text-red-100 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.35)]"
                        : "data-glow"
                    )}
                  >
                    {data.old_pump1_v.toFixed(1)} A
                  </div>
                </div>
                {hasAlarm('old_pump1', alarmData) && getAlarmNames('old_pump1', alarmData).map((name, idx) => (
                    <div key={idx} className={alarmBadgeInlineClass}>{name}</div>
                ))}
              </div>

              {/* 洗涤塔2 + 循环泵2 */}
              <div className="relative flex flex-col items-center gap-1">
                <img src={scrubberTowerImage} alt="洗涤塔" className={towerIconClass} />
                <div className="panel-title-glow text-xs font-bold">洗涤塔2</div>
                <div className="flex flex-col items-center gap-1 mt-1">
                  <Settings className={cn(hasAlarm('old_pump2', alarmData) ? "text-red-600 animate-spin-slow" : "text-sky-600", data.old_pump2_v > 0 && !hasAlarm('old_pump2', alarmData) && "animate-spin-slow")} size={20} />
                  <div className={cn("text-xs font-bold", hasAlarm('old_pump2', alarmData) ? "text-red-200 animate-pulse" : "panel-title-glow")}>循环泵2</div>
                  <div
                    className={cn(
                      "rounded bg-transparent px-2 py-0.5 font-mono text-xs",
                      hasAlarm('old_pump2', alarmData)
                        ? "text-red-100 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.35)]"
                        : "data-glow"
                    )}
                  >
                    {data.old_pump2_v.toFixed(1)} A
                  </div>
                </div>
                {hasAlarm('old_pump2', alarmData) && getAlarmNames('old_pump2', alarmData).map((name, idx) => (
                    <div key={idx} className={alarmBadgeInlineClass}>{name}</div>
                ))}
              </div>

              {/* 洗涤塔3 + 循环泵3 */}
              <div className="relative flex flex-col items-center gap-1">
                <img src={scrubberTowerImage} alt="洗涤塔" className={towerIconClass} />
                <div className="panel-title-glow text-xs font-bold">洗涤塔3</div>
                <div className="flex flex-col items-center gap-1 mt-1">
                  <Settings className={cn(hasAlarm('old_pump3', alarmData) ? "text-red-600 animate-spin-slow" : "text-sky-600", data.old_pump3_v > 0 && !hasAlarm('old_pump3', alarmData) && "animate-spin-slow")} size={20} />
                  <div className={cn("text-xs font-bold", hasAlarm('old_pump3', alarmData) ? "text-red-200 animate-pulse" : "panel-title-glow")}>循环泵3</div>
                  <div
                    className={cn(
                      "rounded bg-transparent px-2 py-0.5 font-mono text-xs",
                      hasAlarm('old_pump3', alarmData)
                        ? "text-red-100 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.35)]"
                        : "data-glow"
                    )}
                  >
                    {data.old_pump3_v.toFixed(1)} A
                  </div>
                </div>
                {hasAlarm('old_pump3', alarmData) && getAlarmNames('old_pump3', alarmData).map((name, idx) => (
                    <div key={idx} className={alarmBadgeInlineClass}>{name}</div>
                ))}
              </div>
            </div>
    </div>
  </div>
);

const DrumBlock = ({ data, alarmData }: { data: ScadaData; alarmData: AlarmData }) => (
  <div className="relative min-h-0">
    <div className={panelClass}>
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
                  points="67%,64% 75%,64% 75%,74% 85%,74%"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
              />

              {/* 底部循环回流线 */}
              <line x1="37.5%" y1="85%" x2="62.5%" y2="85%" stroke="#22d3ee" strokeWidth="2" opacity="0.75" />
              <line x1="37.5%" y1="85%" x2="37.5%" y2="74%" stroke="#22d3ee" strokeWidth="2" opacity="0.75" />
              <line x1="62.5%" y1="85%" x2="62.5%" y2="74%" stroke="#22d3ee" strokeWidth="2" opacity="0.75" />
            </svg>

            <div className="relative z-10 grid h-full grid-cols-[0.95fr_1fr_1fr_0.92fr] items-center gap-2 px-3">
              {/* 风机 */}
              <div
                className={cn(
                  "relative flex flex-col items-center gap-2 rounded-lg p-2 transition-all",
                  hasAlarm('drum_fan', alarmData) && "bg-red-500/5 shadow-[0_0_16px_rgba(239,68,68,0.35)] animate-pulse"
                )}
              >
                <img src={fanDrumImage} alt="风机" className={fanIconClass} />
                <div className={cn("text-xs font-bold", hasAlarm('drum_fan', alarmData) ? "text-red-200 animate-pulse" : "panel-title-glow-cyan")}>风机</div>
                <div
                  className={cn(
                    equipmentValueClass,
                    hasAlarm('drum_fan', alarmData)
                      ? "text-red-100 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.35)]"
                      : "data-glow-cyan"
                  )}
                >
                  {data.drum_fan_v.toFixed(1)} A
                </div>
                {hasAlarm('drum_fan', alarmData) && getAlarmNames('drum_fan', alarmData).map((name, idx) => (
                    <div key={idx} className={alarmBadgeInlineClass}>{name}</div>
                ))}
              </div>

              {/* 洗涤塔1 + 循环泵1 */}
              <div className="relative flex flex-col items-center gap-1">
                <img src={scrubberTowerImage} alt="洗涤塔" className={towerIconClass} />
                <div className="panel-title-glow-cyan text-xs font-bold">洗涤塔1</div>
                <div className="flex flex-col items-center gap-1 mt-1">
                  <Settings className={cn(hasAlarm('drum_pump1', alarmData) ? "text-red-600 animate-spin-slow" : "text-cyan-600", data.drum_pump1_v > 0 && !hasAlarm('drum_pump1', alarmData) && "animate-spin-slow")} size={20} />
                  <div className={cn("text-xs font-bold", hasAlarm('drum_pump1', alarmData) ? "text-red-200 animate-pulse" : "panel-title-glow-cyan")}>循环泵1</div>
                  <div
                    className={cn(
                      "rounded bg-transparent px-2 py-0.5 font-mono text-xs",
                      hasAlarm('drum_pump1', alarmData)
                        ? "text-red-100 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.35)]"
                        : "data-glow-cyan"
                    )}
                  >
                    {data.drum_pump1_v.toFixed(1)} A
                  </div>
                </div>
                {hasAlarm('drum_pump1', alarmData) && getAlarmNames('drum_pump1', alarmData).map((name, idx) => (
                    <div key={idx} className={alarmBadgeInlineClass}>{name}</div>
                ))}
              </div>

              {/* 洗涤塔2 + 循环泵2 */}
              <div className="relative flex flex-col items-center gap-1">
                <img src={scrubberTowerImage} alt="洗涤塔" className={towerIconClass} />
                <div className="panel-title-glow-cyan text-xs font-bold">洗涤塔2</div>
                <div className="flex flex-col items-center gap-1 mt-1">
                  <Settings className={cn(hasAlarm('drum_pump2', alarmData) ? "text-red-600 animate-spin-slow" : "text-cyan-600", data.drum_pump2_v > 0 && !hasAlarm('drum_pump2', alarmData) && "animate-spin-slow")} size={20} />
                  <div className={cn("text-xs font-bold", hasAlarm('drum_pump2', alarmData) ? "text-red-200 animate-pulse" : "panel-title-glow-cyan")}>循环泵2</div>
                  <div
                    className={cn(
                      "rounded bg-transparent px-2 py-0.5 font-mono text-xs",
                      hasAlarm('drum_pump2', alarmData)
                        ? "text-red-100 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.35)]"
                        : "data-glow-cyan"
                    )}
                  >
                    {data.drum_pump2_v.toFixed(1)} A
                  </div>
                </div>
                {hasAlarm('drum_pump2', alarmData) && getAlarmNames('drum_pump2', alarmData).map((name, idx) => (
                    <div key={idx} className={alarmBadgeInlineClass}>{name}</div>
                ))}
              </div>

              {/* 离心机 */}
              <div
                className={cn(
                  "relative flex flex-col items-center gap-2 rounded-lg p-2 transition-all",
                  hasAlarm('old_centrifuge', alarmData) && "bg-red-500/5 shadow-[0_0_16px_rgba(239,68,68,0.35)] animate-pulse"
                )}
              >
                <img
                  src={centrifugeImage}
                  alt="离心机"
                  className={cn(
                    centrifugeIconClass,
                    data.drum_centrifuge_v > 0 && !hasAlarm('old_centrifuge', alarmData) && "animate-bounce"
                  )}
                />
                <div className={cn("text-xs font-bold", hasAlarm('old_centrifuge', alarmData) ? "text-red-200 animate-pulse" : "panel-title-glow")}>离心机</div>
                <div
                  className={cn(
                    equipmentValueClass,
                    hasAlarm('old_centrifuge', alarmData)
                      ? "text-red-100 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.35)]"
                      : "data-glow"
                  )}
                >
                  {data.drum_centrifuge_v.toFixed(1)} A
                </div>
                {hasAlarm('old_centrifuge', alarmData) && getAlarmNames('old_centrifuge', alarmData).map((name, idx) => (
                    <div key={idx} className={alarmBadgeInlineClass}>{name}</div>
                ))}
              </div>
            </div>
    </div>
  </div>
);

export const ExternalEquipmentScreen = ({
  data,
  alarmData,
  layout = 'stacked',
  section = 'both',
}: {
  data: ScadaData;
  alarmData: AlarmData;
  layout?: 'stacked' | 'sideBySide';
  section?: 'both' | 'oldPlant' | 'drum';
}) => (
    <div className="external-screen w-full h-full bg-transparent">
      {section === 'oldPlant' ? (
        <div className="h-full px-4 py-3 overflow-visible">
          <OldPlantBlock data={data} alarmData={alarmData} />
        </div>
      ) : section === 'drum' ? (
        <div className="h-full px-4 py-3 overflow-visible">
          <DrumBlock data={data} alarmData={alarmData} />
        </div>
      ) : (
        <div className={layout === 'sideBySide'
          ? "grid h-full grid-cols-2 gap-4 px-4 py-3 overflow-visible"
          : "grid h-full grid-rows-2 gap-2.5 px-4 py-3 overflow-visible"}
        >
          <OldPlantBlock data={data} alarmData={alarmData} />
          <DrumBlock data={data} alarmData={alarmData} />
        </div>
      )}
    </div>
);
