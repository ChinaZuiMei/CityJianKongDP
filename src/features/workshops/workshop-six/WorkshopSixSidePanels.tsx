import type {ScadaData} from '../../dashboard/model/types';
import {
    WorkshopSixLeftFlowPanel,
    WorkshopSixLeftLevelPanel,
    WorkshopSixLeftLoadingPanel,
    WorkshopSixRightExternalPanel,
    WorkshopSixRightLoadingPanel,
    WorkshopSixRightTemperaturePanel,
} from './WorkshopSixSidePanelBlocks';
import './WorkshopSixSidePanels.css';

export function WorkshopSixLeftPanels({data}: { data: ScadaData }) {
    return (
        <>
            <WorkshopSixLeftFlowPanel/>
            <WorkshopSixLeftLevelPanel/>
            <WorkshopSixLeftLoadingPanel data={data}/>
        </>
    );
}

export function WorkshopSixRightPanels({data}: { data: ScadaData }) {
    return (
        <>
            <WorkshopSixRightTemperaturePanel/>
            <WorkshopSixRightExternalPanel/>
            <WorkshopSixRightLoadingPanel data={data}/>
        </>
    );
}

