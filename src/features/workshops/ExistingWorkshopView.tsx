import React from 'react';
import {AnimatePresence} from 'motion/react';
import {
    AlarmPanel,
    ScrollDashboard,
    SidePanelPreview,
    shouldEnableSidePanelPreview,
} from '../dashboard';
import {WorkshopOneLeftPanels, WorkshopOneRightPanels} from './workshop-one';
import type {WorkshopRuntimeData} from './types';

export function ExistingWorkshopView({
                                         scadaData,
                                         mqttConnected,
                                         alarmData,
                                         activeAlarms,
                                         isAlarmPanelOpen,
                                         setIsAlarmPanelOpen,
                                     }: WorkshopRuntimeData) {
    const [leftPanelCollapsed, setLeftPanelCollapsed] = React.useState(false);
    const [rightPanelCollapsed, setRightPanelCollapsed] = React.useState(false);
    const enableSidePanelPreview = shouldEnableSidePanelPreview();

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
                className={leftPanelCollapsed ? 'w1-side-panel-toggle w1-side-panel-toggle--left w1-side-panel-toggle--collapsed' : 'w1-side-panel-toggle w1-side-panel-toggle--left'}
                onClick={() => setLeftPanelCollapsed((value) => !value)}
                aria-label={leftPanelCollapsed ? '展开左侧面板' : '收起左侧面板'}
            >
                {leftPanelCollapsed ? '▶' : '◀'}
            </button>
            <div
                className={leftPanelCollapsed ? 'w1-side-panel-column w1-side-panel-column--left w1-side-panel-column--collapsed-left' : 'w1-side-panel-column w1-side-panel-column--left'}>
                <WorkshopOneLeftPanels data={scadaData}/>
            </div>

            <button
                type="button"
                className={rightPanelCollapsed ? 'w1-side-panel-toggle w1-side-panel-toggle--right w1-side-panel-toggle--collapsed' : 'w1-side-panel-toggle w1-side-panel-toggle--right'}
                onClick={() => setRightPanelCollapsed((value) => !value)}
                aria-label={rightPanelCollapsed ? '展开右侧面板' : '收起右侧面板'}
            >
                {rightPanelCollapsed ? '◀' : '▶'}
            </button>
            <div
                className={rightPanelCollapsed ? 'w1-side-panel-column w1-side-panel-column--right w1-side-panel-column--collapsed-right' : 'w1-side-panel-column w1-side-panel-column--right'}>
                <WorkshopOneRightPanels data={scadaData}/>
            </div>

            <main className="relative z-10 flex-1 overflow-hidden bg-transparent">
                <ScrollDashboard
                    data={scadaData}
                    alarmData={alarmData}
                    sidePanelPreviewEnabled={enableSidePanelPreview}
                    detachedRegionBody
                />
                {enableSidePanelPreview ? (
                    <SidePanelPreview data={scadaData} alarmData={alarmData} mqttConnected={mqttConnected}/>
                ) : null}
            </main>
        </>
    );
}
