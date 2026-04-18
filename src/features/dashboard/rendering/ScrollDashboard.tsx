import React, { useRef, useState } from 'react';
import type { AlarmData, ScadaData } from '../model/types';
import { ExternalEquipmentScreen } from '../screens/ExternalEquipmentScreen';
import { MainScreen } from '../screens/MainScreen';
import { TankAreaScreen } from '../screens/TankAreaScreen';

const Section = ({
  title,
  children,
  minHeight,
}: {
  title?: string;
  children: React.ReactNode;
  minHeight: string;
}) => (
  <section className="relative rounded-[28px] bg-transparent shadow-none">
    {title ? (
      <h2 className="panel-title-glow pointer-events-none absolute left-3 top-2 z-10 text-lg font-black tracking-[0.18em] uppercase">
        {title}
      </h2>
    ) : null}
    <div className={minHeight}>{children}</div>
  </section>
);

export const ScrollDashboard = ({
  data,
  alarmData,
  sidePanelPreviewEnabled = false,
}: {
  data: ScadaData;
  alarmData: AlarmData;
  sidePanelPreviewEnabled?: boolean;
}) => {
  const outerClassName = sidePanelPreviewEnabled ? 'pl-[420px] pr-[420px]' : '';
  const columnRows = 'minmax(335px, 41vh) minmax(300px, 37vh)';
  const [scale, setScale] = useState(0.92);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; originX: number; originY: number } | null>(null);

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    const nextScale = Math.max(0.2, Math.min(1.28, scale - event.deltaY * 0.001));
    setScale(Number(nextScale.toFixed(3)));
  };

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.button !== 0) return;
    setDragging(true);
    dragStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      originX: offset.x,
      originY: offset.y,
    };
  };

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (!dragStartRef.current) return;
    const deltaX = event.clientX - dragStartRef.current.x;
    const deltaY = event.clientY - dragStartRef.current.y;
    setOffset({
      x: dragStartRef.current.originX + deltaX,
      y: dragStartRef.current.originY + deltaY,
    });
  };

  const stopDragging = () => {
    setDragging(false);
    dragStartRef.current = null;
  };

  return (
    <div className={`dashboard-scroll-shell flex h-full w-full min-h-0 min-w-0 items-center justify-center overflow-y-auto overflow-x-hidden ${outerClassName}`}>
      <div
        className={`dashboard-workspace relative mx-auto flex h-full w-full items-center justify-center overflow-visible rounded-[32px] ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
      >
        <div className="pointer-events-none fixed bottom-5 right-5 z-20 rounded-full border border-sky-300/35 bg-slate-950 px-3.5 py-1.5 text-[11px] font-black tracking-[0.14em] text-sky-100 shadow-[0_10px_30px_rgba(2,8,23,0.45)]">
          缩放 {Math.round(scale * 100)}%
        </div>
        <div
          className="absolute left-1/2 top-1/2 w-[1680px] origin-center"
          style={{
            transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${scale})`,
          }}
        >
          <div className="grid grid-cols-1 gap-[15px] 2xl:grid-cols-2">
            <div className="grid gap-[15px]" style={{ gridTemplateRows: columnRows }}>
              <Section title="主画面" minHeight="h-full">
                <div className="flex h-full items-center justify-center overflow-hidden pt-8">
                  <div className="dashboard-module-scale dashboard-module-scale--main">
                    <MainScreen data={data} alarmData={alarmData} />
                  </div>
                </div>
              </Section>

              <Section title="外部设备-聚铝老厂" minHeight="h-full">
                <div className="h-full overflow-visible px-2 pt-8 pb-2">
                  <div className="dashboard-module-scale dashboard-module-scale--external">
                    <ExternalEquipmentScreen data={data} alarmData={alarmData} section="oldPlant" />
                  </div>
                </div>
              </Section>
            </div>

            <div className="grid gap-[15px]" style={{ gridTemplateRows: columnRows }}>
              <Section title="罐区" minHeight="h-full">
                <div className="flex h-full items-center justify-center overflow-hidden pt-8">
                  <div className="dashboard-module-scale dashboard-module-scale--tank">
                    <TankAreaScreen data={data} alarmData={alarmData} />
                  </div>
                </div>
              </Section>

              <Section title="外部设备-滚筒干燥" minHeight="h-full">
                <div className="h-full overflow-visible px-2 pt-8 pb-2">
                  <div className="dashboard-module-scale dashboard-module-scale--external">
                    <ExternalEquipmentScreen data={data} alarmData={alarmData} section="drum" />
                  </div>
                </div>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
