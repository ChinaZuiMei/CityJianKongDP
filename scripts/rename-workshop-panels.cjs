const fs = require('fs');
const path = require('path');

const workshops = [
    {dir: 'workshop-three', num: 'Three', n: '3', two: 'Two'},
    {dir: 'workshop-four', num: 'Four', n: '4', two: 'Two'},
    {dir: 'workshop-five', num: 'Five', n: '5', two: 'Two'},
    {dir: 'workshop-six', num: 'Six', n: '6', two: 'Two'},
    {dir: 'workshop-seven', num: 'Seven', n: '7', two: 'Two'},
];

const root = path.join(__dirname, '..', 'src', 'features', 'workshops');

for (const ws of workshops) {
    const dir = path.join(root, ws.dir);
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const newName = file
            .replace(/WorkshopTwo/g, `Workshop${ws.num}`)
            .replace(/workshopTwo/g, `workshop${ws.num}`)
            .replace(/workshop-two/g, ws.dir);
        if (newName !== file) {
            fs.renameSync(path.join(dir, file), path.join(dir, newName));
        }
    }
    const renamed = fs.readdirSync(dir);
    for (const file of renamed) {
        const fp = path.join(dir, file);
        if (!file.endsWith('.ts') && !file.endsWith('.css')) continue;
        let content = fs.readFileSync(fp, 'utf8');
        content = content
            .replace(/WorkshopTwo/g, `Workshop${ws.num}`)
            .replace(/workshopTwo/g, `workshop${ws.num}`)
            .replace(/WORKSHOP_TWO/g, `WORKSHOP_${ws.num.toUpperCase()}`)
            .replace(/w2-side-panel/g, `w${ws.n}-side-panel`)
            .replace(/workshopTwoDataBindings/g, `workshop${ws.num}DataBindings`)
            .replace(/\.\.\/workshopTwoDataBindings/g, `../workshop${ws.num}DataBindings`);
        fs.writeFileSync(fp, content);
    }
}

console.log('Renamed workshop panel folders 3-7');
