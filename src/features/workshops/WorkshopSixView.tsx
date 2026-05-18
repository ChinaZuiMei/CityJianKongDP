import React from 'react';
import {AnimatePresence} from 'motion/react';
import {AlarmPanel, ScrollDashboard} from '../dashboard';
import {TankDataPanel} from '../dashboard/components/TankDataPanel';
import {Tank} from '../dashboard/ui/SharedComponents';
import type {WorkshopRuntimeData} from './types';
import undergroundTankImage from '../../mingfanImg/地下罐子.png';
import reactorTankImage from '../../images/反应槽.png';

type LevelTank = {
    id: string;
    label: string;
    level: number;
    max: number;
    variant: 'cone' | 'storage' | 'underground';
};

const zeroLevels = [0, 0, 0, 0];
const noLabels = ['无', '无', '无', '无'];
const noTemperatures: [number, number] = [0, 0];
const noTemperatureLabels: [string, string] = ['无', '无'];

const mainTanks = [
    {id: 'F0101A', pressure: '0.00 Mpa'},
    {id: 'F0101B', pressure: '-0.00 Mpa'},
    {id: 'F0101C', pressure: '-0.00 Mpa'},
    {id: 'F0101D', pressure: '-0.00 Mpa'},
];

const mainValveRows = [
    {name: '催化剂阀', status: '关'},
    {name: '催化剂阀', status: '关'},
    {name: '进氧阀', status: '关'},
    {name: '进料阀', status: '关'},
    {name: '循环阀', status: '开'},
    {name: '出料阀', status: '空'},
];

const regionHeaders = [
    {id: 'main', title: '主画面', subtitle: 'MAIN SCREEN', alarmRegionId: 'main' as const},
    {id: 'level-1-a', title: '液位1-区域1', subtitle: 'LEVEL 1 - AREA 1'},
    {id: 'level-1-b', title: '液位1-区域2', subtitle: 'LEVEL 1 - AREA 2'},
    {id: 'level-2-a', title: '液位2-区域1', subtitle: 'LEVEL 2 - AREA 1'},
    {id: 'level-2-b', title: '液位2-区域2', subtitle: 'LEVEL 2 - AREA 2'},
];

const levelOneGroups: LevelTank[][] = [
    [
        {id: 'sulfuric-1', label: '1# 硫酸罐', level: 4.61, max: 8, variant: 'cone'},
        {id: 'sulfuric-2', label: '2# 硫酸罐', level: 5.01, max: 8, variant: 'cone'},
        {id: 'sulfuric-3', label: '3# 硫酸罐', level: 2.47, max: 8, variant: 'cone'},
    ],
    [
        {id: 'sulfuric-4', label: '4# 硫酸罐', level: 3.30, max: 8, variant: 'cone'},
        {id: 'hcl-1', label: '1# 盐酸罐', level: 7.86, max: 8, variant: 'storage'},
        {id: 'hcl-2', label: '2# 盐酸罐', level: 2.26, max: 8, variant: 'storage'},
    ],
];

const levelTwoGroups: LevelTank[][] = [
    [
        {id: 'sulfuric-3-level-2', label: '3# 硫酸罐', level: 1.13, max: 8, variant: 'cone'},
        {id: 'sulfuric-4-level-2', label: '4# 硫酸罐', level: 0.66, max: 8, variant: 'cone'},
        {id: 'sulfuric-5-level-2', label: '5# 硫酸罐', level: 1.50, max: 8, variant: 'cone'},
    ],
    [
        {id: 'sulfuric-6-level-2', label: '6# 硫酸罐', level: 2.11, max: 8, variant: 'cone'},
        {id: 'sulfuric-7-level-2', label: '7# 硫酸罐', level: 5.03, max: 8, variant: 'cone'},
        {id: 'underground-level-2', label: '地下罐', level: 1.38, max: 8, variant: 'underground'},
    ],
];

function UndergroundTank({label, level}: { label: string; level: number }) {
    return (
        <div className="workshop-six-underground-tank">
            <img src={undergroundTankImage} alt={label} className="workshop-six-underground-tank__image"
                 draggable="false"/>
            <div className="workshop-six-underground-tank__value">{level.toFixed(2)} m</div>
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

function WorkshopSixMainTank({id, pressure}: { id: string; pressure: string }) {
    return (
        <article className="workshop-six-main-tank">
            <div className="workshop-six-main-tank__id">{id}</div>
            <div className="workshop-six-main-tank__image-wrap">
                <img src={reactorTankImage} alt={id} className="workshop-six-main-tank__image" draggable="false"/>
            </div>
            <div className="workshop-six-main-tank__details">
                <div className="workshop-six-main-tank__pressure">{pressure}</div>
                <div className="workshop-six-main-tank__valves">
                    {mainValveRows.map((row, index) => (
                        <div key={`${id}-${row.name}-${index}`} className="workshop-six-main-valve">
                            <span className="workshop-six-main-valve__name">{row.name}</span>
                            <span
                                className={
                                    row.status === '开'
                                        ? 'workshop-six-main-valve__status workshop-six-main-valve__status--open'
                                        : row.status === '关'
                                            ? 'workshop-six-main-valve__status workshop-six-main-valve__status--closed'
                                            : 'workshop-six-main-valve__status workshop-six-main-valve__status--empty'
                                }
                            >
              {row.status}
            </span>
                        </div>
                    ))}
                </div>
            </div>
        </article>
    );
}

function WorkshopSixMainScreen() {
    return (
        <section className="workshop-six-main-screen" aria-label="聚合硫酸铁主画面">
            <div className="workshop-six-main-pipes" aria-hidden="true">
                <span className="workshop-six-main-pipes__line workshop-six-main-pipes__line--oxygen"/>
                <span className="workshop-six-main-pipes__line workshop-six-main-pipes__line--catalyst"/>
                <span className="workshop-six-main-pipes__line workshop-six-main-pipes__line--feed"/>
                <span className="workshop-six-main-pipes__line workshop-six-main-pipes__line--return"/>
            </div>
            <div className="workshop-six-main-screen__tanks">
                {mainTanks.map((tank) => (
                    <div key={tank.id} className="workshop-six-main-screen__tank-slot">
                        <WorkshopSixMainTank id={tank.id} pressure={tank.pressure}/>
                    </div>
                ))}
            </div>
            <aside className="workshop-six-main-screen__metrics">
                <div className="workshop-six-main-metric">
                    <span className="workshop-six-main-metric__label">液氨温度</span>
                    <span className="workshop-six-main-metric__value">35.7°C</span>
                </div>
                <div className="workshop-six-main-metric">
                    <span className="workshop-six-main-metric__label">稀硫酸液位</span>
                    <span className="workshop-six-main-metric__value">3.38 m</span>
                </div>
            </aside>
        </section>
    );
}

function WorkshopSixBody({
                             activeRegionIndex,
                             onActiveRegionIndexChange,
                         }: {
    activeRegionIndex: number;
    onActiveRegionIndexChange: (index: number) => void;
}) {
    const slides = [
        {
            id: 'main',
            content: (
                <div className="workshop-six-body__main">
                    <WorkshopSixMainScreen/>
                </div>
            ),
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
            <div
                className="workshop-six-body__track"
                style={{transform: `translateX(-${bodyTrackIndex * 100}%)`}}
            >
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
                className={leftPanelCollapsed ? 'side-panel-toggle side-panel-toggle--left side-panel-toggle--collapsed' : 'side-panel-toggle side-panel-toggle--left'}
                onClick={() => setLeftPanelCollapsed((value) => !value)}
                aria-label={leftPanelCollapsed ? '展开左侧面板' : '收起左侧面板'}
            >
                {leftPanelCollapsed ? '▶' : '◀'}
            </button>
            <div
                className={leftPanelCollapsed ? 'tank-data-column tank-data-column--left tank-data-column--collapsed-left' : 'tank-data-column tank-data-column--left'}>
                <TankDataPanel
                    data={scadaData}
                    title="蒸汽流量聚合硫酸铁"
                    subtitle="STEAM FLOW POLYMERIC FERRIC SULFATE"
                    mode="flow"
                    flowVariantOverride="acid"
                    flowValues={{instant: 0, total: 93789}}
                    hideFlowName
                    embedded
                />
                <TankDataPanel
                    data={scadaData}
                    position="left"
                    title="罐区液位面板"
                    subtitle="TANK LEVEL PANEL"
                    mode="level"
                    levelLabels={noLabels}
                    levelValues={zeroLevels}
                    embedded
                />
                <TankDataPanel
                    data={scadaData}
                    position="left"
                    title="装车可视化面板"
                    subtitle="LOADING VISUALIZATION PANEL"
                    mode="loading"
                    embedded
                />
            </div>

            <button
                type="button"
                className={rightPanelCollapsed ? 'side-panel-toggle side-panel-toggle--right side-panel-toggle--collapsed' : 'side-panel-toggle side-panel-toggle--right'}
                onClick={() => setRightPanelCollapsed((value) => !value)}
                aria-label={rightPanelCollapsed ? '展开右侧面板' : '收起右侧面板'}
            >
                {rightPanelCollapsed ? '◀' : '▶'}
            </button>
            <div
                className={rightPanelCollapsed ? 'tank-data-column tank-data-column--right tank-data-column--collapsed-right' : 'tank-data-column tank-data-column--right'}>
                <TankDataPanel
                    data={scadaData}
                    position="right"
                    title="主画面可视化面板"
                    subtitle="MAIN SCREEN VISUALIZATION"
                    mode="temperature"
                    temperatureLabels={noTemperatureLabels}
                    temperatureValues={noTemperatures}
                    embedded
                />
                <TankDataPanel
                    data={scadaData}
                    position="right"
                    title="外部设备可视化面板"
                    subtitle="EXTERNAL EQUIPMENT PANEL"
                    mode="external"
                    externalLabels={noLabels}
                    externalValues={zeroLevels}
                    externalMeta={['无', '无']}
                    disableExternalCarousel
                    embedded
                />
                <TankDataPanel
                    data={scadaData}
                    position="right"
                    title="装车可视化面板"
                    subtitle="LOADING VISUALIZATION PANEL"
                    mode="loading"
                    embedded
                />
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
                <WorkshopSixBody activeRegionIndex={activeRegionIndex}
                                 onActiveRegionIndexChange={setActiveRegionIndex}/>
            </main>
        </>
    );
}
