import type {ScadaData} from '../../dashboard/model/types';
import {
    WorkshopTwoExternalSidePanel,
    WorkshopTwoFlowSidePanel,
    WorkshopTwoLeakSidePanel,
    WorkshopTwoLoadingSidePanel,
    WorkshopTwoRightLoadingSidePanel,
    WorkshopTwoTemperatureSidePanel,
} from './WorkshopTwoSidePanelBlocks';
import './WorkshopTwoSidePanels.css';

export function WorkshopTwoLeftPanels({data}: { data: ScadaData }) {
    return (
        <>
            <WorkshopTwoLeakSidePanel data={data}/>
            <WorkshopTwoFlowSidePanel data={data}/>
            <WorkshopTwoLoadingSidePanel data={data}/>
        </>
    );
}

export function WorkshopTwoRightPanels({data}: { data: ScadaData }) {
    return (
        <>
            <WorkshopTwoTemperatureSidePanel data={data}/>
            <WorkshopTwoExternalSidePanel data={data}/>
            <WorkshopTwoRightLoadingSidePanel data={data}/>
        </>
    );
}
