import React from 'react';
import { BlankWorkshopView } from './BlankWorkshopView';
import { ExistingWorkshopView } from './ExistingWorkshopView';
import { WorkshopEightView } from './WorkshopEightView';
import type { WorkshopDefinition } from './types';

export const workshopRegistry: WorkshopDefinition[] = [
  {
    id: 'workshop-01',
    name: '聚铝老厂',
    enabled: true,
    hasContent: true,
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
    name: '车间 6',
    enabled: true,
    hasContent: false,
    render: () => <BlankWorkshopView />,
  },
  {
    id: 'workshop-07',
    name: '车间 7',
    enabled: true,
    hasContent: false,
    render: () => <BlankWorkshopView />,
  },
  {
    id: 'workshop-08',
    name: '明矾',
    enabled: true,
    hasContent: true,
    render: (runtime) => <WorkshopEightView {...runtime} />,
  },
];

export const defaultWorkshopId = workshopRegistry.find((item) => item.enabled)?.id ?? workshopRegistry[0]?.id ?? '';
