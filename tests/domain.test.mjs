import {test} from 'node:test';
import assert from 'node:assert/strict';
import {makeSeed,transition,selectMail,csvCell,stages} from '../src/domain.mjs';
test('synthetic seed is consistent and references are unique',()=>{const a=makeSeed();assert.equal(a.length,12);assert.equal(new Set(a.map(m=>m.ref)).size,12);assert.ok(a.every(m=>m.ref.startsWith('DEMO/')&&stages.includes(m.status)&&m.classification==='Démonstration'));});
test('workflow progresses one step and archive is terminal',()=>{assert.equal(transition('En validation'),'Validé');assert.equal(transition('Archivé'),'Archivé');for(let i=0;i<stages.length-1;i++)assert.equal(transition(stages[i]),stages[i+1]);});
test('search combines kind, status and case-insensitive query',()=>{const a=makeSeed();assert.equal(selectMail(a,'MODERNISATION','','sortant').length,1);assert.equal(selectMail(a,'MODERNISATION','','entrant').length,0);assert.equal(selectMail(a,'','Archivé','').length,1);assert.equal(selectMail(a,'introuvable','','').length,0)});
test('CSV escapes quotes, delimiters and spreadsheet formulas',()=>{assert.equal(csvCell('a";b'),'"a"";b"');for(const s of ['=1+1','+SUM(A1)','@cmd','-1','  =1'])assert.ok(csvCell(s).startsWith('"\''));assert.equal(csvCell('Courrier normal'),'"Courrier normal"')});
