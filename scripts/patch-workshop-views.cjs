const fs = require('fs');
const path = require('path');

const specs = [
    {file: 'WorkshopFourView.tsx', num: 'Four', n: '4', importPath: './workshop-four'},
    {file: 'WorkshopFiveView.tsx', num: 'Five', n: '5', importPath: './workshop-five'},
    {file: 'WorkshopSixView.tsx', num: 'Six', n: '6', importPath: './workshop-six'},
    {file: 'WorkshopSevenView.tsx', num: 'Seven', n: '7', importPath: './workshop-seven'},
];

const root = path.join(__dirname, '..', 'src', 'features', 'workshops');

for (const spec of specs) {
    const fp = path.join(root, spec.file);
    let content = fs.readFileSync(fp, 'utf8');
    content = content.replace(
        /import \{TankDataPanel\} from '\.\.\/dashboard\/components\/TankDataPanel';\n/,
        `import {Workshop${spec.num}LeftPanels, Workshop${spec.num}RightPanels} from '${spec.importPath}';\n`,
    );
    content = content.replace(/side-panel-toggle/g, `w${spec.n}-side-panel-toggle`);
    content = content.replace(/tank-data-column/g, `w${spec.n}-side-panel-column`);
    const leftBlock = /            <div\n                className=\{leftPanelCollapsed \? `w\d-side-panel-column[\s\S]*?            <\/div>\n\n            <button\n                type="button"\n                className=\{rightPanelCollapsed/;
    content = content.replace(leftBlock, (match) => {
        const prefix = match.split('<button')[0].replace(/<TankDataPanel[\s\S]*$/m, '').trimEnd();
        return `            <div
                className={leftPanelCollapsed ? \`w${spec.n}-side-panel-column w${spec.n}-side-panel-column--left w${spec.n}-side-panel-column--collapsed-left\` : \`w${spec.n}-side-panel-column w${spec.n}-side-panel-column--left\`}>
                <Workshop${spec.num}LeftPanels data={scadaData}/>
            </div>

            <button
                type="button"
                className={rightPanelCollapsed`;
    });
    // simpler: remove all TankDataPanel blocks
    content = content.replace(/<TankDataPanel[\s\S]*?\/>\n/g, '');
    // fix left/right columns if empty - read file and manual fix if needed
    fs.writeFileSync(fp, content);
}

console.log('Patched views - verify manually');
