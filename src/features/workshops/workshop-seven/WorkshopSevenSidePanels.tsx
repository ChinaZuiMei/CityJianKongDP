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
            <WorkshopSevenLeftFlowPanel/>
            <WorkshopSevenLeftLevelPanel/>
            <WorkshopSevenLeftLoadingPanel data={data}/>
        </>
    );
}

export function WorkshopSevenRightPanels({data}: { data: ScadaData }) {
    return (
        <>
            <WorkshopSevenRightTemperaturePanel/>
            <WorkshopSevenRightExternalPanel/>
            <WorkshopSevenRightLoadingPanel data={data}/>
        </>
    );
}


