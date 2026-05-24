import React from 'react';
import {AnimatePresence} from 'motion/react';
import {AlarmPanel, ScrollDashboard} from '../dashboard';
import {WorkshopSevenLeftPanels, WorkshopSevenRightPanels} from './workshop-seven';
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
                className={leftPanelCollapsed ? 'w7-side-panel-toggle w7-side-panel-toggle--left w7-side-panel-toggle--collapsed' : 'w7-side-panel-toggle w7-side-panel-toggle--left'}
                onClick={() => setLeftPanelCollapsed((value) => !value)}
                aria-label={leftPanelCollapsed ? '展开左侧面板' : '收起左侧面板'}
            >
                {leftPanelCollapsed ? '▶' : '◀'}
            </button>
            <div
                className={leftPanelCollapsed ? 'w7-side-panel-column w7-side-panel-column--left w7-side-panel-column--collapsed-left' : 'w7-side-panel-column w7-side-panel-column--left'}>
                <WorkshopSevenLeftPanels data={scadaData}/>
            </div>

            <button
                type="button"
                className={rightPanelCollapsed ? 'w7-side-panel-toggle w7-side-panel-toggle--right w7-side-panel-toggle--collapsed' : 'w7-side-panel-toggle w7-side-panel-toggle--right'}
                onClick={() => setRightPanelCollapsed((value) => !value)}
                aria-label={rightPanelCollapsed ? '展开右侧面板' : '收起右侧面板'}
            >
                {rightPanelCollapsed ? '◀' : '▶'}
            </button>
            <div
                className={rightPanelCollapsed ? 'w7-side-panel-column w7-side-panel-column--right w7-side-panel-column--collapsed-right' : 'w7-side-panel-column w7-side-panel-column--right'}>
                <WorkshopSevenRightPanels data={scadaData}/>
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
