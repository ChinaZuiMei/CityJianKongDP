import React from 'react';
import {AnimatePresence} from 'motion/react';
import {AlarmPanel, ScrollDashboard} from '../dashboard';
import {TankDataPanel} from '../dashboard/components/TankDataPanel';
import type {WorkshopRuntimeData} from './types';
import tankImage from '../../mingfanImg/罐子.png';

type WorkshopSevenTank = {
    id: string;
    pressure: string;
    temperature: string;
    current: string;
};

type WorkshopRegionHeader = {
    id: string;
    title: string;
    subtitle: string;
};

const tankGroups: WorkshopSevenTank[][] = [
    [
        {id: 'F0101A', pressure: '0.00 Mpa', temperature: '0.0°C', current: '0.0A'},
        {id: 'F0101F', pressure: '0.28 Mpa', temperature: '140.5°C', current: '0.0A'},
    ],
    [
        {id: 'F0101B', pressure: '-0.20 Mpa', temperature: '0.0°C', current: '0.0A'},
        {id: 'F0101G', pressure: '0.29 Mpa', temperature: '142.3°C', current: '9.4A'},
    ],
    [
        {id: 'F0101C', pressure: '-0.20 Mpa', temperature: '0.0°C', current: '0.0A'},
        {id: 'F0101H', pressure: '0.27 Mpa', temperature: '0.0°C', current: '0.0A'},
    ],
    [
        {id: 'F0101D', pressure: '0.28 Mpa', temperature: '133.0°C', current: '9.4A'},
        {id: 'F0101I', pressure: '0.28 Mpa', temperature: '145.9°C', current: '0.0A'},
    ],
    [
        {id: 'F0101E', pressure: '-0.20 Mpa', temperature: '0.0°C', current: '0.0A'},
        {id: 'F0101J', pressure: '-0.20 Mpa', temperature: '0.0°C', current: '0.0A'},
    ],
];

const zeroLevels = [0, 0, 0, 0];
const noLabels = ['无', '无', '无', '无'];
const noTemperatures: [number, number] = [0, 0];
const noTemperatureLabels: [string, string] = ['无', '无'];

export function WorkshopSevenView({
                                      scadaData,
                                      alarmData,
                                      activeAlarms,
                                      isAlarmPanelOpen,
                                      setIsAlarmPanelOpen,
                                      dashboardHeaderRegions,
                                      hideDashboardRegionHeader = true,
                                  }: WorkshopRuntimeData & {
    dashboardHeaderRegions?: WorkshopRegionHeader[];
    hideDashboardRegionHeader?: boolean;
}) {
    const [leftPanelCollapsed, setLeftPanelCollapsed] = React.useState(false);
    const [rightPanelCollapsed, setRightPanelCollapsed] = React.useState(false);
    const [activeTankGroupIndex, setActiveTankGroupIndex] = React.useState(0);
    const [tankGroupDirection, setTankGroupDirection] = React.useState(1);

    React.useEffect(() => {
        if (tankGroups.length <= 1) return undefined;

        const timer = window.setInterval(() => {
            setActiveTankGroupIndex((current) => {
                const next = current + tankGroupDirection;
                if (next >= tankGroups.length) {
                    setTankGroupDirection(-1);
                    return Math.max(tankGroups.length - 2, 0);
                }
                if (next < 0) {
                    setTankGroupDirection(1);
                    return 1;
                }
                return next;
            });
        }, 3000);

        return () => window.clearInterval(timer);
    }, [tankGroupDirection]);

    const reversedTankGroups = [...tankGroups].reverse();
    const tankTrackIndex = tankGroups.length - 1 - activeTankGroupIndex;

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
                    title="蒸汽流量液体硫酸铝"
                    subtitle="STEAM FLOW LIQUID ALUMINUM SULFATE"
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
                    hideRegionHeader={hideDashboardRegionHeader}
                    headerRegions={dashboardHeaderRegions}
                />
                <section className="workshop-seven-carousel" aria-label="车间7罐组轮播">
                    <div className="workshop-seven-carousel__viewport">
                        <div
                            className="workshop-seven-carousel__track"
                            style={{transform: `translateX(-${tankTrackIndex * 100}%)`}}
                        >
                            {reversedTankGroups.map((group) => (
                                <div key={group.map((tank) => tank.id).join('-')}
                                     className="workshop-seven-carousel__slide">
                                    <div className="workshop-seven-carousel__group">
                                        {group.map((tank) => (
                                            <article key={tank.id} className="workshop-seven-tank-card">
                                                <div className="workshop-seven-tank-card__id">{tank.id}</div>
                                                <img src={tankImage} alt={tank.id}
                                                     className="workshop-seven-tank-card__image" draggable="false"/>
                                                <div className="workshop-seven-tank-card__metrics">
                                                    <span>{tank.pressure}</span>
                                                    <span>{tank.temperature}</span>
                                                    <span>{tank.current}</span>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="workshop-carousel__dots workshop-carousel__dots--inline"
                         aria-label="液体硫酸铝罐组轮播切换">
                        {tankGroups.map((group, index) => (
                            <button
                                key={group.map((tank) => tank.id).join('-')}
                                type="button"
                                className={index === activeTankGroupIndex ? 'workshop-carousel__dot workshop-carousel__dot--active' : 'workshop-carousel__dot'}
                                onClick={() => setActiveTankGroupIndex(index)}
                                aria-label={`切换到第 ${index + 1} 组罐`}
                                aria-current={index === activeTankGroupIndex ? 'true' : undefined}
                            />
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
}
