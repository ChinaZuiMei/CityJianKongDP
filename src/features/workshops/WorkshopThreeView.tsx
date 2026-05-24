import React from 'react';
import {AnimatePresence} from 'motion/react';
import {AlarmPanel, ScrollDashboard} from '../dashboard';
import {WorkshopThreeLeftPanels, WorkshopThreeRightPanels} from './workshop-three';
import type {WorkshopRuntimeData} from './types';
import tankImage from '../../mingfanImg/罐子.png';
import {
    OldPlantExternalEquipment,
    type OldPlantExternalTower,
} from '../dashboard/components/OldPlantExternalEquipment';
import type {AlarmData, ScadaData} from '../dashboard/model/types';
import {formatMetricValue} from '../../utils/formatMetricValue';
import {Tank} from '../dashboard/ui/SharedComponents';
import {hasAlarm} from '../dashboard/lib/alarmUtils';

type UndergroundTankItem = {
    id: string;
    label: string;
    temp: number;
    alarmKey: string;
};

type GlassTankItem = {
    id: string;
    label: string;
    temp: number;
    current: number;
    alarmKey: string;
};

type SteelTankItem = {
    id: string;
    current: string;
    temperature: string;
    pressure: string;
};

const regionHeaders = [
    {id: 'underground', title: '地下斧', subtitle: 'UNDERGROUND REACTOR', alarmRegionId: 'main' as const},
    {id: 'steel', title: '钢锅斧', subtitle: 'STEEL REACTOR'},
    {id: 'glass', title: '玻璃钢斧', subtitle: 'FRP REACTOR'},
    {id: 'enamel-1', title: '搪瓷斧-区域1', subtitle: 'ENAMEL REACTOR - AREA 1'},
    {id: 'enamel-2', title: '搪瓷斧-区域2', subtitle: 'ENAMEL REACTOR - AREA 2'},
    {id: 'external-1', title: '外部设备-区域1', subtitle: 'EXTERNAL EQUIPMENT - AREA 1'},
    {id: 'external-2', title: '外部设备-区域2', subtitle: 'EXTERNAL EQUIPMENT - AREA 2'},
];

function buildOldPlantAreaOneConfig(data: ScadaData): {
    fanValue: number;
    towers: [OldPlantExternalTower, OldPlantExternalTower, OldPlantExternalTower];
} {
    return {
        fanValue: data.w3_poly_tail_fan_v,
        towers: [
            {
                towerLabel: '洗涤塔1',
                pumpLabel: '循环泵1',
                value: data.w3_poly_tail_pump1_v,
                alarmKey: 'w3_poly_tail_pump1'
            },
            {
                towerLabel: '洗涤塔2',
                pumpLabel: '循环泵2',
                value: data.w3_poly_tail_pump2_v,
                alarmKey: 'w3_poly_tail_pump2'
            },
            {towerLabel: '洗涤塔3', pumpLabel: '备用泵', value: 0, alarmKey: undefined},
        ],
    };
}

function buildOldPlantAreaTwoConfig(data: ScadaData): {
    fanValue: number;
    towers: [OldPlantExternalTower, OldPlantExternalTower, OldPlantExternalTower];
} {
    return {
        fanValue: data.w3_lowiron_tail_fan_v,
        towers: [
            {
                towerLabel: '洗涤塔4',
                pumpLabel: '循环泵4',
                value: data.w3_lowiron_tail_pump1_v,
                alarmKey: 'w3_lowiron_tail_pump1'
            },
            {
                towerLabel: '洗涤塔5',
                pumpLabel: '循环泵5',
                value: data.w3_lowiron_tail_pump2_v,
                alarmKey: 'w3_lowiron_tail_pump2'
            },
            {towerLabel: '洗涤塔6', pumpLabel: '备用泵', value: 0, alarmKey: undefined},
        ],
    };
}

function buildUndergroundReactors(data: ScadaData): UndergroundTankItem[] {
    return [
        {id: 'UD3001A', label: '1# 反应槽', temp: data.w3_underground1_temp, alarmKey: 'w3_underground1'},
        {id: 'UD3001B', label: '2# 反应槽', temp: data.w3_underground2_temp, alarmKey: 'w3_underground2'},
        {id: 'UD3001C', label: '3# 反应槽', temp: data.w3_underground3_temp, alarmKey: 'w3_underground3'},
    ];
}

function buildSteelReactors(data: ScadaData): SteelTankItem[] {
    return [
        {
            id: 'F0201A',
            current: `${formatMetricValue(data.w3_iron1_current)} A`,
            temperature: `${formatMetricValue(data.w3_iron1_temp)}°C`,
            pressure: `${formatMetricValue(data.w3_iron1_pressure)} Mpa`,
        },
        {
            id: 'F0201B',
            current: `${formatMetricValue(data.w3_iron2_current)} A`,
            temperature: `${formatMetricValue(data.w3_iron2_temp)}°C`,
            pressure: `${formatMetricValue(data.w3_iron2_pressure)} Mpa`,
        },
    ];
}

function buildGlassSteelReactors(data: ScadaData): GlassTankItem[] {
    return [
        {
            id: 'FR3001A',
            label: '1# 反应槽',
            current: data.w3_glass1_current,
            temp: data.w3_glass1_temp,
            alarmKey: 'w3_glass1'
        },
        {
            id: 'FR3001B',
            label: '2# 反应槽',
            current: data.w3_glass2_current,
            temp: data.w3_glass2_temp,
            alarmKey: 'w3_glass2'
        },
        {
            id: 'FR3001C',
            label: '3# 反应槽',
            current: data.w3_glass3_current,
            temp: data.w3_glass3_temp,
            alarmKey: 'w3_glass3'
        },
        {
            id: 'FR3001D',
            label: '4# 反应槽',
            current: data.w3_glass4_current,
            temp: data.w3_glass4_temp,
            alarmKey: 'w3_glass4'
        },
        {
            id: 'FR3001E',
            label: '5# 反应槽',
            current: data.w3_glass5_current,
            temp: data.w3_glass5_temp,
            alarmKey: 'w3_glass5'
        },
    ];
}

function buildEnamelReactors(data: ScadaData): SteelTankItem[] {
    return [
        {
            id: 'F0401A',
            current: `${formatMetricValue(data.w3_enamel1_current)} A`,
            temperature: `${formatMetricValue(data.w3_enamel1_temp)}°C`,
            pressure: `${formatMetricValue(data.w3_enamel1_pressure)} Mpa`
        },
        {
            id: 'F0401B',
            current: `${formatMetricValue(data.w3_enamel2_current)} A`,
            temperature: `${formatMetricValue(data.w3_enamel2_temp)}°C`,
            pressure: `${formatMetricValue(data.w3_enamel2_pressure)} Mpa`
        },
        {
            id: 'F0401C',
            current: `${formatMetricValue(data.w3_enamel3_current)} A`,
            temperature: `${formatMetricValue(data.w3_enamel3_temp)}°C`,
            pressure: `${formatMetricValue(data.w3_enamel3_pressure)} Mpa`
        },
        {
            id: 'F0401D',
            current: `${formatMetricValue(data.w3_enamel4_current)} A`,
            temperature: `${formatMetricValue(data.w3_enamel4_temp)}°C`,
            pressure: `${formatMetricValue(data.w3_enamel4_pressure)} Mpa`
        },
        {
            id: 'F0401E',
            current: `${formatMetricValue(data.w3_enamel5_current)} A`,
            temperature: `${formatMetricValue(data.w3_enamel5_temp)}°C`,
            pressure: `${formatMetricValue(data.w3_enamel5_pressure)} Mpa`
        },
        {
            id: 'F0401F',
            current: `${formatMetricValue(data.w3_enamel6_current)} A`,
            temperature: `${formatMetricValue(data.w3_enamel6_temp)}°C`,
            pressure: `${formatMetricValue(data.w3_enamel6_pressure)} Mpa`
        },
    ];
}

function UndergroundSlide({tanks, alarmData}: { tanks: UndergroundTankItem[]; alarmData: AlarmData }) {
    return (
        <section className="workshop-three-reactor-slide workshop-three-reactor-slide--underground"
                 aria-label="地下斧区域">
            <div className="workshop-three-reactor-column workshop-three-reactor-column--underground">
                {tanks.map((tank) => (
                    <div key={tank.id} className="workshop-three-underground-reactor-slot">
                        <Tank
                            label={tank.label}
                            temp={tank.temp}
                            variant="reactor"
                            showLevel={false}
                            hasAlarm={hasAlarm(tank.alarmKey, alarmData)}
                            reactorSizeClassName="h-[15rem]"
                            reactorBaselineClassName="-translate-y-[64px]"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}

function GlassSlide({tanks, alarmData}: { tanks: GlassTankItem[]; alarmData: AlarmData }) {
    return (
        <section className="workshop-three-reactor-slide workshop-three-reactor-slide--glass" aria-label="玻璃钢斧区域">
            <div className="workshop-three-reactor-column workshop-three-reactor-column--glass">
                {tanks.map((tank) => (
                    <div key={tank.id} className="workshop-three-glass-reactor-slot">
                        <Tank
                            label={tank.label}
                            temp={tank.temp}
                            current={tank.current}
                            variant="reactor"
                            showLevel={false}
                            reactorFooterLayout="stacked"
                            hasAlarm={hasAlarm(tank.alarmKey, alarmData)}
                            reactorSizeClassName="h-[12.5rem]"
                            reactorBaselineClassName="-translate-y-[52px]"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}

function WorkshopThreeSteelTankCard({
                                        id,
                                        current,
                                        temperature,
                                        pressure,
                                    }: SteelTankItem) {
    return (
        <article className="workshop-three-steel-card">
            <div className="workshop-three-steel-card__visual">
                <img src={tankImage} alt={id} className="workshop-three-steel-card__image" draggable="false"/>
                <div className="workshop-three-steel-card__code">{id}</div>
            </div>
            <div className="workshop-three-steel-card__metrics">
                <div className="workshop-three-steel-card__metric">{current}</div>
                <div className="workshop-three-steel-card__metric">{temperature}</div>
                <div className="workshop-three-steel-card__metric">{pressure}</div>
            </div>
        </article>
    );
}

function SteelSlide({tanks}: { tanks: SteelTankItem[] }) {
    return (
        <section className="workshop-three-steel-slide" aria-label="钢锅斧区域">
            <div className="workshop-three-steel-slide__tank-row">
                {tanks.map((tank) => (
                    <div key={tank.id} className="workshop-three-steel-slide__tank-slot">
                        <WorkshopThreeSteelTankCard {...tank} />
                    </div>
                ))}
            </div>
        </section>
    );
}

function EnamelSlide({tanks}: { tanks: SteelTankItem[] }) {
    return (
        <section className="workshop-three-enamel-slide" aria-label="搪瓷釜区域">
            <div className="workshop-three-enamel-grid">
                {tanks.map((tank) => (
                    <div key={tank.id} className="workshop-three-enamel-grid__cell">
                        <WorkshopThreeSteelTankCard {...tank} />
                    </div>
                ))}
            </div>
        </section>
    );
}

function ExternalOldPlantSlide({
                                   fanValue,
                                   towers,
                                   alarmData,
                                   fanAlarmKey,
                               }: {
    fanValue: number;
    towers: [OldPlantExternalTower, OldPlantExternalTower, OldPlantExternalTower];
    alarmData: AlarmData;
    fanAlarmKey?: string;
}) {
    return (
        <section className="workshop-three-external-slide" aria-label="外部设备区域">
            <div className="workshop-three-external-slide__content">
                <OldPlantExternalEquipment fanValue={fanValue} fanAlarmKey={fanAlarmKey} towers={towers}
                                           alarmData={alarmData}/>
            </div>
        </section>
    );
}

function WorkshopThreeBody({
                               activeRegionIndex,
                               onActiveRegionIndexChange,
                               scadaData,
                               alarmData,
                           }: {
    activeRegionIndex: number;
    onActiveRegionIndexChange: (index: number) => void;
    scadaData: ScadaData;
    alarmData: AlarmData;
}) {
    const externalAreaOne = buildOldPlantAreaOneConfig(scadaData);
    const externalAreaTwo = buildOldPlantAreaTwoConfig(scadaData);
    const undergroundReactors = buildUndergroundReactors(scadaData);
    const steelReactors = buildSteelReactors(scadaData);
    const glassSteelReactors = buildGlassSteelReactors(scadaData);
    const enamelReactors = buildEnamelReactors(scadaData);
    const slides = [
        {id: 'underground', content: <UndergroundSlide tanks={undergroundReactors} alarmData={alarmData}/>},
        {id: 'steel', content: <SteelSlide tanks={steelReactors}/>},
        {id: 'glass', content: <GlassSlide tanks={glassSteelReactors} alarmData={alarmData}/>},
        {id: 'enamel-1', content: <EnamelSlide tanks={enamelReactors.slice(0, 3)}/>},
        {id: 'enamel-2', content: <EnamelSlide tanks={enamelReactors.slice(3, 6)}/>},
        {
            id: 'external-1',
            content: (
                <ExternalOldPlantSlide
                    fanValue={externalAreaOne.fanValue}
                    fanAlarmKey="w3_poly_tail_fan"
                    towers={externalAreaOne.towers}
                    alarmData={alarmData}
                />
            ),
        },
        {
            id: 'external-2',
            content: (
                <ExternalOldPlantSlide
                    fanValue={externalAreaTwo.fanValue}
                    fanAlarmKey="w3_lowiron_tail_fan"
                    towers={externalAreaTwo.towers}
                    alarmData={alarmData}
                />
            ),
        },
    ];
    const reversedSlides = [...slides].reverse();
    const bodyTrackIndex = Math.max(0, slides.length - 1 - activeRegionIndex);

    return (
        <div className="workshop-three-body">
            <div className="workshop-three-body__track" style={{transform: `translateX(-${bodyTrackIndex * 100}%)`}}>
                {reversedSlides.map((slide) => (
                    <div key={slide.id} className="workshop-three-body__slide">
                        {slide.content}
                    </div>
                ))}
            </div>
            <div className="workshop-carousel__dots workshop-carousel__dots--bottom" aria-label="新聚铝反应轮播切换">
                {slides.map((slide, index) => (
                    <button
                        key={slide.id}
                        type="button"
                        className={index === activeRegionIndex ? 'workshop-carousel__dot workshop-carousel__dot--active' : 'workshop-carousel__dot'}
                        onClick={() => onActiveRegionIndexChange(index)}
                        aria-label={`切换到${regionHeaders[index]?.title ?? `第 ${index + 1} 页`}`}
                        aria-current={index === activeRegionIndex ? 'true' : undefined}
                    />
                ))}
            </div>
        </div>
    );
}

export function WorkshopThreeView({
                                      scadaData,
                                      alarmData,
                                      activeAlarms,
                                      isAlarmPanelOpen,
                                      setIsAlarmPanelOpen,
                                  }: WorkshopRuntimeData) {
    const [leftPanelCollapsed, setLeftPanelCollapsed] = React.useState(false);
    const [rightPanelCollapsed, setRightPanelCollapsed] = React.useState(false);
    const [activeRegionIndex, setActiveRegionIndex] = React.useState(0);

    return (
        <>
            <AnimatePresence>
                <AlarmPanel
                    alarms={activeAlarms}
                    alarmData={alarmData}
                    isOpen={isAlarmPanelOpen}
                    onClose={() => setIsAlarmPanelOpen(false)}
                />
            </AnimatePresence>

            <button
                type="button"
                className={leftPanelCollapsed ? 'w3-side-panel-toggle w3-side-panel-toggle--left w3-side-panel-toggle--collapsed' : 'w3-side-panel-toggle w3-side-panel-toggle--left'}
                onClick={() => setLeftPanelCollapsed((value) => !value)}
                aria-label={leftPanelCollapsed ? '展开左侧面板' : '收起左侧面板'}
            >
                {leftPanelCollapsed ? '▶' : '◀'}
            </button>
            <div
                className={leftPanelCollapsed ? 'w3-side-panel-column w3-side-panel-column--left w3-side-panel-column--collapsed-left' : 'w3-side-panel-column w3-side-panel-column--left'}>
                <WorkshopThreeLeftPanels data={scadaData}/>
            </div>

            <button
                type="button"
                className={rightPanelCollapsed ? 'w3-side-panel-toggle w3-side-panel-toggle--right w3-side-panel-toggle--collapsed' : 'w3-side-panel-toggle w3-side-panel-toggle--right'}
                onClick={() => setRightPanelCollapsed((value) => !value)}
                aria-label={rightPanelCollapsed ? '展开右侧面板' : '收起右侧面板'}
            >
                {rightPanelCollapsed ? '◀' : '▶'}
            </button>
            <div
                className={rightPanelCollapsed ? 'w3-side-panel-column w3-side-panel-column--right w3-side-panel-column--collapsed-right' : 'w3-side-panel-column w3-side-panel-column--right'}>
                <WorkshopThreeRightPanels data={scadaData}/>
            </div>

            <main className="relative z-10 flex-1 overflow-hidden bg-transparent">
                <ScrollDashboard
                    data={scadaData}
                    alarmData={alarmData}
                    hideRegionBody
                    headerRegions={regionHeaders}
                    activeRegionIndex={activeRegionIndex}
                    onActiveRegionIndexChange={setActiveRegionIndex}
                />
                <WorkshopThreeBody
                    activeRegionIndex={activeRegionIndex}
                    onActiveRegionIndexChange={setActiveRegionIndex}
                    scadaData={scadaData}
                    alarmData={alarmData}
                />
            </main>
        </>
    );
}
