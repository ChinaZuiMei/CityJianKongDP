import React from 'react';
import {BlankWorkshopView} from './BlankWorkshopView';
import {ExistingWorkshopView} from './ExistingWorkshopView';
import {WorkshopEightView} from './WorkshopEightView';
import {WorkshopFourView} from './WorkshopFourView';
import {WorkshopFiveView} from './WorkshopFiveView';
import {WorkshopSixView} from './WorkshopSixView';
import {WorkshopSevenView} from './WorkshopSevenView';
import {WorkshopThreeView} from './WorkshopThreeView';
import {WorkshopTwoView} from './WorkshopTwoView';
import type {WorkshopDefinition} from './types';

export const workshopRegistry: WorkshopDefinition[] = [
    {
        id: 'workshop-01',
        name: '聚铝老厂',
        enabled: true,
        hasContent: true,
        dataWorkshopIds: ['JH_JL_OLD'],
        dataWorkshopNames: ['聚铝老厂'],
        alarmNamePrefixes: ['反应槽', '盐酸', '1#盐酸', '2#盐酸', '3#盐酸', '1#硫酸', '1#泄漏', '2#泄漏', '3#泄漏', '老厂', '滚筒'],
        render: (runtime) => <ExistingWorkshopView {...runtime} />,
    },
    {
        id: 'workshop-02',
        name: '新聚铝液位',
        enabled: true,
        hasContent: true,
        dataWorkshopIds: ['workshop-02', 'XJLYW', 'JH_XJLYW'],
        dataWorkshopNames: ['新聚铝液位'],
        alarmNamePrefixes: ['盐酸罐', '泄漏检测'],
        render: (runtime) => <WorkshopTwoView {...runtime} />,
    },
    {
        id: 'workshop-03',
        name: '新聚铝反应',
        enabled: true,
        hasContent: true,
        dataWorkshopIds: ['workshop-03', 'XJLFY', 'JH_XJLFY'],
        dataWorkshopNames: ['新聚铝反应'],
        alarmNamePrefixes: ['地下反应槽', '铁锅反应釜', '玻璃钢反应釜', '搪瓷反应釜', '聚铝尾气', '低铁尾气', '新聚铝反应蒸汽', '低铁无铁蒸汽'],
        render: (runtime) => <WorkshopThreeView {...runtime} />,
    },
    {
        id: 'workshop-04',
        name: '聚铝新厂喷雾干燥',
        enabled: true,
        hasContent: true,
        dataWorkshopIds: ['workshop-04', 'JLXCGZ', 'JH_JLXCGZ'],
        dataWorkshopNames: ['聚铝新厂喷雾干燥', '聚铝新厂干燥'],
        alarmNamePrefixes: ['反应釜', '福邦'],
        render: (runtime) => <WorkshopFourView {...runtime} />,
    },
    {
        id: 'workshop-05',
        name: '低铁硫酸铝',
        enabled: true,
        hasContent: true,
        dataWorkshopIds: ['workshop-05', 'DTLSL', 'JH_DTLSL'],
        dataWorkshopNames: ['低铁硫酸铝'],
        alarmNamePrefixes: ['反应釜', '包装'],
        render: (runtime) => <WorkshopFiveView {...runtime} />,
    },
    {
        id: 'workshop-06',
        name: '聚合硫酸铁',
        enabled: true,
        hasContent: true,
        dataWorkshopIds: ['workshop-06', 'JLLST', 'JH_JLLST'],
        dataWorkshopNames: ['聚合硫酸铁', '聚铝硫酸铁'],
        alarmNamePrefixes: ['釜', '硫酸罐', '盐酸罐', '地下罐', '液氮', '稀硫酸'],
        render: (runtime) => <WorkshopSixView {...runtime} />,
    },
    {
        id: 'workshop-07',
        name: '液体硫酸铝',
        enabled: true,
        hasContent: true,
        dataWorkshopIds: ['workshop-07', 'YTLSL', 'JH_YTLSL'],
        dataWorkshopNames: ['液体硫酸铝'],
        alarmNamePrefixes: ['反应釜', '蒸汽'],
        render: (runtime) => <WorkshopSevenView {...runtime} />,
    },
    {
        id: 'workshop-08',
        name: '明矾',
        enabled: true,
        hasContent: true,
        dataWorkshopIds: ['workshop-08', 'MFCJ', 'JH_MFCJ', 'JH_MF'],
        dataWorkshopNames: ['明矾', '明矾车间'],
        alarmNamePrefixes: ['明矾', '反应釜', '聚铝老厂'],
        render: (runtime) => <WorkshopEightView {...runtime} />,
    },
];

export const defaultWorkshopId = workshopRegistry.find((item) => item.enabled)?.id ?? workshopRegistry[0]?.id ?? '';
