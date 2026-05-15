import React from 'react';
import { BlankWorkshopView } from './BlankWorkshopView';
import { ExistingWorkshopView } from './ExistingWorkshopView';
import { WorkshopEightView } from './WorkshopEightView';
import { WorkshopSevenView } from './WorkshopSevenView';
import type { WorkshopDefinition } from './types';

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
    name: '车间 2',
    enabled: true,
    hasContent: false,
    render: () => <BlankWorkshopView />,
  },
  {
    id: 'workshop-03',
    name: '车间 3',
    enabled: true,
    hasContent: false,
    render: () => <BlankWorkshopView />,
  },
  {
    id: 'workshop-04',
    name: '车间 4',
    enabled: true,
    hasContent: false,
    render: () => <BlankWorkshopView />,
  },
  {
    id: 'workshop-05',
    name: '车间 5',
    enabled: true,
    hasContent: false,
    render: () => <BlankWorkshopView />,
  },
  {
    id: 'workshop-06',
    name: '聚合硫酸铁',
    enabled: true,
    hasContent: true,
    dataWorkshopIds: ['workshop-06', 'JH_WORKSHOP_06', 'JH_POLYMERIC_FERRIC_SULFATE'],
    dataWorkshopNames: ['聚合硫酸铁', '车间 6', '车间6'],
    alarmNamePrefixes: ['F0101', '聚合硫酸铁', '蒸汽'],
    render: (runtime) => <WorkshopSevenView {...runtime} />,
  },
  {
    id: 'workshop-07',
    name: '液体硫酸铝',
    enabled: true,
    hasContent: true,
    dataWorkshopIds: ['workshop-07', 'JH_WORKSHOP_07', 'JH_LIQUID_ALUMINUM_SULFATE'],
    dataWorkshopNames: ['液体硫酸铝', '车间 7', '车间7'],
    alarmNamePrefixes: ['F0101', '液体硫酸铝', '蒸汽'],
    render: (runtime) => <WorkshopSevenView {...runtime} />,
  },
  {
    id: 'workshop-08',
    name: '明矾',
    enabled: true,
    hasContent: true,
    dataWorkshopIds: ['workshop-08', 'JH_MF'],
    dataWorkshopNames: ['明矾', '明矾车间'],
    alarmNamePrefixes: ['明矾'],
    render: (runtime) => <WorkshopEightView {...runtime} />,
  },
];

export const defaultWorkshopId = workshopRegistry.find((item) => item.enabled)?.id ?? workshopRegistry[0]?.id ?? '';
