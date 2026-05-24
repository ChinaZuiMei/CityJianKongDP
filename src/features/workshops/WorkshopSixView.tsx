import React from 'react';
import {AnimatePresence} from 'motion/react';
import {AlarmPanel, ScrollDashboard} from '../dashboard';
import {WorkshopSixLeftPanels, WorkshopSixRightPanels} from './workshop-six';
import {Tank} from '../dashboard/ui/SharedComponents';
import type {WorkshopRuntimeData} from './types';
import {formatMetricValue} from '../../utils/formatMetricValue';
import {cn} from '../../utils/cn';
import undergroundTankImage from '../../mingfanImg/地下罐子.png';
import reactorTankImage from '../../images/反应槽.png';

type LevelTank = {
    id: string;
    label: string;
    level: number;
    max: number;
    variant: 'cone' | 'storage' | 'underground';
};

type ValveStatus = {
    name: string;
    status: '开' | '关' | '空';
};

const regionHeaders = [
    {id: 'main', title: '主画面', subtitle: 'MAIN SCREEN', alarmRegionId: 'main' as const},
    {id: 'level-1-a', title: '液位1-区域1', subtitle: 'LEVEL 1 - AREA 1'},
    {id: 'level-1-b', title: '液位1-区域2', subtitle: 'LEVEL 1 - AREA 2'},
    {id: 'level-2-a', title: '液位2-区域1', subtitle: 'LEVEL 2 - AREA 1'},
    {id: 'level-2-b', title: '液位2-区域2', subtitle: 'LEVEL 2 - AREA 2'},
];

function toValveStatus(open: number, closed: number): '开' | '关' | '空' {
    if (open > 0 && closed <= 0) return '开';
    if (closed > 0 && open <= 0) return '关';
    return '空';
}

function UndergroundTank({label, level}: { label: string; level: number }) {
    return (
        <div className="workshop-six-underground-tank">
            <img src={undergroundTankImage} alt={label} className="workshop-six-underground-tank__image"
                 draggable="false"/>
            <div className="workshop-six-underground-tank__value">{formatMetricValue(level)} m</div>
            <div className="workshop-six-underground-tank__label">{label}</div>
        </div>
    );
}

function WorkshopSixLevelGroup({tanks}: { tanks: LevelTank[] }) {
    return (
        <div className="workshop-six-level-group">
            <div className="workshop-six-level-group__grid">
                {tanks.map((tank) => (
                    <article key={tank.id} className="workshop-six-tank-card">
                        {tank.variant === 'underground' ? (
                            <UndergroundTank label={tank.label} level={tank.level}/>
                        ) : (
                            <Tank
                                label={tank.label}
                                level={tank.level}
                                max={tank.max}
                                variant={tank.variant}
                                labelOffsetClassName="mt-8"
                            />
                        )}
                    </article>
                ))}
            </div>
        </div>
    );
}

function toOxygenValveStatus(open: number): '开' | '关' {
    return open > 0 ? '开' : '关';
}

type WorkshopSixKettleIndex = 1 | 2 | 3 | 4;

function buildWorkshopSixKettleValves(
    scadaData: WorkshopRuntimeData['scadaData'],
    kettle: WorkshopSixKettleIndex,
): ValveStatus[] {
    const fields = {
        1: {
            oxygen: scadaData.w6_kettle1_oxygen_open,
            feedOpen: scadaData.w6_kettle1_feed_open,
            feedClosed: scadaData.w6_kettle1_feed_closed,
            catalystOpen: scadaData.w6_kettle1_catalyst_open,
            catalystClosed: scadaData.w6_kettle1_catalyst_closed,
            linkOpen: scadaData.w6_kettle1_link_feed_open,
            linkClosed: scadaData.w6_kettle1_link_feed_closed,
            dischargeOpen: scadaData.w6_kettle1_discharge_open,
            dischargeClosed: scadaData.w6_kettle1_discharge_closed,
        },
        2: {
            oxygen: scadaData.w6_kettle2_oxygen_open,
            feedOpen: scadaData.w6_kettle2_feed_open,
            feedClosed: scadaData.w6_kettle2_feed_closed,
            catalystOpen: scadaData.w6_kettle2_catalyst_open,
            catalystClosed: scadaData.w6_kettle2_catalyst_closed,
            linkOpen: scadaData.w6_kettle2_link_feed_open,
            linkClosed: scadaData.w6_kettle2_link_feed_closed,
            dischargeOpen: scadaData.w6_kettle2_discharge_open,
            dischargeClosed: scadaData.w6_kettle2_discharge_closed,
        },
        3: {
            oxygen: scadaData.w6_kettle3_oxygen_open,
            feedOpen: scadaData.w6_kettle3_feed_open,
            feedClosed: scadaData.w6_kettle3_feed_closed,
            catalystOpen: scadaData.w6_kettle3_catalyst_open,
            catalystClosed: scadaData.w6_kettle3_catalyst_closed,
            linkOpen: scadaData.w6_kettle3_link_feed_open,
            linkClosed: scadaData.w6_kettle3_link_feed_closed,
            dischargeOpen: scadaData.w6_kettle3_discharge_open,
            dischargeClosed: scadaData.w6_kettle3_discharge_closed,
        },
        4: {
            oxygen: scadaData.w6_kettle4_oxygen_open,
            feedOpen: scadaData.w6_kettle4_feed_open,
            feedClosed: scadaData.w6_kettle4_feed_closed,
            catalystOpen: scadaData.w6_kettle4_catalyst_open,
            catalystClosed: scadaData.w6_kettle4_catalyst_closed,
            linkOpen: scadaData.w6_kettle4_link_feed_open,
            linkClosed: scadaData.w6_kettle4_link_feed_closed,
            dischargeOpen: scadaData.w6_kettle4_discharge_open,
            dischargeClosed: scadaData.w6_kettle4_discharge_closed,
        },
    }[kettle];

    return [
        {name: '进氧阀', status: toOxygenValveStatus(fields.oxygen)},
        {name: '进料阀', status: toValveStatus(fields.feedOpen, fields.feedClosed)},
        {name: '进催化剂阀', status: toValveStatus(fields.catalystOpen, fields.catalystClosed)},
        {name: '循环阀', status: toValveStatus(fields.linkOpen, fields.linkClosed)},
        {name: '出料阀', status: toValveStatus(fields.dischargeOpen, fields.dischargeClosed)},
    ];
}

function WorkshopSixMainValveRow({name, status}: { name: string; status: ValveStatus['status'] }) {
    const statusLabel = status === '空' ? '—' : status;

    return (
        <div className="workshop-six-main-valve">
            <span className="workshop-six-main-valve__name">{name}</span>
            <span
                className={cn(
                    'workshop-six-main-valve__status',
                    status === '开' && 'workshop-six-main-valve__status--open',
                    status === '关' && 'workshop-six-main-valve__status--closed',
                    status === '空' && 'workshop-six-main-valve__status--empty',
                )}
            >
                {statusLabel}
            </span>
        </div>
    );
}

function WorkshopSixMainTank({id, pressure, valves}: { id: string; pressure: number; valves: ValveStatus[] }) {
    return (
        <article className="workshop-six-main-tank">
            <div className="workshop-six-main-tank__id">{id}</div>
            <div className="workshop-six-main-tank__image-wrap">
                <img src={reactorTankImage} alt={id} className="workshop-six-main-tank__image" draggable="false"/>
            </div>
            <div className="workshop-six-main-tank__details">
                <div className="workshop-six-main-tank__pressure">{formatMetricValue(pressure)} Mpa</div>
                <div className="workshop-six-main-tank__valves">
                    {valves.map((row, index) => (
                        <div key={`${id}-${row.name}-${index}`} className="workshop-six-main-valve-slot">
                            <WorkshopSixMainValveRow name={row.name} status={row.status}/>
                        </div>
                    ))}
                </div>
            </div>
        </article>
    );
}

function WorkshopSixMainScreen({scadaData}: { scadaData: WorkshopRuntimeData['scadaData'] }) {
    const mainTanks = React.useMemo(() => ([
        {
            id: 'F0101A',
            pressure: scadaData.w6_kettle1_pressure,
            valves: buildWorkshopSixKettleValves(scadaData, 1),
        },
        {
            id: 'F0101B',
            pressure: scadaData.w6_kettle2_pressure,
            valves: buildWorkshopSixKettleValves(scadaData, 2),
        },
        {
            id: 'F0101C',
            pressure: scadaData.w6_kettle3_pressure,
            valves: buildWorkshopSixKettleValves(scadaData, 3),
        },
        {
            id: 'F0101D',
            pressure: scadaData.w6_kettle4_pressure,
            valves: buildWorkshopSixKettleValves(scadaData, 4),
        },
    ]), [scadaData]);

    return (
        <section className="workshop-six-main-screen" aria-label="聚合硫酸铁主画面">
            <div className="workshop-six-main-screen__tanks">
                {mainTanks.map((tank) => (
                    <div key={tank.id} className="workshop-six-main-screen__tank-slot">
                        <WorkshopSixMainTank id={tank.id} pressure={tank.pressure} valves={tank.valves}/>
                    </div>
                ))}
            </div>
        </section>
    );
}

function WorkshopSixBody({
                             activeRegionIndex,
                             onActiveRegionIndexChange,
                             scadaData,
                         }: {
    activeRegionIndex: number;
    onActiveRegionIndexChange: (index: number) => void;
    scadaData: WorkshopRuntimeData['scadaData'];
}) {
    const levelOneGroups = React.useMemo<LevelTank[][]>(() => ([
        [
            {id: 'sulfuric-1', label: '1# 硫酸罐', level: scadaData.w6_sulfuric1_level, max: 8, variant: 'cone'},
            {id: 'sulfuric-2', label: '2# 硫酸罐', level: scadaData.w6_sulfuric2_level, max: 8, variant: 'cone'},
            {id: 'sulfuric-3', label: '3# 硫酸罐', level: scadaData.w6_sulfuric3_level, max: 8, variant: 'cone'},
        ],
        [
            {id: 'sulfuric-4', label: '4# 硫酸罐', level: scadaData.w6_sulfuric4_level, max: 8, variant: 'cone'},
            {id: 'hcl-1', label: '1# 盐酸罐', level: scadaData.w6_hcl1_level, max: 8, variant: 'storage'},
            {id: 'hcl-2', label: '2# 盐酸罐', level: scadaData.w6_hcl2_level, max: 8, variant: 'storage'},
        ],
    ]), [scadaData]);

    const levelTwoGroups = React.useMemo<LevelTank[][]>(() => ([
        [
            {id: 'sulfuric-5', label: '5# 硫酸罐', level: scadaData.w6_sulfuric5_level, max: 8, variant: 'cone'},
            {id: 'sulfuric-6', label: '6# 硫酸罐', level: scadaData.w6_sulfuric6_level, max: 8, variant: 'cone'},
            {id: 'sulfuric-7', label: '7# 硫酸罐', level: scadaData.w6_sulfuric7_level, max: 8, variant: 'cone'},
        ],
        [
            {
                id: 'dilute-sulfuric',
                label: '稀硫酸罐',
                level: scadaData.w6_dilute_sulfuric_level,
                max: 8,
                variant: 'storage'
            },
            {
                id: 'underground-level',
                label: '地下罐',
                level: scadaData.w6_underground_level,
                max: 8,
                variant: 'underground'
            },
            {id: 'hcl-1-repeat', label: '1# 盐酸罐', level: scadaData.w6_hcl1_level, max: 8, variant: 'storage'},
        ],
    ]), [scadaData]);

    const slides = [
        {
            id: 'main',
            content: <div className="workshop-six-body__main"><WorkshopSixMainScreen scadaData={scadaData}/></div>
        },
        {id: 'level-1-a', content: <WorkshopSixLevelGroup tanks={levelOneGroups[0]}/>},
        {id: 'level-1-b', content: <WorkshopSixLevelGroup tanks={levelOneGroups[1]}/>},
        {id: 'level-2-a', content: <WorkshopSixLevelGroup tanks={levelTwoGroups[0]}/>},
        {id: 'level-2-b', content: <WorkshopSixLevelGroup tanks={levelTwoGroups[1]}/>},
    ];
    const reversedSlides = [...slides].reverse();
    const bodyTrackIndex = Math.max(0, slides.length - 1 - activeRegionIndex);

    return (
        <div className="workshop-six-body">
            <div className="workshop-six-body__track" style={{transform: `translateX(-${bodyTrackIndex * 100}%)`}}>
                {reversedSlides.map((slide) => (
                    <div key={slide.id} className="workshop-six-body__slide">
                        {slide.content}
                    </div>
                ))}
            </div>
            <div className="workshop-carousel__dots workshop-carousel__dots--bottom" aria-label="聚合硫酸铁轮播切换">
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

export function WorkshopSixView({
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
                className={leftPanelCollapsed ? 'w6-side-panel-toggle w6-side-panel-toggle--left w6-side-panel-toggle--collapsed' : 'w6-side-panel-toggle w6-side-panel-toggle--left'}
                onClick={() => setLeftPanelCollapsed((value) => !value)}
                aria-label={leftPanelCollapsed ? '展开左侧面板' : '收起左侧面板'}
            >
                {leftPanelCollapsed ? '▶' : '◀'}
            </button>
            <div
                className={leftPanelCollapsed ? 'w6-side-panel-column w6-side-panel-column--left w6-side-panel-column--collapsed-left' : 'w6-side-panel-column w6-side-panel-column--left'}>
                <WorkshopSixLeftPanels data={scadaData}/>
            </div>

            <button
                type="button"
                className={rightPanelCollapsed ? 'w6-side-panel-toggle w6-side-panel-toggle--right w6-side-panel-toggle--collapsed' : 'w6-side-panel-toggle w6-side-panel-toggle--right'}
                onClick={() => setRightPanelCollapsed((value) => !value)}
                aria-label={rightPanelCollapsed ? '展开右侧面板' : '收起右侧面板'}
            >
                {rightPanelCollapsed ? '◀' : '▶'}
            </button>
            <div
                className={rightPanelCollapsed ? 'w6-side-panel-column w6-side-panel-column--right w6-side-panel-column--collapsed-right' : 'w6-side-panel-column w6-side-panel-column--right'}>
                <WorkshopSixRightPanels data={scadaData}/>
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
                <WorkshopSixBody
                    activeRegionIndex={activeRegionIndex}
                    onActiveRegionIndexChange={setActiveRegionIndex}
                    scadaData={scadaData}
                />
            </main>
        </>
    );
}
