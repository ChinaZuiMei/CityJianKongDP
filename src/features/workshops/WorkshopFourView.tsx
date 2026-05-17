import React from 'react';
import { AnimatePresence } from 'motion/react';
import { AlarmPanel, ScrollDashboard } from '../dashboard';
import { TankDataPanel } from '../dashboard/components/TankDataPanel';
import type { WorkshopRuntimeData } from './types';
import tankImage from '../../mingfanImg/罐子.png';
import shipImage from '../../mingfanImg/chaungjian.png';

const zeroLevels = [0, 0, 0, 0];
const noLabels = ['无', '无', '无', '无'];

const regionHeaders = [
  { id: 'main-1', title: '主画面-区域1', subtitle: 'MAIN SCREEN - AREA 1', alarmRegionId: 'main' as const },
  { id: 'main-2', title: '主画面-区域2', subtitle: 'MAIN SCREEN - AREA 2', alarmRegionId: 'main' as const },
  { id: 'output', title: '产量区域', subtitle: 'OUTPUT AREA' },
];

const mainTankGroups = [
  [
    { id: 'FO101A', current: '0.0 A', temperature: '66.0°C', pressure: '0.00 Mpa' },
    { id: 'FO101B', current: '0.0 A', temperature: '38.6°C', pressure: '0.00 Mpa' },
    { id: 'FO101C', current: '0.0 A', temperature: '39.2°C', pressure: '-0.00 Mpa' },
  ],
  [
    { id: 'FO101D', current: '0.0 A', temperature: '40.8°C', pressure: '0.00 Mpa' },
    { id: 'FO101E', current: '0.0 A', temperature: '48.6°C', pressure: '-0.00 Mpa' },
    { id: 'FO101F', current: '0.0 A', temperature: '33.5°C', pressure: '-0.00 Mpa' },
  ],
];

const productionGroups = [
  { id: 'output-1', title: '产线1包装统计', quantity: '3896 P' },
];

function WorkshopFourTankCard({
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

function WorkshopFourMainScreen({
  tanks,
}: {
  tanks: typeof mainTankGroups[number];
}) {
  return (
    <section className="workshop-five-screen" aria-label="聚铝新厂喷雾干燥主画面">
      <div className="workshop-five-screen__tank-grid">
        {tanks.map((tank) => (
          <div key={tank.id} className="workshop-five-screen__tank-slot">
            <WorkshopFourTankCard
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

function WorkshopFourOutputScreen({
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

function WorkshopFourBody({
  activeRegionIndex,
  onActiveRegionIndexChange,
}: {
  activeRegionIndex: number;
  onActiveRegionIndexChange: (index: number) => void;
}) {
  const slides = [
    {
      id: 'main-1',
      content: <WorkshopFourMainScreen tanks={mainTankGroups[0]} />,
    },
    {
      id: 'main-2',
      content: <WorkshopFourMainScreen tanks={mainTankGroups[1]} />,
    },
    {
      id: 'output',
      content: <WorkshopFourOutputScreen title={productionGroups[0].title} quantity={productionGroups[0].quantity} />,
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
      <div className="workshop-five-carousel__dots" aria-label="车间4轮播切换">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            className={index === activeRegionIndex ? 'workshop-five-carousel__dot workshop-five-carousel__dot--active' : 'workshop-five-carousel__dot'}
            onClick={() => onActiveRegionIndexChange(index)}
            aria-label={`切换到${regionHeaders[index]?.title ?? `第 ${index + 1} 页`}`}
            aria-current={index === activeRegionIndex ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export function WorkshopFourView({
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
          title="福邦硫酸氢钾流量面板"
          subtitle="FUBANG POTASSIUM BISULFATE FLOW PANEL"
          mode="flow"
          flowVariantOverride="acid"
          flowValues={{ instant: 0, total: 27377.6 }}
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
          title="福邦盐酸流量面板"
          subtitle="FUBANG HYDROCHLORIC ACID FLOW PANEL"
          mode="flow"
          flowVariantOverride="acid"
          flowValues={{ instant: 0, total: 5501.2 }}
          hideFlowName
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
        <WorkshopFourBody activeRegionIndex={activeRegionIndex} onActiveRegionIndexChange={setActiveRegionIndex} />
      </main>
    </>
  );
}
