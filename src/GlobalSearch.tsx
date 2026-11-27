import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Building2, FileText, Inbox, Search, Send, X } from 'lucide-react';
import type { Mail } from './domain.ts';
import { GLOBAL_SEARCH_LIMIT, searchMailGlobally } from './search.ts';
import { Empty, Modal, Priority, Status, formatDate } from './ui';
import './global-search.css';

export interface GlobalSearchProps {
  items: readonly Mail[];
  onClose: () => void;
  onOpen: (mail: Mail) => void;
}

export function GlobalSearch({ items, onClose, onOpen }: GlobalSearchProps) {
  const prefix = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchMailGlobally(items, query), [items, query]);
  const hasQuery = Boolean(query.trim());
  const hintId = `${prefix}-hint`;
  const countId = `${prefix}-count`;

  // Modal opens its native dialog in a child effect, before this parent effect runs.
  useEffect(() => { inputRef.current?.focus({ preventScroll: true }); }, []);

  function clear() {
    setQuery('');
    inputRef.current?.focus();
  }

  return <Modal title="Recherche globale" onClose={onClose} wide>
    <div className="global-search">
      <label className="global-search-label" htmlFor={`${prefix}-input`}>Rechercher dans tous les courriers</label>
      <div className="global-search-field">
        <Search size={21} aria-hidden="true" />
        <input ref={inputRef} id={`${prefix}-input`} type="search" autoFocus autoComplete="off" spellCheck={false} maxLength={180} value={query} onChange={event => setQuery(event.target.value)} aria-describedby={`${hintId} ${countId}`} placeholder="Référence, objet, service…" />
        {query && <button className="global-search-clear" type="button" onClick={clear} aria-label="Effacer la recherche"><X size={18} aria-hidden="true" /></button>}
      </div>
      <p className="global-search-hint" id={hintId}>Combinez plusieurs mots, avec ou sans accents. La recherche porte sur les références, les objets et les métadonnées du registre local.</p>

      <div className="global-search-summary" role="status" aria-live="polite" aria-atomic="true" id={countId}>
        <strong>{hasQuery ? `${results.total} courrier${results.total === 1 ? '' : 's'} trouvé${results.total === 1 ? '' : 's'}` : `${items.length} courrier${items.length === 1 ? '' : 's'} fictif${items.length === 1 ? '' : 's'} dans le registre`}</strong>
        {results.total > GLOBAL_SEARCH_LIMIT && <span>Les {GLOBAL_SEARCH_LIMIT} premiers résultats sont affichés. Précisez votre recherche pour affiner la liste.</span>}
      </div>

      {!hasQuery ? <div className="global-search-start">
        <span className="global-search-empty-icon"><Search size={27} aria-hidden="true" /></span>
        <h3>Retrouvez un courrier fictif</h3>
        <p>Saisissez une référence, un mot de l’objet, un service ou un statut pour commencer.</p>
        <span className="global-search-example">Exemple : « coordination urgente »</span>
      </div> : results.items.length ? <ul className="global-search-results" aria-label="Résultats de la recherche globale">
        {results.items.map(mail => <li key={mail.id}>
          <button className="global-search-result" type="button" onClick={() => onOpen(mail)}>
            <div className="global-search-result-content">
              <div className="global-search-result-heading">
                <span className="global-search-reference">{mail.ref}</span>
                <span className="global-search-kind">{mail.kind === 'entrant' ? <Inbox size={14} aria-hidden="true" /> : <Send size={14} aria-hidden="true" />}{mail.kind === 'entrant' ? 'Entrant' : 'Sortant'}</span>
              </div>
              <strong className="global-search-subject">{mail.subject}</strong>
              <span className="global-search-service"><Building2 size={15} aria-hidden="true" /><span>{mail.service}</span></span>
              <div className="global-search-result-meta"><Status value={mail.status} /><Priority value={mail.priority} /><span className="global-search-date">{formatDate(mail.date, true)}</span></div>
            </div>
            <FileText className="global-search-open-icon" size={19} aria-hidden="true" />
          </button>
        </li>)}
      </ul> : <Empty title="Aucun courrier ne correspond" description="Essayez un autre mot ou retirez un critère. Tous les mots saisis doivent être présents dans les métadonnées du dossier." />}

      <div className="global-search-footer"><span>Recherche locale · Données fictives · Aucune pièce jointe réelle indexée</span><span className="global-search-keyboard">Tab pour parcourir · Entrée pour ouvrir un résultat</span></div>
    </div>
  </Modal>;
}

export default GlobalSearch;
