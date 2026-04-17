import React, { useRef, useState } from 'react';
import { Activity } from 'lucide-react';
import type { AlarmData, ScadaData } from '../model/types';
import { ExternalEquipmentScreen } from '../screens/ExternalEquipmentScreen';
import { MainScreen } from '../screens/MainScreen';
import { TankAreaScreen } from '../screens/TankAreaScreen';
import loadingTruckImage from '../../../images/油罐车.png';

const Section = ({
  title,
  children,
  minHeight,
}: {
  title: string;
  children: React.ReactNode;
  minHeight: string;
}) => (
  <section className="relative rounded-[28px] bg-transparent shadow-none">
    <h2 className="panel-title-glow pointer-events-none absolute left-3 top-2 z-10 text-lg font-black tracking-[0.18em] uppercase">
      {title}
    </h2>
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
  const outerClassName = sidePanelPreviewEnabled ? 'pl-[420px] pr-[420px] py-4' : 'px-4 py-4';
  const [scale, setScale] = useState(0.92);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; originX: number; originY: number } | null>(null);

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    const nextScale = Math.max(0.72, Math.min(1.28, scale - event.deltaY * 0.001));
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
    <div className={`h-full overflow-y-auto overflow-x-hidden ${outerClassName}`}>
      <div
        className={`dashboard-workspace panel-frame relative mx-auto h-[calc(100vh-118px)] max-w-[1800px] overflow-visible rounded-[32px] border ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
      >
        <div className="pointer-events-none absolute right-4 top-4 z-20 rounded-full border border-sky-300/20 bg-slate-950/35 px-3 py-1 text-[11px] font-black tracking-[0.14em] text-sky-100">
          缩放 {Math.round(scale * 100)}%
        </div>
        <div
          className="absolute left-1/2 top-1/2 w-[1680px] origin-center"
          style={{
            transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${scale})`,
          }}
        >
          <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
            <div className="grid gap-4" style={{ gridTemplateRows: 'minmax(320px, 40vh) minmax(340px, 42vh)' }}>
              <Section title="主画面" minHeight="h-full">
                <div className="flex h-full items-center justify-center overflow-hidden pt-8">
                  <div className="dashboard-module-scale dashboard-module-scale--main">
                    <MainScreen data={data} alarmData={alarmData} />
                  </div>
                </div>
              </Section>

              <Section title="装车" minHeight="h-full">
                <div className="flex h-full min-h-0 flex-col px-3 pb-2 pt-8">
                  <div className="panel-frame flex min-h-0 flex-1 flex-col items-center justify-center gap-2 border-b">
                    <div className="panel-title-glow text-sm font-black tracking-[0.12em] uppercase sm:text-base">
                      聚铝装车状态
                    </div>
                    <div className="flex items-end justify-center gap-4">
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={
                            data.loading_instant > 0
                              ? 'animate-truck-loading text-emerald-600'
                              : 'animate-truck-standby text-sky-300'
                          }
                        >
                          <img src={loadingTruckImage} alt="装车罐车" className="h-auto w-[10.5rem] object-contain" draggable="false" />
                        </div>
                        <div
                          className={
                            data.loading_instant > 0 ? 'truck-road truck-road--fast' : 'truck-road truck-road--slow'
                          }
                          aria-hidden
                        />
                      </div>
                      <div
                        className={
                          data.loading_instant > 0 ? 'data-glow-emerald pb-1 text-xl font-black' : 'data-glow pb-1 text-xl font-black'
                        }
                      >
                        {data.loading_instant > 0 ? '装载中' : '待机中'}
                      </div>
                    </div>
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col justify-center gap-3 px-1 pt-3">
                    <div className="panel-frame panel-title-glow flex items-center justify-between border-b pb-2 text-xs font-black">
                      <span>聚铝装车</span>
                      <Activity size={12} className="text-sky-500" />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-medium text-slate-200">瞬时流量:</span>
                      <div className="panel-frame data-glow min-w-[110px] rounded border bg-transparent px-3 py-1.5 text-right font-mono text-sm font-bold">
                        {data.loading_instant.toFixed(1)} <span className="text-[10px] text-slate-300">m³/h</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-medium text-slate-200">累计流量:</span>
                      <div className="data-glow-emerald min-w-[110px] rounded border border-emerald-200/45 bg-transparent px-3 py-1.5 text-right font-mono text-sm font-bold">
                        {data.loading_total.toFixed(1)} <span className="text-[10px] text-slate-300">m³</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Section>
            </div>

            <div className="grid gap-4" style={{ gridTemplateRows: 'minmax(320px, 40vh) minmax(340px, 42vh)' }}>
              <Section title="罐区" minHeight="h-full">
                <div className="flex h-full items-center justify-center overflow-hidden pt-8">
                  <div className="dashboard-module-scale dashboard-module-scale--tank">
                    <TankAreaScreen data={data} alarmData={alarmData} />
                  </div>
                </div>
              </Section>

              <Section title="外部设备" minHeight="h-full">
                <div className="h-full overflow-visible px-2 pt-8 pb-2">
                  <div className="dashboard-module-scale dashboard-module-scale--external">
                    <ExternalEquipmentScreen data={data} alarmData={alarmData} />
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
