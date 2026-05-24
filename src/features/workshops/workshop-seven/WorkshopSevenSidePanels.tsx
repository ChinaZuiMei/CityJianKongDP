import type {ScadaData} from '../../dashboard/model/types';
import {
    WorkshopSevenLeftFlowPanel,
    WorkshopSevenLeftLevelPanel,
    WorkshopSevenLeftLoadingPanel,
    WorkshopSevenRightExternalPanel,
    WorkshopSevenRightLoadingPanel,
    WorkshopSevenRightTemperaturePanel,
} from './WorkshopSevenSidePanelBlocks';
import './WorkshopSevenSidePanels.css';

export function WorkshopSevenLeftPanels({data}: { data: ScadaData }) {
    return (
        <>
            <WorkshopSevenLeftFlowPanel data={data}/>
            <WorkshopSevenLeftLevelPanel/>
            <WorkshopSevenLeftLoadingPanel data={data}/>
        </>
    );
}

export function WorkshopSevenRightPanels({data}: { data: ScadaData }) {
    return (
        <>
            <WorkshopSevenRightTemperaturePanel data={data}/>
            <WorkshopSevenRightExternalPanel data={data}/>
            <WorkshopSevenRightLoadingPanel data={data}/>
        </>
    );
}


