import React from 'react';
import {Settings} from 'lucide-react';
import {cn} from '../../../utils/cn';
import {formatMetricValue} from '../../../utils/formatMetricValue';
import {hasAlarm} from '../lib/alarmUtils';
import {AlarmData, ScadaData} from '../model/types';
import {OldPlantExternalEquipment} from '../components/OldPlantExternalEquipment';
import fanDrumImage from '../../../images/风机_滚筒.png';
import scrubberTowerImage from '../../../images/洗涤塔.png';
import centrifugeImage from '../../../images/img_5.png';

const equipmentValueClass = "rounded-md px-3.5 py-1.5 text-base font-black bg-transparent";
const panelClass = "relative h-full min-h-0 overflow-visible rounded-xl bg-transparent pb-2";
const fanIconClass = "h-28 w-28 object-contain";
const towerIconClass = "h-40 w-24 object-contain";
const centrifugeIconClass = "h-28 w-36 object-contain";

const OldPlantBlock = ({data, alarmData}: { data: ScadaData; alarmData: AlarmData }) => (
    <OldPlantExternalEquipment
        fanValue={data.old_fan_v}
        towers={[
            {towerLabel: '洗涤塔1', pumpLabel: '循环泵1', value: data.old_pump1_v, alarmKey: 'old_pump1'},
            {towerLabel: '洗涤塔2', pumpLabel: '循环泵2', value: data.old_pump2_v, alarmKey: 'old_pump2'},
            {towerLabel: '洗涤塔3', pumpLabel: '循环泵3', value: data.old_pump3_v, alarmKey: 'old_pump3'},
        ]}
        alarmData={alarmData}
    />
);

const DrumBlock = ({data, alarmData}: { data: ScadaData; alarmData: AlarmData }) => (
    <div className="relative min-h-0">
        <div className={panelClass}>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 1}}>
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
                <line x1="37.5%" y1="85%" x2="62.5%" y2="85%" stroke="#22d3ee" strokeWidth="2" opacity="0.75"/>
                <line x1="37.5%" y1="85%" x2="37.5%" y2="74%" stroke="#22d3ee" strokeWidth="2" opacity="0.75"/>
                <line x1="62.5%" y1="85%" x2="62.5%" y2="74%" stroke="#22d3ee" strokeWidth="2" opacity="0.75"/>
            </svg>

            <div className="relative z-10 grid h-full grid-cols-[0.95fr_1fr_1fr_0.92fr] items-center gap-3 px-3">
                {/* 风机 */}
                <div
                    className="relative flex flex-col items-center gap-2 rounded-lg p-2 transition-all"
                >
                    <img src={fanDrumImage} alt="风机" className={fanIconClass}/>
                    <div className="panel-title-glow-cyan text-sm font-bold">风机</div>
                    <div
                        className={cn(
                            equipmentValueClass,
                            "data-glow-cyan"
                        )}
                    >
                        {formatMetricValue(data.drum_fan_v)} A
                    </div>
                </div>

                {/* 洗涤塔1 + 循环泵1 */}
                <div className="relative flex flex-col items-center gap-1">
                    <img src={scrubberTowerImage} alt="洗涤塔" className={towerIconClass}/>
                    <div className="panel-title-glow-cyan text-sm font-bold">洗涤塔1</div>
                    <div className="mt-1 flex flex-col items-center gap-1">
                        <Settings
                            className={cn(hasAlarm('drum_pump1', alarmData) ? "text-red-600 animate-spin-slow" : "text-cyan-600", data.drum_pump1_v > 0 && !hasAlarm('drum_pump1', alarmData) && "animate-spin-slow")}
                            size={26}/>
                        <div className="panel-title-glow-cyan text-sm font-bold">循环泵1</div>
                        <div
                            className="rounded bg-transparent px-2.5 py-1 font-mono text-sm font-black data-glow-cyan"
                        >
                            {formatMetricValue(data.drum_pump1_v)} A
                        </div>
                    </div>
                </div>

                {/* 洗涤塔2 + 循环泵2 */}
                <div className="relative flex flex-col items-center gap-1">
                    <img src={scrubberTowerImage} alt="洗涤塔" className={towerIconClass}/>
                    <div className="panel-title-glow-cyan text-sm font-bold">洗涤塔2</div>
                    <div className="mt-1 flex flex-col items-center gap-1">
                        <Settings
                            className={cn(hasAlarm('drum_pump2', alarmData) ? "text-red-600 animate-spin-slow" : "text-cyan-600", data.drum_pump2_v > 0 && !hasAlarm('drum_pump2', alarmData) && "animate-spin-slow")}
                            size={26}/>
                        <div className="panel-title-glow-cyan text-sm font-bold">循环泵2</div>
                        <div
                            className="rounded bg-transparent px-2.5 py-1 font-mono text-sm font-black data-glow-cyan"
                        >
                            {formatMetricValue(data.drum_pump2_v)} A
                        </div>
                    </div>
                </div>

                {/* 离心机 */}
                <div
                    className="relative flex flex-col items-center gap-2 rounded-lg p-2 transition-all"
                >
                    <img
                        src={centrifugeImage}
                        alt="离心机"
                        className={cn(
                            centrifugeIconClass,
                            data.drum_centrifuge_v > 0 && !hasAlarm('old_centrifuge', alarmData) && "animate-bounce"
                        )}
                    />
                    <div className="panel-title-glow text-sm font-bold">离心机</div>
                    <div
                        className={cn(
                            equipmentValueClass,
                            "data-glow"
                        )}
                    >
                        {formatMetricValue(data.drum_centrifuge_v)} A
                    </div>
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
                <OldPlantBlock data={data} alarmData={alarmData}/>
            </div>
        ) : section === 'drum' ? (
            <div className="h-full px-4 py-3 overflow-visible">
                <DrumBlock data={data} alarmData={alarmData}/>
            </div>
        ) : (
            <div className={layout === 'sideBySide'
                ? "grid h-full grid-cols-2 gap-4 px-4 py-3 overflow-visible"
                : "grid h-full grid-rows-2 gap-2.5 px-4 py-3 overflow-visible"}
            >
                <OldPlantBlock data={data} alarmData={alarmData}/>
                <DrumBlock data={data} alarmData={alarmData}/>
            </div>
        )}
    </div>
);
