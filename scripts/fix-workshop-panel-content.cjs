const fs = require('fs');
const path = require('path');

const workshops = [
    {dir: 'workshop-three', num: 'Three', n: '3'},
    {dir: 'workshop-four', num: 'Four', n: '4'},
    {dir: 'workshop-five', num: 'Five', n: '5'},
    {dir: 'workshop-six', num: 'Six', n: '6'},
    {dir: 'workshop-seven', num: 'Seven', n: '7'},
];

const root = path.join(__dirname, '..', 'src', 'features', 'workshops');

for (const ws of workshops) {
    const dir = path.join(root, ws.dir);
    for (const file of fs.readdirSync(dir)) {
        const fp = path.join(dir, file);
        if (!fs.statSync(fp).isFile()) continue;
        let content = fs.readFileSync(fp, 'utf8');
        content = content
            .replace(/WorkshopTwo/g, `Workshop${ws.num}`)
            .replace(/workshopTwo/g, `workshop${ws.num}`)
            .replace(/WORKSHOP_TWO/g, `WORKSHOP_${ws.num.toUpperCase()}`)
            .replace(/w2-side-panel/g, `w${ws.n}-side-panel`)
            .replace(/workshop-two/g, ws.dir);
        fs.writeFileSync(fp, content);
    }
}

console.log('Fixed workshop 3-7 panel file contents');
