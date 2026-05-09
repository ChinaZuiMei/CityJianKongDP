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
import topDecorImage from './images/网站顶部图片.png';
import bottomDecorImage from './images/网站底部图.png';
import sideDecorImage from './images/网站侧边图.png';

export default function App() {
  const [leftPanelCollapsed, setLeftPanelCollapsed] = React.useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = React.useState(false);
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
    <div className="relative flex h-screen w-screen flex-col overflow-x-hidden overflow-y-auto bg-transparent text-slate-900 font-sans selection:bg-sky-300/50">
      <div className="site-background" aria-hidden />
      <div className="site-decor-layer" aria-hidden>
        <img src={topDecorImage} alt="" className="site-decor site-decor--top" draggable="false" />
        <img src={bottomDecorImage} alt="" className="site-decor site-decor--bottom" draggable="false" />
        <img src={sideDecorImage} alt="" className="site-decor site-decor--left" draggable="false" />
        <img src={sideDecorImage} alt="" className="site-decor site-decor--right" draggable="false" />
      </div>
      <div className="site-title-box">
        <div className="site-title">建衡实业IOT面板</div>
        <div className="site-title-divider" aria-hidden />
        <div className="site-title-subtitle">JIANHENG INDUSTRIAL IOT CONTROL PANEL</div>
      </div>
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
      <button
        type="button"
        className={leftPanelCollapsed ? 'side-panel-toggle side-panel-toggle--left side-panel-toggle--collapsed' : 'side-panel-toggle side-panel-toggle--left'}
        onClick={() => setLeftPanelCollapsed((value) => !value)}
        aria-label={leftPanelCollapsed ? '展开左侧面板' : '收起左侧面板'}
      >
        {leftPanelCollapsed ? '▶' : '◀'}
      </button>
      <div className={leftPanelCollapsed ? 'tank-data-column tank-data-column--left tank-data-column--collapsed-left' : 'tank-data-column tank-data-column--left'}>
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
          title="盐酸泄漏数据面板"
          subtitle="HCL LEAK DATA PANEL"
          mode="leak"
          embedded
        />
      </div>

      <main className="relative z-10 flex-1 overflow-hidden bg-transparent">
        <ScrollDashboard data={scadaData} alarmData={alarmData} sidePanelPreviewEnabled={enableSidePanelPreview} />
        {enableSidePanelPreview ? (
          <SidePanelPreview data={scadaData} alarmData={alarmData} mqttConnected={mqttConnected} />
        ) : null}
      </main>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-full h-36" />
    </div>
  );
}
