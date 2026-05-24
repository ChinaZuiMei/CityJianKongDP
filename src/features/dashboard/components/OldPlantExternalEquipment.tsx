import React from 'react';
import {Settings} from 'lucide-react';
import {cn} from '../../../utils/cn';
import {formatMetricValue} from '../../../utils/formatMetricValue';
import {hasAlarm} from '../lib/alarmUtils';
import type {AlarmData} from '../model/types';
import fanDrumImage from '../../../images/风机_滚筒.png';
import scrubberTowerImage from '../../../images/洗涤塔.png';

const equipmentValueClass = 'rounded-md px-3.5 py-1.5 text-base font-black bg-transparent';
const panelClass = 'relative h-full min-h-0 overflow-visible rounded-xl bg-transparent pb-2';
const fanIconClass = 'h-28 w-28 object-contain';
const towerIconClass = 'h-40 w-24 object-contain';

export type OldPlantExternalTower = {
    towerLabel: string;
    pumpLabel: string;
    value: number;
    alarmKey?: string;
};

export type OldPlantExternalEquipmentProps = {
    fanValue: number;
    fanAlarmKey?: string;
    towers: [OldPlantExternalTower, OldPlantExternalTower, OldPlantExternalTower];
    alarmData: AlarmData;
    className?: string;
};

function PumpBlock({
                       tower,
                       alarmData,
                   }: {
    tower: OldPlantExternalTower;
    alarmData: AlarmData;
}) {
    const alarmKey = tower.alarmKey;
    const inAlarm = alarmKey ? hasAlarm(alarmKey, alarmData) : false;
    const isRunning = tower.value > 0 && !inAlarm;

    return (
        <div className="relative flex flex-col items-center gap-1">
            <img src={scrubberTowerImage} alt={tower.towerLabel} className={towerIconClass}/>
            <div className="panel-title-glow text-sm font-bold">{tower.towerLabel}</div>
            <div className="mt-1 flex flex-col items-center gap-1">
                <Settings
                    className={cn(
                        inAlarm ? 'text-red-600 animate-spin-slow' : 'text-sky-600',
                        isRunning && 'animate-spin-slow',
                    )}
                    size={26}
                />
                <div className="panel-title-glow text-sm font-bold">{tower.pumpLabel}</div>
                <div className="rounded bg-transparent px-2.5 py-1 font-mono text-sm font-black data-glow">
                    {formatMetricValue(tower.value)} A
                </div>
            </div>
        </div>
    );
}

export function OldPlantExternalEquipment({
                                              fanValue,
                                              fanAlarmKey,
                                              towers,
                                              alarmData,
                                              className,
                                          }: OldPlantExternalEquipmentProps) {
    const fanInAlarm = fanAlarmKey ? hasAlarm(fanAlarmKey, alarmData) : false;

    return (
        <div className={cn('relative min-h-0', className)}>
            <div className={panelClass}>
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 1}}>
                    <polyline
                        points="0,25% 5%,25% 5%,10% 15%,10% 15%,25% 25%,25% 25%,10% 35%,10% 35%,25% 45%,25% 45%,10% 55%,10% 55%,25% 65%,25% 65%,10% 75%,10% 75%,25% 85%,25% 85%,10% 95%,10% 95%,25% 100%,25%"
                        fill="none"
                        stroke="#fbcfe8"
                        strokeWidth="1.5"
                        opacity="0.55"
                    />
                    <polyline
                        points="18%,45% 25%,45% 25%,18% 37.5%,18%"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.9"
                    />
                    <polyline
                        points="42%,55% 50%,55% 50%,18% 62.5%,18%"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.9"
                    />
                    <polyline
                        points="67%,55% 75%,55% 75%,18% 87.5%,18%"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.9"
                    />
                    <polyline
                        points="92%,55% 100%,55%"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.9"
                    />
                    <line x1="37.5%" y1="75%" x2="87.5%" y2="75%" stroke="#38bdf8" strokeWidth="2" opacity="0.75"/>
                    <line x1="37.5%" y1="75%" x2="37.5%" y2="65%" stroke="#38bdf8" strokeWidth="2" opacity="0.75"/>
                    <line x1="62.5%" y1="75%" x2="62.5%" y2="65%" stroke="#38bdf8" strokeWidth="2" opacity="0.75"/>
                    <line x1="87.5%" y1="75%" x2="87.5%" y2="65%" stroke="#38bdf8" strokeWidth="2" opacity="0.75"/>
                </svg>

                <div className="relative z-10 grid h-full grid-cols-[0.95fr_1fr_1fr_1fr] items-center gap-3 px-3">
                    <div className="relative flex flex-col items-center gap-2 rounded-lg p-2 transition-all">
                        <img src={fanDrumImage} alt="风机" className={fanIconClass}/>
                        <div className="panel-title-glow text-sm font-bold">风机</div>
                        <div className={cn(equipmentValueClass, 'data-glow', fanInAlarm && 'text-red-400')}>
                            {formatMetricValue(fanValue)} A
                        </div>
                    </div>

                    <PumpBlock tower={towers[0]} alarmData={alarmData}/>
                    <PumpBlock tower={towers[1]} alarmData={alarmData}/>
                    <PumpBlock tower={towers[2]} alarmData={alarmData}/>
                </div>
            </div>
        </div>
    );
}
