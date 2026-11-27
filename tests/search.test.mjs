import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeSeed } from '../src/domain.ts';
import { GLOBAL_SEARCH_LIMIT, searchMailGlobally } from '../src/search.ts';

const anchor = '2026-11-26T15:00:00.000Z';
const seed = () => makeSeed(anchor);
const fixture = overrides => ({ ...seed()[0], ...overrides });

test('empty queries and absent terms return no records', () => {
  const items = seed();
  for (const query of ['', ' \t \n ', 'introuvablexyz']) {
    assert.deepEqual(searchMailGlobally(items, query), { items: [], total: 0 });
  }
});

test('search ignores case and accents while requiring every word across fields', () => {
  const target = fixture({ id: 'target', subject: 'Réunion du cœur numérique', service: 'Direction numérique pilote', priority: 'Urgente', kind: 'entrant', status: 'Enregistré' });
  const other = fixture({ id: 'other', subject: 'Réunion du cœur numérique', priority: 'Normale', kind: 'sortant' });
  const result = searchMailGlobally([other, target], 'REUNION coeur NUMERIQUE urgente entrant');
  assert.equal(result.total, 1);
  assert.equal(result.items[0], target);
  assert.equal(searchMailGlobally([target], 'reunion inconnue').total, 0);
});

test('status, direction, service, assignee and institution metadata are searchable', () => {
  const target = fixture({ id: 'target', status: 'En validation', kind: 'sortant', service: 'Bureau pilote de coordination', assignee: 'Agent pilote D', institutionId: 'partenaire-b' });
  const result = searchMailGlobally([target], 'validation sortant coordination partenaire B agent D');
  assert.equal(result.total, 1);
  assert.equal(result.items[0], target);
});

test('an exact reference precedes subject and metadata matches regardless of date', () => {
  const reference = fixture({ id: 'reference', ref: 'DEMO/2026/00001', subject: 'Premier dossier', date: '2026-01-01' });
  const subject = fixture({ id: 'subject', ref: 'DEMO/2026/00002', subject: 'DEMO/2026/00001', date: '2026-11-26' });
  const metadata = fixture({ id: 'metadata', ref: 'DEMO/2026/00003', subject: 'Troisième dossier', sender: 'DEMO/2026/00001', date: '2026-11-27' });
  assert.deepEqual(searchMailGlobally([metadata, subject, reference], 'demo/2026/00001').items, [reference, subject, metadata]);
});

test('subject matches precede metadata matches, then dates and references give stable ordering', () => {
  const olderSubject = fixture({ id: 'older', ref: 'DEMO/2026/00003', subject: 'Coordination du pilote', sender: 'Cellule A', date: '2026-01-01' });
  const newerSubject = fixture({ id: 'newer', ref: 'DEMO/2026/00002', subject: 'Coordination du pilote', sender: 'Cellule A', date: '2026-11-25' });
  const tiedSubject = fixture({ id: 'tied', ref: 'DEMO/2026/00001', subject: 'Coordination du pilote', sender: 'Cellule A', date: '2026-11-25' });
  const metadata = fixture({ id: 'metadata', ref: 'DEMO/2026/00004', subject: 'Un autre objet', sender: 'Bureau de coordination', date: '2026-11-26' });
  const items = [metadata, olderSubject, newerSubject, tiedSubject];
  assert.deepEqual(searchMailGlobally(items, 'coordination').items, [tiedSubject, newerSubject, olderSubject, metadata]);
});

test('results are limited to twelve with the complete match count, preserving source records', () => {
  const items = seed();
  const snapshot = structuredClone(items);
  Object.freeze(items);
  const result = searchMailGlobally(items, 'pilote');
  assert.equal(result.total, 42);
  assert.equal(result.items.length, GLOBAL_SEARCH_LIMIT);
  assert.equal(GLOBAL_SEARCH_LIMIT, 12);
  assert.ok(result.items.every(mail => items.includes(mail)));
  assert.deepEqual(items, snapshot);
});

test('document descriptions and free observations are outside the metadata index', () => {
  const item = fixture({ subject: 'Objet fictif', notes: 'termeuniquenote', documents: [{ id: 'fiche', name: 'termeuniquefiche', type: 'Note', pages: 1, description: 'termeuniquedocument' }] });
  for (const term of ['termeuniquenote', 'termeuniquefiche', 'termeuniquedocument']) {
    assert.equal(searchMailGlobally([item], term).total, 0);
  }
});
