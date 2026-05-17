import React from 'react';
import { AnimatePresence } from 'motion/react';
import { AlarmPanel, ScrollDashboard } from '../dashboard';
import { TankDataPanel } from '../dashboard/components/TankDataPanel';
import type { WorkshopRuntimeData } from './types';
import tankImage from '../../mingfanImg/罐子.png';
import shipImage from '../../mingfanImg/chaungjian.png';

const zeroLevels = [0, 0, 0, 0];
const noLabels = ['无', '无', '无', '无'];
const noTemperatures: [number, number] = [0, 0];
const noTemperatureLabels: [string, string] = ['无', '无'];

const regionHeaders = [
  { id: 'main-1', title: '主画面-区域1', subtitle: 'MAIN SCREEN - AREA 1', alarmRegionId: 'main' as const },
  { id: 'main-2', title: '主画面-区域2', subtitle: 'MAIN SCREEN - AREA 2', alarmRegionId: 'main' as const },
  { id: 'output-1', title: '产量-区域1', subtitle: 'OUTPUT - AREA 1' },
  { id: 'output-2', title: '产量-区域2', subtitle: 'OUTPUT - AREA 2' },
];

const mainTankGroups = [
  [
    { id: 'F0101A', current: '14.0A', temperature: '106.4°C', pressure: '0.02Mpa' },
    { id: 'F0101B', current: '13.5A', temperature: '94.5°C', pressure: '0.00Mpa' },
    { id: 'F0101C', current: '16.3A', temperature: '107.4°C', pressure: '0.02Mpa' },
  ],
  [
    { id: 'F0101D', current: '15.1A', temperature: '126.9°C', pressure: '0.00Mpa' },
    { id: 'F0101E', current: '15.6A', temperature: '89.7°C', pressure: '0.00Mpa' },
    { id: 'F0101F', current: '14.0A', temperature: '114.1°C', pressure: '0.06Mpa' },
  ],
];

const productionGroups = [
  { id: 'output-1', title: '产线1包装统计', quantity: '3896 P' },
  { id: 'output-2', title: '产线2包装统计', quantity: '2 P' },
];

function WorkshopFiveTankCard({
  id,
  current,
  temperature,
  pressure,
}: {
  id: string;
  current: string;
  temperature: string;
  pressure: string;
}) {
  return (
    <article className="workshop-five-tank-card">
      <img src={tankImage} alt={id} className="workshop-five-tank-card__image" draggable="false" />
      <div className="workshop-five-tank-card__code">{id}</div>
      <div className="workshop-five-tank-card__metrics">
        <div className="workshop-five-tank-card__metric">{current}</div>
        <div className="workshop-five-tank-card__metric">{temperature}</div>
        <div className="workshop-five-tank-card__metric">{pressure}</div>
      </div>
    </article>
  );
}

function WorkshopFiveMainScreen({
  title,
  tanks,
}: {
  title: string;
  tanks: typeof mainTankGroups[number];
}) {
  return (
    <section className="workshop-five-screen" aria-label={title}>
      <div className="workshop-five-screen__tank-grid">
        {tanks.map((tank) => (
          <div key={tank.id} className="workshop-five-screen__tank-slot">
            <WorkshopFiveTankCard
              id={tank.id}
              current={tank.current}
              temperature={tank.temperature}
              pressure={tank.pressure}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function WorkshopFiveOutputScreen({
  title,
  quantity,
}: {
  title: string;
  quantity: string;
}) {
  return (
    <section className="workshop-five-output" aria-label={title}>
      <div className="workshop-five-output__meta">
        <div className="workshop-five-output__info-box">{title}</div>
        <div className="workshop-five-output__info-box">当前数量: {quantity}</div>
      </div>
      <div className="workshop-five-output__ship-wrap">
        <img src={shipImage} alt={title} className="workshop-five-output__ship" draggable="false" />
      </div>
    </section>
  );
}

function WorkshopFiveBody({
  activeRegionIndex,
  onActiveRegionIndexChange,
}: {
  activeRegionIndex: number;
  onActiveRegionIndexChange: (index: number) => void;
}) {
  const slides = [
    {
      id: 'main-1',
      content: <WorkshopFiveMainScreen title="主画面-区域1" tanks={mainTankGroups[0]} />,
    },
    {
      id: 'main-2',
      content: <WorkshopFiveMainScreen title="主画面-区域2" tanks={mainTankGroups[1]} />,
    },
    {
      id: 'output-1',
      content: <WorkshopFiveOutputScreen title={productionGroups[0].title} quantity={productionGroups[0].quantity} />,
    },
    {
      id: 'output-2',
      content: <WorkshopFiveOutputScreen title={productionGroups[1].title} quantity={productionGroups[1].quantity} />,
    },
  ];

  const reversedSlides = [...slides].reverse();
  const bodyTrackIndex = Math.max(0, slides.length - 1 - activeRegionIndex);

  return (
    <div className="workshop-five-body">
      <div className="workshop-five-body__track" style={{ transform: `translateX(-${bodyTrackIndex * 100}%)` }}>
        {reversedSlides.map((slide) => (
          <div key={slide.id} className="workshop-five-body__slide">
            {slide.content}
          </div>
        ))}
      </div>
      <div className="workshop-carousel__dots workshop-carousel__dots--bottom" aria-label="车间5轮播切换">
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

export function WorkshopFiveView({
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
      <div className={leftPanelCollapsed ? 'tank-data-column tank-data-column--left tank-data-column--collapsed-left' : 'tank-data-column tank-data-column--left'}>
        <TankDataPanel
          data={scadaData}
          title="蒸汽流量车间5"
          subtitle="STEAM FLOW WORKSHOP 5"
          mode="flow"
          flowVariantOverride="acid"
          flowValues={{ instant: 0, total: 93789 }}
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
      <div className={rightPanelCollapsed ? 'tank-data-column tank-data-column--right tank-data-column--collapsed-right' : 'tank-data-column tank-data-column--right'}>
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
        <WorkshopFiveBody activeRegionIndex={activeRegionIndex} onActiveRegionIndexChange={setActiveRegionIndex} />
      </main>
    </>
  );
}
