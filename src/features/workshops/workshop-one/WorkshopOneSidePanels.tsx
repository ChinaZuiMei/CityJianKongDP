import type {ScadaData} from '../../dashboard/model/types';
import {WorkshopOneSidePanel} from './WorkshopOneSidePanel';
import './WorkshopOneSidePanels.css';

export function WorkshopOneLeftPanels({data}: { data: ScadaData }) {
    return (
        <>
            <WorkshopOneSidePanel data={data} embedded/>
            <WorkshopOneSidePanel
                data={data}
                position="left"
                title="主画面流量面板"
                subtitle="TANK FLOW PANEL"
                mode="flow"
                embedded
            />
            <WorkshopOneSidePanel
                data={data}
                position="left"
                title="装车可视化面板"
                subtitle="LOADING VISUALIZATION PANEL"
                mode="loading"
                embedded
            />
        </>
    );
}

export function WorkshopOneRightPanels({data}: { data: ScadaData }) {
    return (
        <>
            <WorkshopOneSidePanel
                data={data}
                position="right"
                title="主画面可视化面板"
                subtitle="MAIN SCREEN VISUALIZATION"
                mode="temperature"
                embedded
            />
            <WorkshopOneSidePanel
                data={data}
                position="right"
                title="外部设备可视化面板"
                subtitle="EXTERNAL EQUIPMENT PANEL"
                mode="external"
                embedded
            />
            <WorkshopOneSidePanel
                data={data}
                position="right"
                title="盐酸泄漏数据面板"
                subtitle="HCL LEAK DATA PANEL"
                mode="leak"
                embedded
            />
        </>
    );
}
