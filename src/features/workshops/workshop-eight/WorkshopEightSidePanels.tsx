import React from 'react';
import type {ScadaData} from '../../dashboard/model/types';
import {buildWorkshopEightFlowItems} from '../workshopEightDataBindings';
import {WorkshopEightSidePanel} from './WorkshopEightSidePanel';
import './WorkshopEightSidePanels.css';

export function WorkshopEightLeftPanels({data}: { data: ScadaData }) {
    const flowItems = React.useMemo(() => buildWorkshopEightFlowItems(data), [data]);

    return (
        <>
            <WorkshopEightSidePanel data={data} embedded/>
            <WorkshopEightSidePanel
                data={data}
                position="left"
                title="蒸汽流量面板"
                subtitle="MAIN SCREEN FLOW PANEL"
                mode="flow"
                flowItems={flowItems}
                hideFlowName
                embedded
            />
            <WorkshopEightSidePanel
                data={data}
                position="left"
                title="装车可视化面板"
                subtitle="MINGFAN LOADING PANEL"
                mode="loading"
                embedded
            />
        </>
    );
}

export function WorkshopEightRightPanels({data}: { data: ScadaData }) {
    return (
        <>
            <WorkshopEightSidePanel
                data={data}
                position="right"
                title="主画面可视化面板"
                subtitle="MINGFAN MAIN SCREEN"
                mode="temperature"
                embedded
            />
            <WorkshopEightSidePanel
                data={data}
                position="right"
                title="外部设备可视化面板"
                subtitle="MINGFAN EXTERNAL PANEL"
                mode="external"
                embedded
            />
            <WorkshopEightSidePanel
                data={data}
                position="right"
                title="盐酸泄漏数据面板"
                subtitle="MINGFAN HCL LEAK PANEL"
                mode="leak"
                embedded
            />
        </>
    );
}
