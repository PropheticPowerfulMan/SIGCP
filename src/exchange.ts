/** Local exchange simulation only. No network, signature, delivery or authorization guarantee. */
import { institutions, parseStoredMail } from './domain.ts';
import type { Mail, Result } from './domain.ts';

export const exchangeStatuses = ['Préparé', 'Transmis', 'Reçu', 'Accusé confirmé', 'Échec'] as const;
export type ExchangeStatus = typeof exchangeStatuses[number];
export interface ExchangeHistoryEntry { date: string; status: ExchangeStatus; label: string; }
export interface DemoExchange {
  id: string;
  mailId: string;
  mailRef: string;
  subject: string;
  sourceId: string;
  destinationId: string;
  idempotencyKey: string;
  status: ExchangeStatus;
  createdAt: string;
  updatedAt: string;
  simulation: true;
  history: ExchangeHistoryEntry[];
}
const nextStatus: Partial<Record<ExchangeStatus, ExchangeStatus>> = {
  'Préparé': 'Transmis', 'Transmis': 'Reçu', 'Reçu': 'Accusé confirmé', 'Échec': 'Transmis',
};
const allowed: Record<ExchangeStatus, readonly ExchangeStatus[]> = {
  'Préparé': ['Transmis', 'Échec'], 'Transmis': ['Reçu', 'Échec'], 'Reçu': ['Accusé confirmé'],
  'Accusé confirmé': [], 'Échec': ['Transmis'],
};
const labels: Record<ExchangeStatus, string> = {
  'Préparé': 'Préparation locale du courrier fictif — simulation',
  'Transmis': 'Transmission technique simulée — aucun envoi réel',
  'Reçu': 'Réception administrative simulée — aucun service distant contacté',
  'Accusé confirmé': 'Accusé de réception simulé — sans preuve ni signature officielle',
  'Échec': 'Échec fictif de transmission — scénario de reprise local',
};
function key(mailId: string, destinationId: string): string { return JSON.stringify([mailId, destinationId]); }
function record(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null && !Array.isArray(value); }
function text(value: unknown, max: number, min = 1): value is string { return typeof value === 'string' && value.trim().length >= min && value.length <= max && !value.includes('\u0000'); }
function timestamp(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) return false;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.toISOString() === value;
}
function configuredInstitution(id: unknown) { return institutions.find(item => item.id === id); }
function validExchange(value: unknown): value is DemoExchange {
  if (!record(value)) return false;
  const fields = ['id', 'mailId', 'mailRef', 'subject', 'sourceId', 'destinationId', 'idempotencyKey', 'status', 'createdAt', 'updatedAt', 'simulation', 'history'];
  if (Object.keys(value).some(name => !fields.includes(name)) || fields.some(name => !(name in value))) return false;
  if (!text(value.id, 120) || !text(value.mailId, 120) || !text(value.mailRef, 80) || !/^DEMO\/\d{4}\/[A-Z0-9-]+$/i.test(value.mailRef) || !text(value.subject, 180, 5)) return false;
  if (!configuredInstitution(value.sourceId)?.connected || !configuredInstitution(value.destinationId)?.connected || value.sourceId === value.destinationId) return false;
  if (value.idempotencyKey !== key(value.mailId, String(value.destinationId)) || value.simulation !== true || !exchangeStatuses.includes(value.status as ExchangeStatus)) return false;
  if (!timestamp(value.createdAt) || !timestamp(value.updatedAt) || !Array.isArray(value.history) || !value.history.length || value.history.length > 1000) return false;
  let previous: ExchangeHistoryEntry | null = null;
  for (const entry of value.history) {
    if (!record(entry) || Object.keys(entry).length !== 3 || !timestamp(entry.date) || !text(entry.label, 300) || !exchangeStatuses.includes(entry.status as ExchangeStatus)) return false;
    if (!previous) {
      if (entry.status !== 'Préparé' || entry.date !== value.createdAt) return false;
    } else if (entry.date < previous.date || !allowed[previous.status].includes(entry.status as ExchangeStatus)) return false;
    previous = entry as unknown as ExchangeHistoryEntry;
  }
  return previous?.status === value.status && previous?.date === value.updatedAt;
}
function initialize(mail: Mail, destinationId: string, date: string, id = `exchange-${crypto.randomUUID()}`): DemoExchange {
  return { id, mailId: mail.id, mailRef: mail.ref, subject: mail.subject, sourceId: mail.institutionId,
    destinationId, idempotencyKey: key(mail.id, destinationId), status: 'Préparé', createdAt: date, updatedAt: date,
    simulation: true, history: [{ date, status: 'Préparé', label: labels['Préparé'] }] };
}
export function prepareExchange(mail: Mail, destinationId: string, existing: readonly DemoExchange[]): Result<DemoExchange> {
  // Treat locally restored data as untrusted even in a browser-only demonstration.
  if (parseStoredMail(JSON.stringify([mail])).error) return { ok: false, error: 'Le courrier fictif est incomplet ou invalide.' };
  if (mail.kind !== 'sortant' || !['Validé', 'Expédié'].includes(mail.status)) return { ok: false, error: 'Seul un courrier sortant validé ou expédié peut préparer un échange fictif.' };
  const source = configuredInstitution(mail.institutionId), destination = configuredInstitution(destinationId);
  if (!source?.connected) return { ok: false, error: 'L’institution émettrice fictive n’est pas connectée au pilote.' };
  if (!destination?.connected) return { ok: false, error: 'Sélectionnez une institution destinataire fictive connectée ; cette destination est inconnue ou suspendue.' };
  if (source.id === destination.id) return { ok: false, error: 'L’institution destinataire doit être différente de l’institution émettrice.' };
  const duplicate = existing.find(item => item.idempotencyKey === key(mail.id, destinationId));
  if (duplicate) {
    if (!validExchange(duplicate)) return { ok: false, error: 'L’échange local existant est endommagé ; aucune nouvelle préparation n’a été créée.' };
    return { ok: true, value: structuredClone(duplicate) };
  }
  return { ok: true, value: initialize(mail, destinationId, new Date().toISOString()) };
}
export function advanceExchange(exchange: DemoExchange): Result<DemoExchange> {
  if (!validExchange(exchange)) return { ok: false, error: 'L’échange local est invalide ; sa progression est bloquée.' };
  const target = nextStatus[exchange.status];
  if (!target) return { ok: false, error: 'L’accusé fictif est déjà confirmé. Aucune étape supplémentaire n’est disponible.' };
  const date = new Date(Math.max(Date.now(), Date.parse(exchange.updatedAt))).toISOString();
  return { ok: true, value: { ...exchange, status: target, updatedAt: date,
    history: [...exchange.history.map(entry => ({ ...entry })), { date, status: target, label: labels[target] }] } };
}
export function seedExchanges(items: readonly Mail[]): DemoExchange[] {
  const eligible = items.filter(mail => mail.kind === 'sortant' && ['Validé', 'Expédié'].includes(mail.status) && configuredInstitution(mail.institutionId)?.connected);
  return eligible.slice(0, 4).flatMap((mail, index) => {
    const destination = institutions.find(item => item.connected && item.id !== mail.institutionId);
    if (!destination || parseStoredMail(JSON.stringify([mail])).error) return [];
    const createdAt = mail.history.at(-1)!.date;
    let exchange = initialize(mail, destination.id, createdAt, `exchange-seed-${index + 1}`);
    const scenario: ExchangeStatus[] = index === 0 ? ['Transmis', 'Reçu', 'Accusé confirmé'] : index === 1 ? ['Transmis', 'Reçu'] : index === 2 ? ['Transmis', 'Échec'] : [];
    for (const status of scenario) {
      const date = new Date(Date.parse(exchange.updatedAt) + 60_000).toISOString();
      exchange = { ...exchange, status, updatedAt: date, history: [...exchange.history, { date, status, label: labels[status] }] };
    }
    return [exchange];
  });
}
export function parseExchanges(raw: string | null): { items: DemoExchange[] | null; error: string | null } {
  if (raw === null) return { items: null, error: null };
  const error = 'Les échanges locaux sont endommagés ou incompatibles. Réinitialisez les scénarios fictifs pour continuer.';
  if (raw.length > 2_000_000) return { items: null, error };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length > 1000 || !parsed.every(validExchange)) return { items: null, error };
    if (new Set(parsed.map(item => item.id)).size !== parsed.length || new Set(parsed.map(item => item.idempotencyKey)).size !== parsed.length) return { items: null, error };
    return { items: parsed, error: null };
  } catch { return { items: null, error }; }
}
