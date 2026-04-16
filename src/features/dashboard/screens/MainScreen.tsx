import React from 'react';
import { getAlarmNames, hasAlarm } from '../lib/alarmUtils';
import { AlarmData, ScadaData } from '../model/types';
import { FlowBox, Tank } from '../ui/SharedComponents';

export const MainScreen = ({ data, alarmData }: { data: ScadaData, alarmData: AlarmData }) => {
  const tank1Alarms = getAlarmNames('tank1', alarmData);
  const tank2Alarms = getAlarmNames('tank2', alarmData);
  const acidFlowAlarms = getAlarmNames('acid_flow', alarmData);

  return (
    <div className="relative w-full h-full p-5 flex flex-col overflow-hidden">
      
      {/* 主要内容区域 */}
      <div className="flex-1 flex items-center justify-between gap-10">
        {/* 左侧：反应槽区域 */}
        <div className="flex items-center gap-8">
          {/* 1# 反应槽 */}
          <div className="flex items-center gap-3">
            {tank1Alarms.length > 0 && (
              <div className="flex flex-col gap-1.5 w-max max-w-[180px]">
                {tank1Alarms.map((name, idx) => (
                  <div key={idx} className="rounded border border-red-500 bg-transparent px-3 py-1.5 text-sm font-bold text-red-100 whitespace-nowrap animate-pulse">
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
          
          {/* 2# 反应槽 */}
          <div className="flex items-center gap-3">
            <Tank 
              label="2# 反应槽" 
              level={1.4} 
              temp={data.tank2_temp} 
              variant="reactor"
              hasAlarm={hasAlarm('tank2', alarmData)} 
            />
            {tank2Alarms.length > 0 && (
              <div className="flex flex-col gap-1.5 w-max max-w-[180px]">
                {tank2Alarms.map((name, idx) => (
                  <div key={idx} className="rounded border border-red-500 bg-transparent px-3 py-1.5 text-sm font-bold text-red-100 whitespace-nowrap animate-pulse">
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* 右侧：流量显示区域 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <FlowBox 
              title="盐酸硫酸流量" 
              instant={data.acid_flow_instant} 
              total={data.acid_flow_total} 
              hasAlarm={hasAlarm('acid_flow', alarmData)} 
            />
            {acidFlowAlarms.length > 0 && (
              <div className="flex flex-col gap-1.5 w-max max-w-[180px]">
                {acidFlowAlarms.map((name, idx) => (
                  <div key={idx} className="rounded border border-red-500 bg-transparent px-3 py-1.5 text-sm font-bold text-red-100 whitespace-nowrap animate-pulse">
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <FlowBox title="东氯废水流量" instant={data.waste_flow_instant} total={data.waste_flow_total} />
        </div>
      </div>
      
      <svg className="absolute inset-0 pointer-events-none -z-10 w-full h-full opacity-35">
        <path d="M 170 365 L 980 365" stroke="#7dd3fc" strokeWidth="6" fill="none" strokeDasharray="10 5" />
        <path d="M 355 365 L 355 300" stroke="#7dd3fc" strokeWidth="6" fill="none" />
        <path d="M 725 365 L 725 300" stroke="#7dd3fc" strokeWidth="6" fill="none" />
      </svg>
    </div>
  );
};
