import type {ScadaData} from '../../dashboard/model/types';
import {
    WorkshopFiveLeftFlowPanel,
    WorkshopFiveLeftLevelPanel,
    WorkshopFiveLeftLoadingPanel,
    WorkshopFiveRightExternalPanel,
    WorkshopFiveRightLoadingPanel,
    WorkshopFiveRightTemperaturePanel,
} from './WorkshopFiveSidePanelBlocks';
import './WorkshopFiveSidePanels.css';

export function WorkshopFiveLeftPanels({data}: { data: ScadaData }) {
    return (
        <>
            <WorkshopFiveLeftFlowPanel data={data}/>
            <WorkshopFiveLeftLevelPanel/>
            <WorkshopFiveLeftLoadingPanel data={data}/>
        </>
    );
}

export function WorkshopFiveRightPanels({data}: { data: ScadaData }) {
    return (
        <>
            <WorkshopFiveRightTemperaturePanel data={data}/>
            <WorkshopFiveRightExternalPanel data={data}/>
            <WorkshopFiveRightLoadingPanel data={data}/>
        </>
    );
}


