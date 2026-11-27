import { institutions, type Mail } from './domain.ts';

export const GLOBAL_SEARCH_LIMIT = 12;

export interface GlobalSearchResults {
  items: Mail[];
  total: number;
}

const institutionNames = new Map<string, string>(institutions.map(item => [item.id, `${item.name} ${item.code}`]));

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr')
    .replaceAll('œ', 'oe').replaceAll('æ', 'ae').replace(/\s+/g, ' ').trim();
}

/** Searches the local pilot's metadata, without changing or copying its mail records. */
export function searchMailGlobally(items: readonly Mail[], query: string): GlobalSearchResults {
  const needle = normalize(query);
  if (!needle) return { items: [], total: 0 };
  const terms = needle.split(' ');
  const matches: { mail: Mail; rank: number }[] = [];

  for (const mail of items) {
    const reference = normalize(mail.ref);
    const subject = normalize(mail.subject);
    const metadata = normalize([
      mail.sender, mail.recipient, mail.service, mail.assignee, mail.status, mail.priority,
      mail.kind === 'entrant' ? 'entrant courrier entrant' : 'sortant courrier sortant',
      institutionNames.get(mail.institutionId) || mail.institutionId,
      mail.channel, mail.date, mail.dueDate,
    ].join(' '));
    const haystack = `${reference} ${subject} ${metadata}`;
    if (!terms.every(term => haystack.includes(term))) continue;

    const rank = reference === needle ? 0
      : terms.every(term => reference.includes(term)) ? 1
      : subject === needle ? 2
      : terms.every(term => subject.includes(term)) ? 3
      : terms.some(term => subject.includes(term)) ? 4
      : 5;
    matches.push({ mail, rank });
  }

  matches.sort((a, b) => a.rank - b.rank
    || b.mail.date.localeCompare(a.mail.date)
    || a.mail.ref.localeCompare(b.mail.ref, 'fr', { numeric: true })
    || a.mail.id.localeCompare(b.mail.id));

  return { items: matches.slice(0, GLOBAL_SEARCH_LIMIT).map(result => result.mail), total: matches.length };
}
