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
            <WorkshopSixLeftFlowPanel data={data}/>
            <WorkshopSixLeftLevelPanel data={data}/>
            <WorkshopSixLeftLoadingPanel data={data}/>
        </>
    );
}

export function WorkshopSixRightPanels({data}: { data: ScadaData }) {
    return (
        <>
            <WorkshopSixRightTemperaturePanel data={data}/>
            <WorkshopSixRightExternalPanel data={data}/>
            <WorkshopSixRightLoadingPanel data={data}/>
        </>
    );
}
