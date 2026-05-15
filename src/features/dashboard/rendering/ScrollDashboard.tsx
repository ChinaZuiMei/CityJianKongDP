import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ALARM_MAPPING, formatAlarmDisplayName } from '../lib/alarmUtils';
import type { AlarmData, ScadaData } from '../model/types';
import { ExternalEquipmentScreen } from '../screens/ExternalEquipmentScreen';
import { MainScreen } from '../screens/MainScreen';
import { TankAreaScreen } from '../screens/TankAreaScreen';

type RegionId = 'main' | 'tanks' | 'oldPlant' | 'drum';

type RegionAlarm = {
  key: string;
  title: string;
  label: string;
  level: string;
};

const REGION_ROTATE_MS = 3000;

const buildAlarmGroups = (alarms: RegionAlarm[]) => {
  if (alarms.length === 0) {
    return [[
      { key: 'placeholder-1', title: '当前区域暂无活动报警', label: '系统巡检', level: '正常' },
      { key: 'placeholder-2', title: '当前区域暂无活动报警', label: '系统巡检', level: '正常' },
      { key: 'placeholder-3', title: '当前区域暂无活动报警', label: '系统巡检', level: '正常' },
    ]];
  }

  const groups: RegionAlarm[][] = [];

  for (let index = 0; index < alarms.length; index += 3) {
    const group = alarms.slice(index, index + 3);
    while (group.length < 3) {
      group.push({
        key: `placeholder-${index}-${group.length}`,
        title: '当前区域暂无更多报警',
        label: '系统巡检',
        level: '待监测',
      });
    }
    groups.push(group);
  }

  return groups;
};

const getRegionForAlarm = (alarmName: string): RegionId | null => {
  if (alarmName.startsWith('老厂')) return 'oldPlant';
  if (alarmName.startsWith('滚筒')) return 'drum';

  const mapping = ALARM_MAPPING[alarmName];
  if (!mapping) return null;
  if (mapping.screen === 'main') return 'main';
  if (mapping.screen === 'tanks') return 'tanks';
  return null;
};

export const ScrollDashboard = ({
  data,
  alarmData,
  sidePanelPreviewEnabled = false,
  hideRegionBody = false,
}: {
  data: ScadaData;
  alarmData: AlarmData;
  sidePanelPreviewEnabled?: boolean;
  hideRegionBody?: boolean;
}) => {
  const outerClassName = sidePanelPreviewEnabled ? 'pl-[420px] pr-[420px]' : '';
  const [scale, setScale] = useState(0.92);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [activeRegionIndex, setActiveRegionIndex] = useState(0);
  const [activeAlarmGroupIndex, setActiveAlarmGroupIndex] = useState(0);
  const [regionDirection, setRegionDirection] = useState(1);
  const dragStartRef = useRef<{ x: number; y: number; originX: number; originY: number } | null>(null);

  const regions = useMemo(() => ([
    {
      id: 'main' as const,
      title: '反应槽区',
      subtitle: 'REACTOR AREA',
      bodyClassName: 'items-center justify-center pt-16',
      scaleClassName: 'dashboard-module-scale dashboard-module-scale--main',
      contentClassName: 'w-full max-w-[1000px]',
      render: () => <MainScreen data={data} alarmData={alarmData} />,
    },
    {
      id: 'tanks' as const,
      title: '罐区',
      subtitle: 'TANK AREA',
      bodyClassName: 'items-end justify-center px-2 pt-12',
      scaleClassName: 'dashboard-module-scale dashboard-module-scale--tank',
      contentClassName: 'w-full max-w-[950px]',
      render: () => <TankAreaScreen data={data} alarmData={alarmData} hideTankAlarmOverlay />,
    },
    {
      id: 'oldPlant' as const,
      title: '外部设备-聚铝老厂',
      subtitle: 'EXTERNAL EQUIPMENT OLD PLANT',
      bodyClassName: 'items-center justify-center px-2 pt-[5.5rem]',
      scaleClassName: 'dashboard-module-scale dashboard-module-scale--external',
      contentClassName: 'w-full max-w-[1040px]',
      render: () => <ExternalEquipmentScreen data={data} alarmData={alarmData} section="oldPlant" />,
    },
    {
      id: 'drum' as const,
      title: '外部设备-滚筒干燥',
      subtitle: 'EXTERNAL EQUIPMENT DRUM DRYING',
      bodyClassName: 'items-center justify-center px-2 pt-[5.5rem]',
      scaleClassName: 'dashboard-module-scale dashboard-module-scale--external',
      contentClassName: 'w-full max-w-[1040px]',
      render: () => <ExternalEquipmentScreen data={data} alarmData={alarmData} section="drum" />,
    },
  ]), [alarmData, data]);

  const alarmsByRegion = useMemo(() => {
    const grouped: Record<RegionId, RegionAlarm[]> = {
      main: [],
      tanks: [],
      oldPlant: [],
      drum: [],
    };

    Object.entries(alarmData).forEach(([alarmName, isActive]) => {
      if (!isActive) return;
      const regionId = getRegionForAlarm(alarmName);
      if (!regionId) return;

      const mapping = ALARM_MAPPING[alarmName];
      grouped[regionId].push({
        key: alarmName,
        title: formatAlarmDisplayName(alarmName),
        label: mapping?.label ?? regions.find((region) => region.id === regionId)?.title ?? '未知设备',
        level: alarmName.includes('高') ? '高优先' : alarmName.includes('低') ? '低优先' : '活动中',
      });
    });

    return grouped;
  }, [alarmData, regions]);

  const activeRegion = regions[activeRegionIndex] ?? regions[0];
  const bodyRegions = useMemo(() => [...regions].reverse(), [regions]);
  const bodyRegionIndex = regions.length - 1 - activeRegionIndex;
  const activeAlarmGroups = useMemo(
    () => buildAlarmGroups(alarmsByRegion[activeRegion.id]),
    [activeRegion.id, alarmsByRegion],
  );

  useEffect(() => {
    if (regions.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setActiveRegionIndex((current) => {
        const next = current + regionDirection;
        if (next >= regions.length) {
          setRegionDirection(-1);
          return Math.max(regions.length - 2, 0);
        }
        if (next < 0) {
          setRegionDirection(1);
          return 1;
        }
        return next;
      });
      setActiveAlarmGroupIndex((current) => current + 1);
    }, REGION_ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [regionDirection, regions.length]);

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
          <div className="mx-auto h-[760px] w-[1040px] max-w-full overflow-hidden">
            <div className="relative mx-auto h-full w-full">
              <div className="absolute inset-x-[72px] top-[42px] z-10 overflow-hidden">
                <div
                  className="flex transition-transform duration-700 ease-out"
                  style={{ transform: `translateX(-${activeRegionIndex * 100}%)` }}
                >
                  {regions.map((region) => {
                    const groups = buildAlarmGroups(alarmsByRegion[region.id]);
                    const group = groups[activeAlarmGroupIndex % groups.length] ?? groups[0];

                    return (
                      <div key={region.id} className="min-w-full">
                        <div className="grid grid-cols-3 gap-4">
                          {group.map((alarm) => {
                            const isPlaceholder = alarm.key.startsWith('placeholder-');
                            return (
                              <div
                                key={alarm.key}
                                className={isPlaceholder
                                  ? 'flex h-[150px] flex-col justify-between rounded-[14px] border border-red-400/65 bg-transparent px-6 py-5'
                                  : 'flex h-[150px] flex-col justify-between rounded-[14px] border border-red-400/90 bg-transparent px-6 py-5'}
                              >
                                <div className="text-red-100">
                                  <span className="text-xs font-black tracking-[0.16em]">
                                    {isPlaceholder ? 'ALARM SLOT' : alarm.level}
                                  </span>
                                </div>
                                <div className={isPlaceholder ? 'text-[1.6rem] font-black tracking-[0.02em] text-red-100/68' : 'text-[1.6rem] font-black tracking-[0.02em] text-red-50'}>
                                  {alarm.title}
                                </div>
                                <div className="text-[13px] font-semibold tracking-[0.08em] text-red-100/72">
                                  {alarm.label}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="pointer-events-none mt-7 flex items-center justify-center gap-4 text-base font-black tracking-[0.24em] text-sky-100/62">
                          <span>{region.title}</span>
                          <span className="h-px w-12 bg-sky-200/28" aria-hidden />
                          <span>{region.subtitle}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {!hideRegionBody ? (
                <div className="absolute inset-x-0 bottom-0 top-[282px] overflow-hidden">
                  <div
                    className="flex h-full transition-transform duration-1000 ease-out"
                    style={{ transform: `translateX(-${bodyRegionIndex * 100}%)` }}
                  >
                    {bodyRegions.map((region) => (
                      <div key={region.id} className="flex min-w-full flex-col">
                        <div className={`flex h-full overflow-visible ${region.bodyClassName}`}>
                          <div className={region.scaleClassName}>
                            <div className={region.contentClassName}>
                              {region.render()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
