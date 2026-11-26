/** Browser-only demonstration domain. No server authorization or official workflow is implied. */
export const stages = ['Enregistré', 'Affecté', 'En traitement', 'En validation', 'Validé', 'Expédié', 'Archivé'] as const;
export type MailStatus = typeof stages[number];
export const priorities = ['Normale', 'Haute', 'Urgente'] as const;
export type Priority = typeof priorities[number];
export type MailKind = 'entrant' | 'sortant';
export const channels = ['Dépôt physique fictif', 'Messagerie de test', 'Passerelle de démonstration'] as const;
export type Channel = typeof channels[number];
export const services = ['Service pilote du courrier', 'Cellule documentaire pilote', 'Direction numérique pilote', 'Bureau pilote de coordination'] as const;
export const institutions = [
  { id: 'pilote-a', name: 'Institution pilote A', code: 'IPA', description: 'Espace fictif de coordination du pilote', type: 'Pilote interne', connected: true },
  { id: 'partenaire-b', name: 'Institution partenaire B', code: 'IPB', description: 'Partenaire fictif pour les parcours de correspondance', type: 'Partenaire de test', connected: true },
  { id: 'partenaire-c', name: 'Institution partenaire C', code: 'IPC', description: 'Espace fictif de réception et de réponse', type: 'Partenaire de test', connected: false },
] as const;
export const assignees = ['Agent pilote A', 'Agent pilote B', 'Agent pilote C', 'Agent pilote D'] as const;
export interface HistoryEntry { date: string; label: string; actor: string; status: MailStatus; }
export interface DemoDocument { id: string; name: string; type: 'Note' | 'Rapport' | 'Lettre'; pages: number; description: string; }
export interface Mail {
  id: string; ref: string; subject: string; sender: string; recipient: string;
  service: string; kind: MailKind; priority: Priority; status: MailStatus;
  date: string; dueDate: string; classification: 'Démonstration'; notes: string;
  channel: Channel; assignee: string; institutionId: string;
  documents: DemoDocument[]; history: HistoryEntry[];
}
export interface MailInput {
  subject: string; sender: string; recipient?: string; service: string;
  kind: MailKind; priority: Priority; date: string; dueDate: string;
  notes?: string; channel?: Channel; assignee?: string; institutionId?: string;
}
export type Result<T> = { ok: true; value: T } | { ok: false; error: string; errors?: Record<string, string> };
export interface MailFilters {
  query?: string; status?: MailStatus | ''; kind?: MailKind | ''; priority?: Priority | '';
  service?: string; institutionId?: string; dateFrom?: string; dateTo?: string;
  onlyOverdue?: boolean; sortBy?: 'date' | 'ref' | 'priority' | 'dueDate'; sortDirection?: 'asc' | 'desc';
}
const DAY = 86_400_000;
const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const clean = (v: unknown): string => typeof v === 'string' ? v.trim().replaceAll('\u0000', '') : '';
export function today(anchor: Date | string = new Date()): string {
  const date = anchor instanceof Date ? anchor : new Date(anchor);
  if (Number.isNaN(date.getTime())) throw new Error('Date de référence invalide.');
  // The pilot is institutionally presented in Kinshasa, UTC+1.
  return new Date(date.getTime() + 3_600_000).toISOString().slice(0, 10);
}
export function shiftDate(date: string, days: number): string { return new Date(Date.parse(date + 'T12:00:00.000Z') + days * DAY).toISOString().slice(0, 10); }
export function isValidDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T12:00:00.000Z');
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value && value >= '2000-01-01' && value <= '2099-12-31';
}
export function validateInput(input: Partial<MailInput>, anchor: Date | string = new Date()): Result<MailInput> {
  const errors: Record<string, string> = {};
  const subject = clean(input.subject), sender = clean(input.sender), recipient = clean(input.recipient), notes = clean(input.notes);
  if (subject.length < 5 || subject.length > 180) errors.subject = 'L’objet doit contenir entre 5 et 180 caractères.';
  if (sender.length < 3 || sender.length > 120) errors.sender = 'L’expéditeur fictif doit contenir entre 3 et 120 caractères.';
  if (recipient.length > 120) errors.recipient = 'Le destinataire doit contenir au maximum 120 caractères.';
  if (notes.length > 1500) errors.notes = 'Les observations sont limitées à 1 500 caractères.';
  if (!services.includes(input.service as typeof services[number])) errors.service = 'Sélectionnez un service pilote valide.';
  if (input.kind !== 'entrant' && input.kind !== 'sortant') errors.kind = 'Sélectionnez un type de courrier valide.';
  if (!priorities.includes(input.priority as Priority)) errors.priority = 'Sélectionnez une priorité valide.';
  if (!isValidDate(input.date)) errors.date = 'Saisissez une date de réception valide.';
  else if (input.date > today(anchor)) errors.date = 'La date de réception ne peut pas être future.';
  if (!isValidDate(input.dueDate)) errors.dueDate = 'Saisissez une échéance valide.';
  else if (isValidDate(input.date) && input.dueDate < input.date) errors.dueDate = 'L’échéance ne peut pas précéder la réception.';
  if (input.channel && !channels.includes(input.channel)) errors.channel = 'Sélectionnez un canal de démonstration valide.';
  if (input.assignee && !assignees.includes(input.assignee as typeof assignees[number])) errors.assignee = 'Sélectionnez un agent pilote valide.';
  if (input.institutionId && !institutions.some(i => i.id === input.institutionId)) errors.institutionId = 'Sélectionnez une institution fictive valide.';
  if (Object.keys(errors).length) return { ok: false, error: 'Vérifiez les champs du formulaire.', errors };
  return { ok: true, value: { subject, sender, recipient: recipient || 'Espace pilote IMPERIUM RDC', notes, service: input.service!, kind: input.kind!, priority: input.priority!, date: input.date!, dueDate: input.dueDate!, channel: input.channel || channels[0], assignee: input.assignee || assignees[0], institutionId: input.institutionId || institutions[0].id } };
}
export function createMail(input: Partial<MailInput>, existing: readonly Mail[], anchor: Date | string = new Date()): Result<Mail> {
  const validated = validateInput(input, anchor);
  if (!validated.ok) return validated;
  const now = anchor instanceof Date ? anchor : new Date(anchor);
  const year = today(now).slice(0, 4);
  // This counter is local to one browser, deliberately not an official administrative reference.
  let sequence = existing.reduce((max, mail) => {
    const match = mail.ref.match(new RegExp('^DEMO/' + year + '/(\\d+)$'));
    return match && Number.isSafeInteger(Number(match[1])) ? Math.max(max, Number(match[1])) : max;
  }, 0) + 1;
  let ref = `DEMO/${year}/${String(sequence).padStart(5, '0')}`;
  while (existing.some(mail => mail.ref === ref)) ref = `DEMO/${year}/${String(++sequence).padStart(5, '0')}`;
  return { ok: true, value: { ...validated.value, recipient: validated.value.recipient!, notes: validated.value.notes!, channel: validated.value.channel!, assignee: validated.value.assignee!, institutionId: validated.value.institutionId!, id: crypto.randomUUID(), ref, status: 'Enregistré', classification: 'Démonstration', documents: [], history: [{ date: now.toISOString(), label: 'Enregistrement du courrier fictif', actor: validated.value.assignee!, status: 'Enregistré' }] } };
}
export function nextStatuses(mail: Pick<Mail, 'status' | 'kind'>): MailStatus[] {
  switch (mail.status) {
    case 'Enregistré': return ['Affecté'];
    case 'Affecté': return ['En traitement'];
    case 'En traitement': return ['En validation'];
    case 'En validation': return ['Validé', 'En traitement'];
    case 'Validé': return mail.kind === 'sortant' ? ['Expédié'] : ['Archivé'];
    case 'Expédié': return ['Archivé'];
    default: return [];
  }
}
export function transitionMail(mail: Mail, target: MailStatus, actor = 'Agent pilote A', anchor: Date | string = new Date(), reason = ''): Result<Mail> {
  if (!nextStatuses(mail).includes(target)) return { ok: false, error: `La transition de « ${mail.status} » vers « ${target} » n’est pas autorisée dans ce circuit pilote.` };
  if (mail.status === 'En validation' && target === 'En traitement' && clean(reason).length < 5) return { ok: false, error: 'Précisez un motif de correction de 5 caractères minimum.' };
  const now = anchor instanceof Date ? anchor : new Date(anchor);
  if (Number.isNaN(now.getTime())) return { ok: false, error: 'Date de transition invalide.' };
  const lastDate = mail.history.at(-1)?.date;
  if (lastDate && now.getTime() < Date.parse(lastDate)) return { ok: false, error: 'Une transition ne peut pas précéder la dernière action du dossier.' };
  const label = target === 'En traitement' && mail.status === 'En validation' ? `Retour pour correction : ${clean(reason)}` : `Passage au statut « ${target} » — simulation`;
  return { ok: true, value: { ...mail, status: target, history: [...mail.history, { date: now.toISOString(), label, actor: clean(actor).slice(0, 120) || 'Agent pilote A', status: target }] } };
}
export function isOverdue(mail: Pick<Mail, 'status' | 'dueDate'>, anchor: Date | string = new Date()): boolean { return !['Validé', 'Expédié', 'Archivé'].includes(mail.status) && mail.dueDate < today(anchor); }
function normalize(value: string): string { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr'); }
export function filterMail(items: readonly Mail[], filters: MailFilters = {}, anchor: Date | string = new Date()): Mail[] {
  const terms = normalize(filters.query?.trim() || '').split(/\s+/).filter(Boolean);
  const result = items.filter(mail => {
    const haystack = normalize(`${mail.ref} ${mail.subject} ${mail.sender} ${mail.recipient} ${mail.service} ${mail.assignee}`);
    return terms.every(term => haystack.includes(term)) && (!filters.kind || mail.kind === filters.kind) && (!filters.status || mail.status === filters.status) && (!filters.priority || mail.priority === filters.priority) && (!filters.service || mail.service === filters.service) && (!filters.institutionId || mail.institutionId === filters.institutionId) && (!filters.dateFrom || mail.date >= filters.dateFrom) && (!filters.dateTo || mail.date <= filters.dateTo) && (!filters.onlyOverdue || isOverdue(mail, anchor));
  });
  const field = filters.sortBy || 'date';
  const direction = filters.sortDirection === 'asc' ? 1 : -1;
  return result.sort((a, b) => {
    const order = field === 'priority' ? priorities.indexOf(a.priority) - priorities.indexOf(b.priority) : a[field].localeCompare(b[field], 'fr', { numeric: true });
    return order * direction || a.ref.localeCompare(b.ref, 'fr', { numeric: true });
  });
}
export function paginate<T>(items: readonly T[], requestedPage = 1, requestedSize = 10): { items: T[]; page: number; pageSize: number; total: number; totalPages: number; from: number; to: number } {
  const pageSize = Number.isFinite(requestedSize) ? Math.min(100, Math.max(1, Math.trunc(requestedSize))) : 10;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Number.isFinite(requestedPage) ? Math.min(totalPages, Math.max(1, Math.trunc(requestedPage))) : 1;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), page, pageSize, total: items.length, totalPages, from: items.length ? start + 1 : 0, to: Math.min(start + pageSize, items.length) };
}
export function getStats(items: readonly Mail[], anchor: Date | string = new Date()) {
  const completed = items.filter(m => ['Validé', 'Expédié', 'Archivé'].includes(m.status));
  const completionDays = completed.map(m => {
    const completion = m.history.find(h => ['Validé', 'Expédié', 'Archivé'].includes(h.status));
    return Math.max(0, Math.round((Date.parse(completion?.date || m.history.at(-1)!.date) - Date.parse(m.date + 'T10:00:00Z')) / DAY));
  });
  const currentDate = today(anchor);
  return {
    total: items.length, incoming: items.filter(m => m.kind === 'entrant').length, outgoing: items.filter(m => m.kind === 'sortant').length,
    inProgress: items.length - completed.length, pendingValidation: items.filter(m => m.status === 'En validation').length,
    urgent: items.filter(m => m.priority === 'Urgente' && !['Validé', 'Expédié', 'Archivé'].includes(m.status)).length,
    overdue: items.filter(m => isOverdue(m, anchor)).length, archived: items.filter(m => m.status === 'Archivé').length,
    completed: completed.length, completionRate: items.length ? Math.round(completed.length / items.length * 100) : 0,
    averageDays: completionDays.length ? Math.round(completionDays.reduce((a, b) => a + b, 0) / completionDays.length * 10) / 10 : 0,
    byService: services.map(name => ({ name, total: items.filter(m => m.service === name).length, active: items.filter(m => m.service === name && !['Validé', 'Expédié', 'Archivé'].includes(m.status)).length })),
    byStatus: stages.map(name => ({ name, total: items.filter(m => m.status === name).length })),
    weeklyTrend: Array.from({ length: 7 }, (_, index) => {
      const date = shiftDate(currentDate, index - 6);
      return { date, incoming: items.filter(m => m.date === date && m.kind === 'entrant').length, outgoing: items.filter(m => m.date === date && m.kind === 'sortant').length };
    }),
  };
}
export function csvCell(value: unknown): string {
  const text = String(value ?? '').replaceAll('\u0000', '');
  return '"' + (/^\s*[=+@\-]/u.test(text) ? "'" + text : text).replaceAll('"', '""') + '"';
}
export function exportCsv(items: readonly Mail[]): string {
  const rows = [['Référence', 'Objet', 'Expéditeur fictif', 'Destinataire fictif', 'Service', 'Type', 'Statut', 'Priorité', 'Réception', 'Échéance'], ...items.map(m => [m.ref, m.subject, m.sender, m.recipient, m.service, m.kind, m.status, m.priority, m.date, m.dueDate])];
  return '\uFEFF' + rows.map(row => row.map(csvCell).join(';')).join('\r\n');
}
const subjects = ['Programme de modernisation des archives', 'Invitation à la commission numérique pilote', 'Note de cadrage du pilote documentaire', 'Rapport mensuel des activités fictives', 'Demande de matériel de numérisation', 'Transmission du calendrier de formation', 'Projet de convention de coopération fictive', 'Compte rendu de la réunion technique', 'Plan de continuité du service pilote', 'Validation du référentiel documentaire', 'Accusé de réception du dossier pilote', 'Synthèse des besoins des services', 'Atelier de cartographie des processus', 'Préparation de la campagne de numérisation', 'Avis technique sur le classement pilote', 'Inventaire de la bibliothèque documentaire', 'Proposition de circuit de validation', 'Organisation du séminaire des agents pilotes', 'Évaluation du parcours de réception', 'Planning des échanges entre espaces fictifs', 'Mise à jour du guide des utilisateurs'];
export function makeSeed(anchor: Date | string = new Date()): Mail[] {
  const date = today(anchor);
  return Array.from({ length: 42 }, (_, index) => {
    const kind: MailKind = index % 3 === 0 ? 'sortant' : 'entrant';
    const path: MailStatus[] = kind === 'sortant' ? [...stages] : stages.filter(s => s !== 'Expédié');
    const step = index % path.length;
    const received = shiftDate(date, -Math.floor(index / 2));
    const completedSteps = path.slice(0, step + 1);
    const institution = institutions[index % institutions.length];
    const ref = `DEMO/${date.slice(0, 4)}/${String(index + 1).padStart(5, '0')}`;
    return {
      id: `demo-${index + 1}`, ref, subject: subjects[index % subjects.length] + (index >= subjects.length ? ' — phase 2' : ''),
      sender: kind === 'sortant' ? 'Institution pilote A' : institution.name,
      recipient: kind === 'sortant' ? institutions[(index + 1) % institutions.length].name : 'Espace pilote IMPERIUM RDC',
      service: services[index % services.length], kind, priority: index % 7 === 0 ? 'Urgente' : index % 4 === 0 ? 'Haute' : 'Normale',
      status: path[step], date: received, dueDate: shiftDate(received, index % 7 === 0 ? 2 : index % 4 === 0 ? 5 : 10),
      classification: 'Démonstration', notes: 'Dossier entièrement fictif. Les institutions, agents, références et documents de cet exemple servent uniquement à tester le parcours utilisateur.',
      channel: channels[index % channels.length], assignee: assignees[index % assignees.length], institutionId: institution.id,
      documents: index % 3 !== 1 ? [{ id: `doc-${index + 1}`, name: `${index % 2 === 0 ? 'Note' : 'Rapport'} de démonstration ${String(index + 1).padStart(2, '0')}`, type: index % 2 === 0 ? 'Note' : 'Rapport', pages: index % 5 + 1, description: 'Fiche descriptive fictive, aucun fichier institutionnel joint.' }] : [],
      history: completedSteps.map((status, i) => ({ date: shiftDate(received, Math.min(i, Math.max(0, Math.floor(index / 2) - 1))) + `T${String(8 + i).padStart(2, '0')}:00:00.000Z`, status, label: i === 0 ? 'Enregistrement du courrier fictif' : `Passage au statut « ${status} » — simulation`, actor: assignees[i % assignees.length] })),
    };
  });
}
function validString(value: unknown, max: number, min = 1): value is string { return typeof value === 'string' && value.length >= min && value.length <= max; }
function validMail(value: unknown): value is Mail {
  if (!isRecord(value)) return false;
  if (!validString(value.id, 120) || !validString(value.ref, 80) || !/^DEMO\/\d{4}\/\d{5,10}$/.test(value.ref)) return false;
  if (!validString(value.subject, 180, 5) || !validString(value.sender, 120, 3) || !validString(value.recipient, 120) || !validString(value.notes, 1500, 0)) return false;
  if (!services.includes(value.service as typeof services[number]) || !assignees.includes(value.assignee as typeof assignees[number]) || !channels.includes(value.channel as Channel) || !institutions.some(i => i.id === value.institutionId)) return false;
  if (!stages.includes(value.status as MailStatus) || !priorities.includes(value.priority as Priority) || (value.kind !== 'entrant' && value.kind !== 'sortant') || value.classification !== 'Démonstration') return false;
  if (value.kind === 'entrant' && value.status === 'Expédié') return false;
  if (!isValidDate(value.date) || !isValidDate(value.dueDate) || value.dueDate < value.date) return false;
  if (!Array.isArray(value.documents) || value.documents.length > 25 || !value.documents.every(d => isRecord(d) && validString(d.id, 120) && validString(d.name, 180) && ['Note', 'Rapport', 'Lettre'].includes(d.type as string) && Number.isInteger(d.pages) && Number(d.pages) >= 1 && Number(d.pages) <= 1000 && validString(d.description, 1500))) return false;
  if (!Array.isArray(value.history) || value.history.length < 1 || value.history.length > 1000) return false;
  let lastTime = 0;
  let previousStatus: MailStatus | null = null;
  for (const entry of value.history) {
    if (!isRecord(entry) || !validString(entry.date, 40) || !Number.isFinite(Date.parse(entry.date)) || !validString(entry.label, 2000) || !validString(entry.actor, 120) || !stages.includes(entry.status as MailStatus)) return false;
    if (previousStatus === null ? entry.status !== 'Enregistré' : !nextStatuses({ status: previousStatus, kind: value.kind }).includes(entry.status as MailStatus)) return false;
    previousStatus = entry.status as MailStatus;
    const timestamp = Date.parse(entry.date);
    if (timestamp < lastTime) return false;
    lastTime = timestamp;
  }
  if (value.history.at(-1)?.status !== value.status) return false;
  return true;
}
export function parseStoredMail(raw: string | null): { items: Mail[] | null; error: string | null } {
  if (raw === null) return { items: null, error: null };
  if (raw.length > 5_000_000) return { items: null, error: 'Le registre local dépasse la taille autorisée pour cette démonstration.' };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length > 2000 || !parsed.every(validMail)) throw new Error('invalid');
    if (new Set(parsed.map(m => m.id)).size !== parsed.length || new Set(parsed.map(m => m.ref)).size !== parsed.length) throw new Error('duplicates');
    return { items: parsed, error: null };
  } catch { return { items: null, error: 'Le registre local est endommagé ou provient d’une ancienne version. Réinitialisez la démonstration pour retrouver les données fictives.' }; }
}
