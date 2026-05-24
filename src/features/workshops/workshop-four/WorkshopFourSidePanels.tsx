import type {ScadaData} from '../../dashboard/model/types';
import {
    WorkshopFourLeftFlowPanel,
    WorkshopFourLeftLevelPanel,
    WorkshopFourLeftLoadingPanel,
    WorkshopFourRightExternalPanel,
    WorkshopFourRightFlowPanel,
    WorkshopFourRightLoadingPanel,
} from './WorkshopFourSidePanelBlocks';
import './WorkshopFourSidePanels.css';

export function WorkshopFourLeftPanels({data}: { data: ScadaData }) {
    return (
        <>
            <WorkshopFourLeftFlowPanel data={data}/>
            <WorkshopFourLeftLevelPanel/>
            <WorkshopFourLeftLoadingPanel data={data}/>
        </>
    );
}

export function WorkshopFourRightPanels({data}: { data: ScadaData }) {
    return (
        <>
            <WorkshopFourRightFlowPanel data={data}/>
            <WorkshopFourRightExternalPanel/>
            <WorkshopFourRightLoadingPanel data={data}/>
        </>
    );
}
