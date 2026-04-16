import React from 'react';
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
  <section className="panel-frame relative rounded-[28px] border bg-transparent shadow-none">
    <h2 className="panel-title-glow pointer-events-none absolute left-5 top-3 z-10 text-lg font-black tracking-[0.18em] uppercase">
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

  return (
    <div className={`h-full overflow-y-auto overflow-x-hidden ${outerClassName}`}>
      <div className="mx-auto grid h-full max-w-[1800px] grid-cols-1 gap-4 pb-4 2xl:grid-cols-2">
        <div className="grid gap-4" style={{ gridTemplateRows: 'minmax(360px, 46vh) minmax(420px, 54vh)' }}>
          <Section title="主画面" minHeight="h-full">
            <div className="flex h-full items-center justify-center overflow-hidden">
              <div className="origin-center scale-[0.92] 3xl:scale-[0.97]">
                <MainScreen data={data} alarmData={alarmData} />
              </div>
            </div>
          </Section>

          <Section title="装车" minHeight="h-full">
            <div className="flex h-full min-h-0 flex-col px-5 pb-4 pt-11">
              <div className="panel-frame flex min-h-0 flex-1 flex-col items-center justify-center gap-3 border-b">
                <div className="panel-title-glow text-base font-black tracking-[0.14em] uppercase sm:text-lg">
                  聚铝装车状态
                </div>
                <div className="flex items-end justify-center gap-5">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={
                        data.loading_instant > 0
                          ? 'animate-truck-loading text-emerald-600'
                          : 'animate-truck-standby text-sky-300'
                      }
                    >
                      <img src={loadingTruckImage} alt="装车罐车" className="h-auto w-[12.5rem] object-contain" draggable="false" />
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
                      data.loading_instant > 0 ? 'data-glow-emerald pb-1 text-2xl font-black' : 'data-glow pb-1 text-2xl font-black'
                    }
                  >
                    {data.loading_instant > 0 ? '装载中' : '待机中'}
                  </div>
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col justify-center gap-4 px-1 pt-4">
                <div className="panel-frame panel-title-glow flex items-center justify-between border-b pb-2 text-sm font-black">
                  <span>聚铝装车</span>
                  <Activity size={14} className="text-sky-500" />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-slate-200">瞬时流量:</span>
                  <div className="panel-frame data-glow min-w-[120px] rounded border bg-transparent px-3 py-2 text-right font-mono text-base font-bold">
                    {data.loading_instant.toFixed(1)} <span className="text-xs text-slate-300">m³/h</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-slate-200">累计流量:</span>
                  <div className="data-glow-emerald min-w-[120px] rounded border border-emerald-200/45 bg-transparent px-3 py-2 text-right font-mono text-base font-bold">
                    {data.loading_total.toFixed(1)} <span className="text-xs text-slate-300">m³</span>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>

        <div className="grid gap-4" style={{ gridTemplateRows: 'minmax(360px, 46vh) minmax(420px, 54vh)' }}>
          <Section title="罐区" minHeight="h-full">
            <div className="flex h-full items-center justify-center overflow-hidden">
              <div className="origin-center scale-[0.94] 3xl:scale-[0.98]">
                <TankAreaScreen data={data} alarmData={alarmData} />
              </div>
            </div>
          </Section>

          <Section title="外部设备" minHeight="h-full">
            <div className="h-full overflow-hidden px-3 py-2">
              <ExternalEquipmentScreen data={data} alarmData={alarmData} />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};
