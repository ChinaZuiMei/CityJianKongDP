import React from 'react';
import { getAlarmNames, hasAlarm } from '../lib/alarmUtils';
import { AlarmData, ScadaData } from '../model/types';
import { FlowBox, Tank } from '../ui/SharedComponents';

export const MainScreen = ({ data, alarmData }: { data: ScadaData, alarmData: AlarmData }) => {
  const tank1Alarms = getAlarmNames('tank1', alarmData);
  const tank2Alarms = getAlarmNames('tank2', alarmData);
  const acidFlowAlarms = getAlarmNames('acid_flow', alarmData);

  return (
    <div className="relative h-full w-full overflow-hidden px-3 py-2 xl:px-4 xl:py-3">
      <div className="grid h-full min-h-0 grid-cols-[minmax(0,1.55fr)_minmax(220px,0.95fr)] items-center gap-4 xl:gap-5">
        <div className="flex min-w-0 items-center justify-center gap-4 xl:gap-5">
          <div className="flex min-w-0 items-center gap-2">
            {tank1Alarms.length > 0 && (
              <div className="flex max-w-[85px] flex-col gap-1 xl:max-w-[95px]">
                {tank1Alarms.map((name, idx) => (
                  <div key={idx} className="truncate rounded border border-red-500 bg-transparent px-1.5 py-0.5 text-[9px] font-bold text-red-100 animate-pulse xl:text-[10px]">
                    {name}
                  </div>
                ))}
              </div>
            )}
            <Tank 
              label="1# 反应槽" 
              level={1.5} 
              temp={data.tank1_temp} 
              variant="reactor"
              hasAlarm={hasAlarm('tank1', alarmData)} 
            />
          </div>
          
          <div className="flex min-w-0 items-center gap-2">
            <Tank 
              label="2# 反应槽" 
              level={1.4} 
              temp={data.tank2_temp} 
              variant="reactor"
              hasAlarm={hasAlarm('tank2', alarmData)} 
            />
            {tank2Alarms.length > 0 && (
              <div className="flex max-w-[85px] flex-col gap-1 xl:max-w-[95px]">
                {tank2Alarms.map((name, idx) => (
                  <div key={idx} className="truncate rounded border border-red-500 bg-transparent px-1.5 py-0.5 text-[9px] font-bold text-red-100 animate-pulse xl:text-[10px]">
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex min-h-0 min-w-0 flex-col justify-center gap-2.5">
          <div className="flex min-w-0 items-start gap-2">
            <FlowBox 
              title="盐酸硫酸流量" 
              instant={data.acid_flow_instant} 
              total={data.acid_flow_total} 
              hasAlarm={hasAlarm('acid_flow', alarmData)} 
            />
            {acidFlowAlarms.length > 0 && (
              <div className="flex max-w-[75px] flex-col gap-1 xl:max-w-[85px]">
                {acidFlowAlarms.map((name, idx) => (
                  <div key={idx} className="truncate rounded border border-red-500 bg-transparent px-1.5 py-0.5 text-[9px] font-bold text-red-100 animate-pulse xl:text-[10px]">
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <FlowBox title="东氯废水流量" instant={data.waste_flow_instant} total={data.waste_flow_total} />
        </div>
      </div>
      <svg className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-35" preserveAspectRatio="none">
        {/* 虚线位置：向上微调，和下方模块对齐 */}
        <line x1="18%" y1="72%" x2="88%" y2="72%" stroke="#7dd3fc" strokeWidth="5" strokeDasharray="10 5" />
        <line x1="34%" y1="72%" x2="34%" y2="55%" stroke="#7dd3fc" strokeWidth="5" />
        <line x1="57%" y1="72%" x2="57%" y2="55%" stroke="#7dd3fc" strokeWidth="5" />
      </svg>
    </div>
  );
};
