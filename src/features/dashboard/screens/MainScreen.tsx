import React from 'react';
import {hasAlarm} from '../lib/alarmUtils';
import {AlarmData, ScadaData} from '../model/types';
import {FlowBox, Tank} from '../ui/SharedComponents';

export const MainScreen = ({data, alarmData}: { data: ScadaData, alarmData: AlarmData }) => {
    return (
        <div className="-translate-y-6 relative h-full w-full overflow-visible px-3 py-2 xl:px-4 xl:py-3">
            <div
                className="grid h-full min-h-0 grid-cols-[minmax(0,1.55fr)_minmax(220px,0.95fr)] items-center gap-4 xl:gap-5">
                <div className="flex min-w-0 translate-y-6 items-center justify-center gap-4 xl:gap-5">
                    <div className="flex min-w-0 items-center gap-2">
                        <Tank
                            label="1# 反应槽"
                            level={1.5}
                            temp={data.tank1_temp}
                            variant="reactor"
                            reactorSizeClassName="h-[16rem]"
                            reactorBaselineClassName="-translate-y-[68px]"
                        />
                    </div>

                    <div className="flex min-w-0 items-center gap-2">
                        <Tank
                            label="2# 反应槽"
                            level={1.4}
                            temp={data.tank2_temp}
                            variant="reactor"
                            reactorSizeClassName="h-[16rem]"
                            reactorBaselineClassName="-translate-y-[68px]"
                        />
                    </div>
                </div>
                {/* 主画面瞬时流量区域调整 translate-y-6*/}
                <div className="-translate-y-4 flex min-h-0 min-w-0 flex-col justify-center gap-2.5">
                    <div className="flex min-w-0 items-start gap-2">
                        <FlowBox
                            title="盐酸硫酸流量"
                            instant={data.acid_flow_instant}
                            total={data.acid_flow_total}
                            hasAlarm={hasAlarm('acid_flow', alarmData)}
                            thickBorder
                        />
                    </div>
                    <FlowBox
                        title="东氯废水流量"
                        instant={data.waste_flow_instant}
                        total={data.waste_flow_total}
                        thickBorder
                    />
                </div>
            </div>
        </div>
    );
};
