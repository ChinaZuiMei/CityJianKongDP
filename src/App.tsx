import React from 'react';
import { AnimatePresence } from 'motion/react';
import {
  AlarmPanel,
  Header,
  ScrollDashboard,
  SidePanelPreview,
  shouldEnableSidePanelPreview,
  useDashboardRuntime,
} from './features/dashboard';
import { TankDataPanel } from './features/dashboard/components/TankDataPanel';

export default function App() {
  const enableSidePanelPreview = shouldEnableSidePanelPreview();
  const {
    currentTime,
    workshops,
    scadaData,
    mqttConnected,
    alarmData,
    activeAlarms,
    alarmCount,
    isAlarmPanelOpen,
    selectedWorkshop,
    setIsAlarmPanelOpen,
    setSelectedWorkshop,
  } = useDashboardRuntime();

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-transparent text-slate-900 font-sans selection:bg-sky-300/50">
      <Header
        currentTime={currentTime}
        connected={mqttConnected}
        alarmCount={alarmCount}
        onAlarmClick={() => setIsAlarmPanelOpen(!isAlarmPanelOpen)}
        workshops={workshops}
        selectedWorkshop={selectedWorkshop}
        onWorkshopChange={setSelectedWorkshop}
      />

      <AnimatePresence>
        <AlarmPanel
          alarms={activeAlarms}
          alarmData={alarmData}
          isOpen={isAlarmPanelOpen}
          onClose={() => setIsAlarmPanelOpen(false)}
        />
      </AnimatePresence>

      {/* 左侧罐区数据面板 */}
      <div className="tank-data-column tank-data-column--left">
        <TankDataPanel data={scadaData} embedded />
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
          style={{ marginTop: 'auto' }}
        />
      </div>
      <div className="tank-data-column tank-data-column--right">
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
          title="盐酸泄漏数据面板"
          subtitle="HCL LEAK DATA PANEL"
          mode="leak"
          embedded
        />
      </div>

      <main className="relative flex-1 overflow-hidden bg-transparent">
        <ScrollDashboard data={scadaData} alarmData={alarmData} sidePanelPreviewEnabled={enableSidePanelPreview} />
        {enableSidePanelPreview ? (
          <SidePanelPreview data={scadaData} alarmData={alarmData} mqttConnected={mqttConnected} />
        ) : null}
      </main>
    </div>
  );
}
