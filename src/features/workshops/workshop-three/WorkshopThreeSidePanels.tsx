import type {ScadaData} from '../../dashboard/model/types';
import {
    WorkshopThreeExternalSidePanel,
    WorkshopThreeLevelSidePanel,
    WorkshopThreeOtherFlowSidePanel,
    WorkshopThreeSteamFlowSidePanel,
    WorkshopThreeLoadingSidePanel,
    WorkshopThreeTemperatureSidePanel,
} from './WorkshopThreeSidePanelBlocks';
import './WorkshopThreeSidePanels.css';

export function WorkshopThreeLeftPanels({data}: { data: ScadaData }) {
    return (
        <>
            <WorkshopThreeLevelSidePanel data={data}/>
            <WorkshopThreeSteamFlowSidePanel data={data}/>
            <WorkshopThreeLoadingSidePanel data={data}/>
        </>
    );
}

export function WorkshopThreeRightPanels({data}: { data: ScadaData }) {
    return (
        <>
            <WorkshopThreeTemperatureSidePanel data={data}/>
            <WorkshopThreeExternalSidePanel data={data}/>
            <WorkshopThreeOtherFlowSidePanel data={data}/>
        </>
    );
}
