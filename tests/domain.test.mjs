import {test} from 'node:test';
import assert from 'node:assert/strict';
import {makeSeed, stages, services, priorities, institutions, channels, assignees, validateInput, createMail, nextStatuses, transitionMail, filterMail, paginate, getStats, csvCell, exportCsv, parseStoredMail, isValidDate, isOverdue, today, shiftDate} from '../src/domain.ts';
const anchor = '2026-11-26T15:00:00.000Z';
const validInput = {subject:'Essai de courrier fictif', sender:'Institution de démonstration', recipient:'Destinataire pilote', service:services[0],kind:'entrant',priority:'Normale',date:'2026-11-25',dueDate:'2026-11-30',notes:'Données fictives uniquement'};
const seed = () => makeSeed(anchor);

test('42 deterministic synthetic records, unique references and valid dates',()=>{
  const items=seed();assert.equal(items.length,42);assert.deepEqual(seed(),items);
  assert.equal(new Set(items.map(m=>m.id)).size,42);assert.equal(new Set(items.map(m=>m.ref)).size,42);
  assert.ok(items.every(m=>m.ref.startsWith('DEMO/2026/') && stages.includes(m.status) && m.classification==='Démonstration' && isValidDate(m.date) && m.dueDate >= m.date));
  assert.ok(items.every(m=>m.date<=today(anchor)));assert.ok(items.some(m=>m.kind==='entrant'));assert.ok(items.some(m=>m.kind==='sortant'));
  assert.ok(services.every(s=>items.some(m=>m.service===s)));assert.ok(priorities.every(p=>items.some(m=>m.priority===p)));
  assert.ok(items.every(m=>m.kind!=='entrant'||m.status!=='Expédié'));
});
test('calendar validation rejects rollover, missing padding and invalid ranges',()=>{
  for(const date of ['2026-02-29','2026-04-31','2026-13-01','2026-1-01','1999-12-31','2100-01-01','not-a-date'])assert.equal(isValidDate(date),false,date);
  assert.equal(isValidDate('2024-02-29'),true);assert.equal(isValidDate('2026-12-31'),true);
  assert.equal(shiftDate('2026-01-01',-1),'2025-12-31');assert.equal(today('2026-11-25T23:30:00.000Z'),'2026-11-26');
});
test('input validation normalizes fields and returns field-level errors',()=>{
  const result=validateInput({...validInput,subject:'  Objet fictif correctement saisi  ',notes:'  Note de test  '},anchor);
  assert.equal(result.ok,true);assert.equal(result.value.subject,'Objet fictif correctement saisi');assert.equal(result.value.notes,'Note de test');
  const bad=validateInput({...validInput,subject:'   ',sender:'a',kind:'autre',service:'Service réel',priority:'Critique',date:'2026-11-27',dueDate:'2026-11-24'},anchor);
  assert.equal(bad.ok,false);for(const key of ['subject','sender','kind','service','priority','date','dueDate'])assert.ok(bad.errors[key],key);
});
test('invalid configured identifiers, channel and excessive field lengths rejected',()=>{
  const result=validateInput({...validInput,institutionId:'inconnue',channel:'SMTP réel',assignee:'inconnu',notes:'x'.repeat(1501),recipient:'x'.repeat(121)},anchor);
  assert.equal(result.ok,false);for(const key of ['institutionId','channel','assignee','notes','recipient'])assert.ok(result.errors[key]);
});
test('local creation produces unique references, correct defaults and initial history',()=>{
  const items=seed();const first=createMail(validInput,items,anchor);assert.equal(first.ok,true);
  assert.equal(first.value.ref,'DEMO/2026/00043');assert.equal(first.value.status,'Enregistré');assert.equal(first.value.documents.length,0);
  assert.equal(first.value.history[0].status,'Enregistré');assert.equal(first.value.channel,channels[0]);assert.equal(first.value.assignee,assignees[0]);
  const second=createMail(validInput,[...items,first.value],anchor);assert.equal(second.ok,true);assert.equal(second.value.ref,'DEMO/2026/00044');assert.notEqual(first.value.id,second.value.id);
  assert.equal(createMail({...validInput,subject:' '},items,anchor).ok,false);
});
test('workflow distinguishes incoming archive and outgoing dispatch',()=>{
  assert.deepEqual(nextStatuses({status:'Validé',kind:'entrant'}),['Archivé']);assert.deepEqual(nextStatuses({status:'Validé',kind:'sortant'}),['Expédié']);
  assert.deepEqual(nextStatuses({status:'Archivé',kind:'sortant'}),[]);assert.deepEqual(nextStatuses({status:'En validation',kind:'entrant'}),['Validé','En traitement']);
});
test('workflow applies one permitted transition without mutating the original',()=>{
  const mail=seed().find(m=>m.status==='Enregistré');const snapshot=structuredClone(mail);
  const result=transitionMail(mail,'Affecté','Agent pilote B',anchor);
  assert.equal(result.ok,true);assert.equal(result.value.status,'Affecté');assert.equal(result.value.history.length,mail.history.length+1);
  assert.deepEqual(mail,snapshot);assert.equal(result.value.history.at(-1).actor,'Agent pilote B');
  assert.equal(transitionMail(mail,'Validé','Agent pilote B',anchor).ok,false);
});
test('correction needs a reason, terminal workflow cannot be reopened, backdating refused',()=>{
  const mail=seed().find(m=>m.status==='En validation');assert.equal(transitionMail(mail,'En traitement','Agent pilote A',anchor).ok,false);
  const result=transitionMail(mail,'En traitement','Agent pilote A',anchor,'Objet à préciser');assert.equal(result.ok,true);assert.match(result.value.history.at(-1).label,/Objet à préciser/);
  const archived=seed().find(m=>m.status==='Archivé');assert.equal(transitionMail(archived,'Enregistré','Agent pilote A',anchor).ok,false);
  assert.equal(transitionMail(mail,'Validé','Agent pilote A','2020-01-01T10:00:00Z').ok,false);
  assert.equal(transitionMail(mail,'Validé','Agent pilote A','invalid').ok,false);
});
test('search is accent-insensitive, multiword and combined with exact facets',()=>{
  const items=seed();const found=filterMail(items,{query:'numerisation materiel'},anchor);assert.ok(found.length>0);assert.ok(found.every(m=>m.subject.includes('matériel de numérisation')));
  const expected=items.filter(m=>m.kind==='entrant'&&m.service===services[0]&&m.priority==='Normale');const actual=filterMail(items,{kind:'entrant',service:services[0],priority:'Normale'},anchor);
  assert.deepEqual(new Set(actual.map(m=>m.id)),new Set(expected.map(m=>m.id)));
  assert.equal(filterMail(items,{query:'zzzz introuvable'},anchor).length,0);
  const dates=filterMail(items,{dateFrom:'2026-11-24',dateTo:'2026-11-25'},anchor);assert.ok(dates.every(m=>m.date>='2026-11-24'&&m.date<='2026-11-25'));
});
test('sorting and filtering do not mutate the source collection',()=>{
  const items=seed(),original=items.map(m=>m.id);const result=filterMail(items,{sortBy:'ref',sortDirection:'desc'},anchor);
  assert.equal(result[0].ref,'DEMO/2026/00042');assert.deepEqual(items.map(m=>m.id),original);
  const urgent=filterMail(items,{sortBy:'priority',sortDirection:'desc'},anchor);assert.equal(urgent[0].priority,'Urgente');
});
test('overdue excludes completed records and includes only deadlines before reference date',()=>{
  assert.equal(isOverdue({status:'En traitement',dueDate:'2026-11-25'},anchor),true);
  assert.equal(isOverdue({status:'En traitement',dueDate:'2026-11-26'},anchor),false);
  for(const status of ['Validé','Expédié','Archivé'])assert.equal(isOverdue({status,dueDate:'2026-11-20'},anchor),false);
  const items=seed();assert.equal(filterMail(items,{onlyOverdue:true},anchor).length,getStats(items,anchor).overdue);
});
test('pagination clamps invalid pages and page sizes, and handles empty results',()=>{
  const items=seed();assert.deepEqual(paginate(items,2,10).items,items.slice(10,20));assert.equal(paginate(items,99,10).page,5);
  const empty=paginate([],9,10);assert.equal(empty.page,1);assert.equal(empty.totalPages,1);assert.equal(empty.from,0);assert.equal(empty.to,0);
  assert.equal(paginate(items,-1,0).page,1);assert.equal(paginate(items,-1,0).pageSize,1);assert.equal(paginate(items,Infinity,NaN).pageSize,10);assert.equal(paginate(items,1,9999).pageSize,100);
});
test('statistics reconcile totals, statuses, services and empty registry',()=>{
  const stats=getStats(seed(),anchor);assert.equal(stats.total,42);assert.equal(stats.incoming+stats.outgoing,42);assert.equal(stats.completed+stats.inProgress,42);
  assert.equal(stats.byStatus.reduce((n,s)=>n+s.total,0),42);assert.equal(stats.byService.reduce((n,s)=>n+s.total,0),42);
  assert.equal(stats.weeklyTrend.length,7);assert.equal(stats.weeklyTrend.at(-1).date,'2026-11-26');assert.ok(stats.averageDays>=0);
  const empty=getStats([],anchor);assert.equal(empty.averageDays,0);assert.equal(empty.completionRate,0);assert.equal(empty.overdue,0);
});
test('CSV cells quote delimiters and neutralize formula prefixes including whitespace',()=>{
  assert.equal(csvCell('a";b'),'"a"";b"');assert.equal(csvCell(null),'""');assert.equal(csvCell('normal'),'"normal"');
  for(const formula of ['=1+1','+SUM(A1)','@cmd','-1','  =1','\t=1','\r\n+1'])assert.ok(csvCell(formula).startsWith('"\''),JSON.stringify(formula));
  const csv=exportCsv([{...seed()[0],subject:'=HYPERLINK("https://test.invalid")'}]);assert.ok(csv.startsWith('\uFEFF'));assert.ok(csv.includes('"\'=HYPERLINK'));assert.ok(csv.includes('Échéance'));
});
test('valid stored registry round trips while corrupt rows are rejected as a whole',()=>{
  const items=seed();assert.deepEqual(parseStoredMail(JSON.stringify(items)),{items,error:null});assert.deepEqual(parseStoredMail(null),{items:null,error:null});assert.deepEqual(parseStoredMail('[]'),{items:[],error:null});
  for(const raw of ['{bad','{}','null','[{"id":"x"}]',JSON.stringify([items[0],items[0]]),JSON.stringify([{...items[0],date:'2026-02-30'}]),JSON.stringify([{...items[0],history:[]}]),JSON.stringify([{...items[0],service:'Service inconnu'}]),JSON.stringify([{...items[0],status:'Signature officielle'}]),JSON.stringify([{...items[0],documents:[{id:'d',pages:-1}]}])]){const result=parseStoredMail(raw);assert.equal(result.items,null);assert.ok(result.error);}
});
test('stored chronology must be ordered and agree with current status',()=>{
  const mail=seed().find(m=>m.history.length>=3);const reversed={...mail,history:[...mail.history].reverse()};assert.ok(parseStoredMail(JSON.stringify([reversed])).error);
  assert.ok(parseStoredMail(JSON.stringify([{...mail,status:'Archivé'}])).error);
});
