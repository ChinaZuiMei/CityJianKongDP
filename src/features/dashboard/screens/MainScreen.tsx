import React from 'react';
import { hasAlarm } from '../lib/alarmUtils';
import { AlarmData, ScadaData } from '../model/types';
import { FlowBox, Tank } from '../ui/SharedComponents';

export const MainScreen = ({ data, alarmData }: { data: ScadaData, alarmData: AlarmData }) => {
  return (
    <div className="-translate-y-11 relative h-full w-full overflow-hidden px-3 py-2 xl:px-4 xl:py-3">
      <div className="grid h-full min-h-0 grid-cols-[minmax(0,1.55fr)_minmax(220px,0.95fr)] items-center gap-4 xl:gap-5">
        <div className="flex min-w-0 items-center justify-center gap-4 xl:gap-5">
          <div className="flex min-w-0 items-center gap-2">
            <Tank 
              label="1# 反应槽" 
              level={1.5} 
              temp={data.tank1_temp} 
              variant="reactor"
            />
          </div>
          
          <div className="flex min-w-0 items-center gap-2">
            <Tank 
              label="2# 反应槽" 
              level={1.4} 
              temp={data.tank2_temp} 
              variant="reactor"
            />
          </div>
        </div>
        {/* 主画面瞬时流量区域调整 translate-y-6*/}
        <div className="-translate-y-8 flex min-h-0 min-w-0 flex-col justify-center gap-2.5">
          <div className="flex min-w-0 items-start gap-2">
            <FlowBox 
              title="盐酸硫酸流量" 
              instant={data.acid_flow_instant} 
              total={data.acid_flow_total} 
              hasAlarm={hasAlarm('acid_flow', alarmData)} 
            />
          </div>
          <FlowBox title="东氯废水流量" instant={data.waste_flow_instant} total={data.waste_flow_total} />
        </div>
      </div>
      <svg className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-35" preserveAspectRatio="none">
        {/* 虚线贴近反应槽图片正下方，保持两侧反应槽垂直对齐 */}
        <line x1="16%" y1="75%" x2="54%" y2="75%" stroke="#7dd3fc" strokeWidth="5" strokeDasharray="10 5" />
        <line x1="24%" y1="75%" x2="24%" y2="55%" stroke="#7dd3fc" strokeWidth="5" />
        <line x1="47%" y1="75%" x2="47%" y2="55%" stroke="#7dd3fc" strokeWidth="5" />
      </svg>
    </div>
  );
};
