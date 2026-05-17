import React from 'react';
import { AnimatePresence } from 'motion/react';
import {
  AlarmPanel,
  ScrollDashboard,
  SidePanelPreview,
  shouldEnableSidePanelPreview,
} from '../dashboard';
import { TankDataPanel } from '../dashboard/components/TankDataPanel';
import { Tank } from '../dashboard/ui/SharedComponents';
import type { WorkshopRuntimeData } from './types';

const regionHeaders = [
  { id: 'main', title: '主画面', subtitle: 'MAIN SCREEN', alarmRegionId: 'tanks' as const },
];

const hclTankData = [
  { id: 'hcl-1', label: '1#盐酸罐', level: 7.61, leak: '-0.05 ppm' },
  { id: 'hcl-2', label: '2#盐酸罐', level: 6.18, leak: '-0.02 ppm' },
  { id: 'hcl-3', label: '3#盐酸罐', level: 2.85, leak: '0.02 ppm' },
  { id: 'hcl-4', label: '4#盐酸罐', level: 8.23, leak: '-0.02 ppm' },
  { id: 'hcl-5', label: '5#盐酸罐', level: 8.26, leak: null },
];

function WorkshopTwoBody() {
  return (
    <div className="workshop-two-body">
      <section className="workshop-two-screen" aria-label="新聚铝液位盐酸罐区">
        <div className="workshop-two-screen__grid">
          {hclTankData.map((tank) => (
            <article key={tank.id} className="workshop-two-screen__tank-card">
              <Tank
                label={tank.label}
                level={tank.level}
                max={10}
                variant="storage"
                labelOffsetClassName="mt-10"
              />
              {tank.leak ? (
                <div className="workshop-two-screen__leak">
                  <div className="workshop-two-screen__leak-label">盐酸泄漏{tank.id.slice(-1)}</div>
                  <div className="workshop-two-screen__leak-value">{tank.leak}</div>
                </div>
              ) : (
                <div className="workshop-two-screen__leak workshop-two-screen__leak--empty" aria-hidden="true" />
              )}
            </article>
          ))}
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
        className={leftPanelCollapsed ? 'side-panel-toggle side-panel-toggle--left side-panel-toggle--collapsed' : 'side-panel-toggle side-panel-toggle--left'}
        onClick={() => setLeftPanelCollapsed((value) => !value)}
        aria-label={leftPanelCollapsed ? '展开左侧面板' : '收起左侧面板'}
      >
        {leftPanelCollapsed ? '▶' : '◀'}
      </button>
      <div className={leftPanelCollapsed ? 'tank-data-column tank-data-column--left tank-data-column--collapsed-left' : 'tank-data-column tank-data-column--left'}>
        <TankDataPanel
          data={scadaData}
          title="盐酸泄漏面板"
          subtitle="HYDROCHLORIC ACID LEAK PANEL"
          mode="level"
          levelLabels={['盐酸泄漏1', '盐酸泄漏2', '盐酸泄漏3', '盐酸泄漏4']}
          levelValues={[-0.05, -0.02, 0.02, -0.02]}
          embedded
        />
        <TankDataPanel
          data={scadaData}
          position="left"
          title="主画面流量面板"
          subtitle="TANK FLOW PANEL"
          mode="flow"
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
      <div className={rightPanelCollapsed ? 'tank-data-column tank-data-column--right tank-data-column--collapsed-right' : 'tank-data-column tank-data-column--right'}>
        <TankDataPanel
          data={scadaData}
          position="right"
          title="主画面可视化面板"
          subtitle="MAIN SCREEN VISUALIZATION"
          mode="temperature"
          embedded
        />
        <TankDataPanel
          data={scadaData}
          position="right"
          title="外部设备可视化面板"
          subtitle="EXTERNAL EQUIPMENT PANEL"
          mode="external"
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
          sidePanelPreviewEnabled={enableSidePanelPreview}
          hideRegionBody
          headerRegions={regionHeaders}
        />
        <WorkshopTwoBody />
        {enableSidePanelPreview ? (
          <SidePanelPreview data={scadaData} alarmData={alarmData} mqttConnected={mqttConnected} />
        ) : null}
      </main>
    </>
  );
}
