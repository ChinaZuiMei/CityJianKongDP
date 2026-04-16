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
      
      <main className="relative flex-1 overflow-hidden bg-transparent">
        <ScrollDashboard data={scadaData} alarmData={alarmData} sidePanelPreviewEnabled={enableSidePanelPreview} />
        {enableSidePanelPreview ? (
          <SidePanelPreview data={scadaData} alarmData={alarmData} mqttConnected={mqttConnected} />
        ) : null}
      </main>
    </div>
  );
}
