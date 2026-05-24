import React from 'react';
import {AnimatePresence} from 'motion/react';
import {AlertTriangle} from 'lucide-react';
import {
    AlarmPanel,
    ScrollDashboard,
    SidePanelPreview,
    shouldEnableSidePanelPreview,
} from '../dashboard';
import {getAlarmNames, hasAlarm} from '../dashboard/lib/alarmUtils';
import {Tank} from '../dashboard/ui/SharedComponents';
import {formatMetricValue} from '../../utils/formatMetricValue';
import {cn} from '../../utils/cn';
import type {WorkshopRuntimeData} from './types';
import {buildWorkshopTwoLeaks, buildWorkshopTwoTanks} from './workshopTwoDataBindings';
import {WorkshopTwoLeftPanels, WorkshopTwoRightPanels} from './workshop-two';

const regionHeaders = [
    {id: 'main', title: '主画面', subtitle: 'MAIN SCREEN', alarmRegionId: 'tanks' as const},
];

function WorkshopTwoBody({scadaData, alarmData}: Pick<WorkshopRuntimeData, 'scadaData' | 'alarmData'>) {
    const tanks = React.useMemo(() => buildWorkshopTwoTanks(scadaData, alarmData), [scadaData, alarmData]);
    const leaks = React.useMemo(() => buildWorkshopTwoLeaks(scadaData), [scadaData]);

    return (
        <div className="workshop-two-body">
            <section className="workshop-two-screen" aria-label="新聚铝液位盐酸罐区">
                <div className="workshop-two-screen__tanks">
                    {tanks.map((tank) => (
                        <article key={tank.id} className="workshop-two-screen__tank-card">
                            <Tank
                                label={tank.label}
                                level={tank.level}
                                max={10}
                                variant="storage"
                                labelOffsetClassName="mt-10"
                                hasAlarm={tank.hasAlarm}
                            />
                        </article>
                    ))}
                </div>
                <div className="workshop-two-screen__leaks">
                    <div className="workshop-two-screen__leaks-inner">
                        {leaks.map((leak) => {
                            const isAlarm = hasAlarm(leak.component, alarmData);
                            const alarmNames = getAlarmNames(leak.component, alarmData);

                            return (
                                <div key={leak.component} className="workshop-two-screen__leak-item">
                                    <div
                                        className={cn(
                                            'workshop-two-screen__leak-header',
                                            isAlarm && 'workshop-two-screen__leak-header--alarm',
                                        )}
                                    >
                                        <AlertTriangle
                                            size={14}
                                            className={cn(isAlarm ? 'text-red-400 animate-pulse' : 'text-sky-300')}
                                        />
                                        <span>盐酸泄漏 {leak.id}</span>
                                    </div>
                                    <div
                                        className={cn(
                                            'workshop-two-screen__leak-value-box',
                                            isAlarm && 'workshop-two-screen__leak-value-box--alarm',
                                        )}
                                    >
                                        {formatMetricValue(leak.value)}{' '}
                                        <span className="workshop-two-screen__leak-unit">ppm</span>
                                    </div>
                                    <div className="workshop-two-screen__leak-alarms">
                                        {alarmNames.map((name, idx) => (
                                            <div key={idx} className="workshop-two-screen__leak-alarm-name">
                                                {name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}

export function WorkshopTwoView({
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
                className={leftPanelCollapsed ? 'w2-side-panel-toggle w2-side-panel-toggle--left w2-side-panel-toggle--collapsed' : 'w2-side-panel-toggle w2-side-panel-toggle--left'}
                onClick={() => setLeftPanelCollapsed((value) => !value)}
                aria-label={leftPanelCollapsed ? '展开左侧面板' : '收起左侧面板'}
            >
                {leftPanelCollapsed ? '▶' : '◀'}
            </button>
            <div
                className={leftPanelCollapsed ? 'w2-side-panel-column w2-side-panel-column--left w2-side-panel-column--collapsed-left' : 'w2-side-panel-column w2-side-panel-column--left'}>
                <WorkshopTwoLeftPanels data={scadaData}/>
            </div>

            <button
                type="button"
                className={rightPanelCollapsed ? 'w2-side-panel-toggle w2-side-panel-toggle--right w2-side-panel-toggle--collapsed' : 'w2-side-panel-toggle w2-side-panel-toggle--right'}
                onClick={() => setRightPanelCollapsed((value) => !value)}
                aria-label={rightPanelCollapsed ? '展开右侧面板' : '收起右侧面板'}
            >
                {rightPanelCollapsed ? '◀' : '▶'}
            </button>
            <div
                className={rightPanelCollapsed ? 'w2-side-panel-column w2-side-panel-column--right w2-side-panel-column--collapsed-right' : 'w2-side-panel-column w2-side-panel-column--right'}>
                <WorkshopTwoRightPanels data={scadaData}/>
            </div>

            <main className="relative z-10 flex-1 overflow-hidden bg-transparent">
                <ScrollDashboard
                    data={scadaData}
                    alarmData={alarmData}
                    sidePanelPreviewEnabled={enableSidePanelPreview}
                    hideRegionBody
                    headerRegions={regionHeaders}
                />
                <WorkshopTwoBody scadaData={scadaData} alarmData={alarmData}/>
                {enableSidePanelPreview ? (
                    <SidePanelPreview data={scadaData} alarmData={alarmData} mqttConnected={mqttConnected}/>
                ) : null}
            </main>
        </>
    );
}
