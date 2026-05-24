const fs = require('fs');
const path = require('path');

const specs = [
    {
        num: 'Four',
        n: '4',
        left: ['flowFixed', 'levelStatic', 'loading'],
        right: ['flowFixed', 'externalStatic', 'loading'],
    },
    {
        num: 'Five',
        n: '5',
        left: ['flowFixed', 'levelStatic', 'loading'],
        right: ['temperatureStatic', 'externalStatic', 'loading'],
    },
    {
        num: 'Six',
        n: '6',
        left: ['flowFixed', 'levelStatic', 'loading'],
        right: ['temperatureStatic', 'externalStatic', 'loading'],
    },
    {
        num: 'Seven',
        n: '7',
        left: ['flowFixed', 'levelStatic', 'loading'],
        right: ['temperatureStatic', 'externalStatic', 'loading'],
    },
];

const root = path.join(__dirname, '..', 'src', 'features', 'workshops');

for (const spec of specs) {
    const w = spec.num;
    const prefix = `w${spec.n}`;
    const leftExports = spec.left.map((kind) => {
        if (kind === 'flowFixed') return `Workshop${w}FixedFlowSidePanel`;
        if (kind === 'levelStatic') return `Workshop${w}StaticLevelSidePanel`;
        return `Workshop${w}LoadingSidePanel`;
    });
    const rightExports = spec.right.map((kind) => {
        if (kind === 'flowFixed') return `Workshop${w}FixedFlowSidePanel`;
        if (kind === 'temperatureStatic') return `Workshop${w}StaticTemperatureSidePanel`;
        if (kind === 'externalStatic') return `Workshop${w}StaticExternalSidePanel`;
        return `Workshop${w}RightLoadingSidePanel`;
    });

    const panelsTs = `import type {ScadaData} from '../../dashboard/model/types';
import {${[...new Set([...leftExports, ...rightExports])].join(', ')}} from './Workshop${w}SidePanelBlocks';
import './Workshop${w}SidePanels.css';

export function Workshop${w}LeftPanels({data}: { data: ScadaData }) {
    return (
        <>
${leftExports.map((e) => `            <${e} data={data}/>`).join('\n')}
        </>
    );
}

export function Workshop${w}RightPanels({data}: { data: ScadaData }) {
    return (
        <>
${rightExports.map((e) => `            <${e} data={data}/>`).join('\n')}
        </>
    );
}
`;

    fs.writeFileSync(path.join(root, `workshop-${spec.n === '4' ? 'four' : spec.n === '5' ? 'five' : spec.n === '6' ? 'six' : 'seven'}`, `Workshop${w}SidePanels.tsx`), panelsTs);
}

console.log('Generated SidePanels for 4-7');
