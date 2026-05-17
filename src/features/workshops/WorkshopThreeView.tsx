import React from 'react';
import { AnimatePresence } from 'motion/react';
import { AlarmPanel, ScrollDashboard } from '../dashboard';
import { TankDataPanel } from '../dashboard/components/TankDataPanel';
import type { WorkshopRuntimeData } from './types';
import reactorTankImage from '../../images/反应槽.png';
import tankImage from '../../mingfanImg/罐子.png';
import scrubberTowerImage from '../../images/洗涤塔.png';
import fanImage from '../../images/风机.png';

type UndergroundTankItem = {
  id: string;
  label: string;
  temp: number;
};

type GlassTankItem = {
  id: string;
  label: string;
  temp: number;
  current: number;
};

type SteelTankItem = {
  id: string;
  current: string;
  temperature: string;
  pressure: string;
};

type FlowItem = {
  id: string;
  title: string;
  instant: number;
  total: number;
};

type WorkshopThreeVerticalReactorProps = React.Attributes & {
  label: string;
  temp: number;
  current?: number;
  showCurrent?: boolean;
};

const regionHeaders = [
  { id: 'underground', title: '地下斧', subtitle: 'UNDERGROUND REACTOR', alarmRegionId: 'main' as const },
  { id: 'steel', title: '钢锅斧', subtitle: 'STEEL REACTOR' },
  { id: 'glass', title: '玻璃钢斧', subtitle: 'FRP REACTOR' },
  { id: 'enamel-1', title: '搪瓷斧-区域1', subtitle: 'ENAMEL REACTOR - AREA 1' },
  { id: 'enamel-2', title: '搪瓷斧-区域2', subtitle: 'ENAMEL REACTOR - AREA 2' },
  { id: 'external-1', title: '外部设备-区域1', subtitle: 'EXTERNAL EQUIPMENT - AREA 1' },
  { id: 'external-2', title: '外部设备-区域2', subtitle: 'EXTERNAL EQUIPMENT - AREA 2' },
];

const undergroundReactors: UndergroundTankItem[] = [
  { id: 'UD3001A', label: '1#反应槽', temp: 53.4 },
  { id: 'UD3001B', label: '2#反应槽', temp: 83.4 },
  { id: 'UD3001C', label: '3#反应槽', temp: 0.0 },
];

const steelReactors: SteelTankItem[] = [
  { id: 'F0201A', current: '9.6 A', temperature: '110.8°C', pressure: '0.19 Mpa' },
  { id: 'F0201B', current: '0.0 A', temperature: '37.4°C', pressure: '-0.00 Mpa' },
];

const steelFlowGroups: FlowItem[] = [
  { id: 'steam-new', title: '新聚铝反应蒸汽流量', instant: 3.3, total: 53931.1 },
  { id: 'steam-low', title: '低铁无铁蒸汽流量', instant: 0.0, total: 10011.9 },
  { id: 'alkali', title: '碱水流量', instant: 0.0, total: 34440.4 },
  { id: 'iron', title: '铁水流量', instant: 0.0, total: 11088.0 },
  { id: 'hcl', title: '盐酸流量', instant: 0.0, total: 17876.0 },
];

const glassSteelReactors: GlassTankItem[] = [
  { id: 'FR3001A', label: '1#反应槽', current: 7.5, temp: 82.3 },
  { id: 'FR3001B', label: '2#反应槽', current: 29.4, temp: 75.7 },
  { id: 'FR3001C', label: '3#反应槽', current: 24.6, temp: 0.0 },
  { id: 'FR3001D', label: '4#反应槽', current: 13.3, temp: 52.7 },
  { id: 'FR3001E', label: '5#反应槽', current: 0.0, temp: 0.0 },
];

const enamelReactors: SteelTankItem[] = [
  { id: 'F0401A', current: '0.0 A', temperature: '82.0°C', pressure: '-0.00 Mpa' },
  { id: 'F0401B', current: '0.0 A', temperature: '127.9°C', pressure: '0.09 Mpa' },
  { id: 'F0401C', current: '0.0 A', temperature: '33.3°C', pressure: '-0.20 Mpa' },
  { id: 'F0401D', current: '3.6 A', temperature: '36.6°C', pressure: '-0.20 Mpa' },
  { id: 'F0401E', current: '0.0 A', temperature: '32.4°C', pressure: '0.06 Mpa' },
  { id: 'F0401F', current: '4.8 A', temperature: '72.9°C', pressure: '-0.20 Mpa' },
];

const externalAreaOne = [
  {
    id: 'tower-1',
    towerName: '洗涤塔1',
    pumpName: '循环泵1',
    pumpCurrent: '9.9 A',
  },
  {
    id: 'tower-2',
    towerName: '洗涤塔2',
    pumpName: '循环泵2',
    pumpCurrent: '13.5 A',
  },
  {
    id: 'tower-3',
    towerName: '洗涤塔3',
    pumpName: '循环泵3',
    pumpCurrent: '0.0 A',
  },
];

const externalAreaTwo = [
  {
    id: 'tower-4',
    towerName: '洗涤塔4',
    pumpName: '循环泵4',
    pumpCurrent: '11.4 A',
  },
  {
    id: 'tower-5',
    towerName: '洗涤塔5',
    pumpName: '循环泵5',
    pumpCurrent: '9.5 A',
  },
  {
    id: 'tower-6',
    towerName: '洗涤塔6',
    pumpName: '循环泵6',
    pumpCurrent: '0.0 A',
  },
];

function WorkshopThreeVerticalReactor({
  label,
  temp,
  current,
  showCurrent = false,
}: WorkshopThreeVerticalReactorProps) {
  return (
    <article className="workshop-three-vertical-reactor">
      <div className="workshop-three-vertical-reactor__label">{label}</div>
      <div className="workshop-three-vertical-reactor__visual">
        <img src={reactorTankImage} alt={label} className="workshop-three-vertical-reactor__image" draggable="false" />
      </div>
      <div className="workshop-three-vertical-reactor__metrics workshop-three-vertical-reactor__metrics--below">
        {showCurrent && current !== undefined ? (
          <div className="workshop-three-vertical-reactor__metric">
            {current.toFixed(1)} A
          </div>
        ) : null}
        <div className="workshop-three-vertical-reactor__metric">
          {temp.toFixed(1)}°C
        </div>
      </div>
    </article>
  );
}

function UndergroundSlide() {
  return (
    <section className="workshop-three-reactor-slide" aria-label="地下斧区域">
      <div className="workshop-three-reactor-column">
        {undergroundReactors.map((tank) => (
          <WorkshopThreeVerticalReactor
            key={tank.id}
            label={tank.label}
            temp={tank.temp}
            showCurrent={false}
          />
        ))}
      </div>
    </section>
  );
}

function GlassSlide() {
  return (
    <section className="workshop-three-reactor-slide" aria-label="玻璃钢斧区域">
      <div className="workshop-three-reactor-column workshop-three-reactor-column--five">
        {glassSteelReactors.map((tank) => (
          <WorkshopThreeVerticalReactor
            key={tank.id}
            label={tank.label}
            temp={tank.temp}
            current={tank.current}
            showCurrent
          />
        ))}
      </div>
    </section>
  );
}

function WorkshopThreeSteelTankCard({
  id,
  current,
  temperature,
  pressure,
}: SteelTankItem) {
  return (
    <article className="workshop-three-steel-card">
      <div className="workshop-three-steel-card__visual">
        <img src={tankImage} alt={id} className="workshop-three-steel-card__image" draggable="false" />
        <div className="workshop-three-steel-card__code">{id}</div>
      </div>
      <div className="workshop-three-steel-card__metrics">
        <div className="workshop-three-steel-card__metric">{current}</div>
        <div className="workshop-three-steel-card__metric">{temperature}</div>
        <div className="workshop-three-steel-card__metric">{pressure}</div>
      </div>
    </article>
  );
}

function SteelSlide() {
  return (
    <section className="workshop-three-steel-slide" aria-label="钢锅斧区域">
      <div className="workshop-three-steel-slide__tank-row">
        {steelReactors.map((tank) => (
          <div key={tank.id} className="workshop-three-steel-slide__tank-slot">
            <WorkshopThreeSteelTankCard {...tank} />
          </div>
        ))}
      </div>
    </section>
  );
}

function EnamelSlide({ tanks }: { tanks: SteelTankItem[] }) {
  return (
    <section className="workshop-three-enamel-slide" aria-label="搪瓷釜区域">
      <div className="workshop-three-enamel-grid">
        {tanks.map((tank) => (
          <div key={tank.id} className="workshop-three-enamel-grid__cell">
            <WorkshopThreeSteelTankCard {...tank} />
          </div>
        ))}
      </div>
    </section>
  );
}

function ExternalSlide({
  fanCurrent,
  towers,
}: {
  fanCurrent: string;
  towers: Array<{ id: string; towerName: string; pumpName: string; pumpCurrent: string }>;
}) {
  return (
    <section className="workshop-three-external-slide" aria-label="外部设备区域">
      <div className="workshop-three-external-strip">
        <div className="workshop-three-external-strip__fan-block">
          <img src={fanImage} alt="风机" className="workshop-three-external-strip__fan" draggable="false" />
          <div className="workshop-three-external-strip__device-name">风机</div>
          <div className="workshop-three-external-strip__device-value">{fanCurrent}</div>
        </div>
        {towers.map((tower) => (
          <div key={tower.id} className="workshop-three-external-strip__tower-block">
            <img src={scrubberTowerImage} alt={tower.towerName} className="workshop-three-external-strip__tower" draggable="false" />
            <div className="workshop-three-external-strip__tower-name">{tower.towerName}</div>
            <div className="workshop-three-external-strip__pump-icon" aria-hidden="true">⚙</div>
            <div className="workshop-three-external-strip__pump-name">{tower.pumpName}</div>
            <div className="workshop-three-external-strip__device-value">{tower.pumpCurrent}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WorkshopThreeBody({
  activeRegionIndex,
  onActiveRegionIndexChange,
}: {
  activeRegionIndex: number;
  onActiveRegionIndexChange: (index: number) => void;
}) {
  const slides = [
    { id: 'underground', content: <UndergroundSlide /> },
    { id: 'steel', content: <SteelSlide /> },
    { id: 'glass', content: <GlassSlide /> },
    { id: 'enamel-1', content: <EnamelSlide tanks={enamelReactors.slice(0, 3)} /> },
    { id: 'enamel-2', content: <EnamelSlide tanks={enamelReactors.slice(3, 6)} /> },
    { id: 'external-1', content: <ExternalSlide fanCurrent="17.4 A" towers={externalAreaOne} /> },
    { id: 'external-2', content: <ExternalSlide fanCurrent="0.0 A" towers={externalAreaTwo} /> },
  ];
  const lastIndex = slides.length - 1;

  const reversedSlides = [...slides].reverse();
  const bodyTrackIndex = Math.max(0, slides.length - 1 - activeRegionIndex);

  return (
    <div className="workshop-three-body">
      <div className="workshop-three-body__track" style={{ transform: `translateX(-${bodyTrackIndex * 100}%)` }}>
        {reversedSlides.map((slide) => (
          <div key={slide.id} className="workshop-three-body__slide">
            {slide.content}
          </div>
        ))}
      </div>
      <div className="workshop-carousel__dots workshop-carousel__dots--bottom" aria-label="新聚铝反应轮播切换">
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

export function WorkshopThreeView({
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
        <TankDataPanel data={scadaData} embedded />
        <TankDataPanel
          data={scadaData}
          position="left"
          title="流量面板"
          subtitle="FLOW PANEL"
          mode="flow"
          flowItems={steelFlowGroups}
          hideFlowName
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
        <ScrollDashboard
          data={scadaData}
          alarmData={alarmData}
          hideRegionBody
          headerRegions={regionHeaders}
          activeRegionIndex={activeRegionIndex}
          onActiveRegionIndexChange={setActiveRegionIndex}
        />
        <WorkshopThreeBody activeRegionIndex={activeRegionIndex} onActiveRegionIndexChange={setActiveRegionIndex} />
      </main>
    </>
  );
}
