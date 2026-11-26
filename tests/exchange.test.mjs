import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeSeed, institutions } from '../src/domain.ts';
import { seedExchanges, prepareExchange, advanceExchange, parseExchanges } from '../src/exchange.ts';
const items = makeSeed('2026-11-26T15:00:00.000Z');
const outgoing = items.find(mail => mail.kind === 'sortant' && mail.status === 'Validé');
const target = institutions.find(item => item.connected && item.id !== outgoing.institutionId).id;
function prepared() { const result = prepareExchange(outgoing, target, []); assert.equal(result.ok, true); return result.value; }

test('prepare only a validated outgoing record toward a different connected institution', () => {
  const result = prepared();
  assert.equal(result.status, 'Préparé'); assert.equal(result.simulation, true); assert.equal(result.mailId, outgoing.id); assert.equal(result.destinationId, target);
  assert.equal(result.history.length, 1); assert.match(result.history[0].label, /simulation/);
  assert.equal(prepareExchange({ ...outgoing, kind: 'entrant' }, target, []).ok, false);
  assert.equal(prepareExchange({ ...outgoing, status: 'En traitement' }, target, []).ok, false);
});
test('unknown, same, suspended and disconnected source institutions are refused', () => {
  assert.equal(prepareExchange(outgoing, outgoing.institutionId, []).ok, false);
  assert.equal(prepareExchange(outgoing, 'inconnue', []).ok, false);
  assert.equal(prepareExchange(outgoing, 'partenaire-c', []).ok, false);
  assert.equal(prepareExchange({ ...outgoing, institutionId: 'partenaire-c' }, target, []).ok, false);
  assert.equal(prepareExchange({ ...outgoing, history: [] }, target, []).ok, false);
});
test('idempotence returns the original exchange including its current progress', () => {
  const first = prepared(), sent = advanceExchange(first); assert.equal(sent.ok, true);
  const duplicate = prepareExchange(outgoing, target, [sent.value]); assert.equal(duplicate.ok, true);
  assert.deepEqual(duplicate.value, sent.value); assert.equal(duplicate.value.id, first.id);
  assert.notEqual(duplicate.value, sent.value); assert.equal(duplicate.value.status, 'Transmis');
});
test('technical transmission, administrative receipt and confirmation are separate steps', () => {
  const original = prepared(); let exchange = original;
  for (const expected of ['Transmis', 'Reçu', 'Accusé confirmé']) { const result = advanceExchange(exchange); assert.equal(result.ok, true); exchange = result.value; assert.equal(exchange.status, expected); }
  assert.equal(exchange.history.length, 4); assert.equal(original.history.length, 1); assert.equal(original.status, 'Préparé');
  assert.equal(advanceExchange(exchange).ok, false); assert.match(exchange.history.at(-1).label, /sans preuve ni signature officielle/);
});
test('seed scenarios are deterministic, valid, and include failure with controlled retry', () => {
  const seed = seedExchanges(items); assert.equal(seed.length, 4); assert.deepEqual(seedExchanges(items), seed);
  assert.deepEqual(new Set(seed.map(item => item.status)), new Set(['Préparé', 'Reçu', 'Accusé confirmé', 'Échec']));
  assert.deepEqual(parseExchanges(JSON.stringify(seed)), { items: seed, error: null });
  const failure = seed.find(item => item.status === 'Échec'), retry = advanceExchange(failure); assert.equal(retry.ok, true); assert.equal(retry.value.status, 'Transmis');
  assert.equal(retry.value.id, failure.id); assert.equal(retry.value.history.length, failure.history.length + 1);
});
test('parsing rejects malformed structures, unknown fields and contradictory or skipped histories', () => {
  const value = prepared();
  const skip = { ...value, status: 'Reçu', history: [...value.history, { date: value.createdAt, status: 'Reçu', label: 'Réception fictive sans transmission' }] };
  const invalid = ['{bad', '{}', 'null', JSON.stringify([{ ...value, simulation: false }]), JSON.stringify([{ ...value, extra: true }]), JSON.stringify([{ ...value, history: [] }]), JSON.stringify([{ ...value, destinationId: 'partenaire-c' }]), JSON.stringify([{ ...value, idempotencyKey: 'faux' }]), JSON.stringify([{ ...value, status: 'Accusé confirmé' }]), JSON.stringify([skip])];
  for (const raw of invalid) { const result = parseExchanges(raw); assert.equal(result.items, null, raw); assert.ok(result.error); }
});
test('parsing rejects duplicate ids or deliveries and noncanonical/backdated timestamps', () => {
  const value = prepared();
  assert.ok(parseExchanges(JSON.stringify([value, value])).error);
  assert.ok(parseExchanges(JSON.stringify([value, { ...value, id: 'another-id' }])).error);
  assert.ok(parseExchanges(JSON.stringify([{ ...value, createdAt: '2026-02-30T10:00:00.000Z' }])).error);
  const sent = advanceExchange(value).value;
  const backwards = { ...sent, updatedAt: '2000-01-01T00:00:00.000Z', history: [sent.history[0], { ...sent.history[1], date: '2000-01-01T00:00:00.000Z' }] };
  assert.ok(parseExchanges(JSON.stringify([backwards])).error); assert.equal(advanceExchange(backwards).ok, false);
});
test('absent and empty local stores are valid, excessive payload is refused', () => {
  assert.deepEqual(parseExchanges(null), { items: null, error: null }); assert.deepEqual(parseExchanges('[]'), { items: [], error: null });
  assert.ok(parseExchanges(' '.repeat(2_000_001)).error); assert.deepEqual(seedExchanges([]), []);
});
