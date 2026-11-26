import { useEffect, useState } from 'react';
import { Building2, CheckCheck, CircleCheck, Clock3, Download, FileText, History, Network as NetworkIcon, Plus, Radio, RotateCcw, Send, ShieldCheck, Unplug } from 'lucide-react';
import { institutions } from './domain.ts';
import type { Mail } from './domain.ts';
import { advanceExchange, exchangeStatuses, parseExchanges, prepareExchange, seedExchanges } from './exchange.ts';
import type { DemoExchange, ExchangeStatus } from './exchange.ts';
import { Notice, Modal, Empty, Status, download, formatTime } from './ui';

const storageKey = 'imperium-exchanges-v2';
type Institution = typeof institutions[number];
export interface NetworkProps { items: Mail[]; onCreate: (institution: Institution) => void; onOpen: (mail: Mail) => void; notify: (message: string) => void; }
interface InitialState { exchanges: DemoExchange[]; error: string | null; missing: boolean; corrupt: boolean; }
function loadExchanges(items: Mail[]): InitialState {
  try {
    const raw = localStorage.getItem(storageKey), parsed = parseExchanges(raw);
    if (parsed.error) return { exchanges: [], error: parsed.error, missing: false, corrupt: true };
    return { exchanges: parsed.items ?? seedExchanges(items), error: null, missing: raw === null, corrupt: false };
  } catch { return { exchanges: seedExchanges(items), error: 'Le stockage local est indisponible. Les scénarios affichés ne sont pas encore enregistrés.', missing: true, corrupt: false }; }
}
const actionLabels: Record<ExchangeStatus, string> = {
  'Préparé': 'Simuler la transmission', 'Transmis': 'Simuler la réception', 'Reçu': 'Confirmer l’accusé fictif',
  'Échec': 'Relancer la simulation', 'Accusé confirmé': 'Scénario terminé',
};
const institutionName = (id: string) => institutions.find(institution => institution.id === id)?.name ?? 'Institution fictive inconnue';

export function Network({ items, onCreate, onOpen, notify }: NetworkProps) {
  const [initial] = useState(() => loadExchanges(items));
  const [exchanges, setExchanges] = useState(initial.exchanges);
  const [storageError, setStorageError] = useState<string | null>(initial.error);
  const [corrupt, setCorrupt] = useState(initial.corrupt);
  const eligible = items.filter(mail => mail.kind === 'sortant' && (mail.status === 'Validé' || mail.status === 'Expédié'));
  const [mailId, setMailId] = useState(eligible[0]?.id ?? '');
  const [destinationId, setDestinationId] = useState<string>('partenaire-b');
  const [formError, setFormError] = useState('');
  const [statusFilter, setStatusFilter] = useState<ExchangeStatus | ''>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const selected = exchanges.find(exchange => exchange.id === selectedId);
  const selectedMail = items.find(mail => mail.id === mailId);
  const connected = institutions.filter(institution => institution.connected).length;
  const confirmed = exchanges.filter(exchange => exchange.status === 'Accusé confirmé').length;
  const visible = exchanges.filter(exchange => !statusFilter || exchange.status === statusFilter).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  useEffect(() => {
    if (!initial.missing || initial.corrupt) return;
    try { localStorage.setItem(storageKey, JSON.stringify(initial.exchanges)); setStorageError(null); }
    catch { setStorageError('Le navigateur refuse l’enregistrement local des échanges. Réessayez après avoir autorisé le stockage du site.'); }
  }, [initial]);
  useEffect(() => {
    function sync(event: StorageEvent) {
      if (event.key !== storageKey && event.key !== null) return;
      const parsed = parseExchanges(event.key === null ? null : event.newValue);
      if (parsed.error) { setStorageError(parsed.error); setCorrupt(true); setExchanges([]); setSelectedId(null); return; }
      setExchanges(parsed.items ?? seedExchanges(items)); setStorageError(null); setCorrupt(false); setSelectedId(null);
    }
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [items]);

  function persist(next: DemoExchange[], recovery = false): boolean {
    if (corrupt && !recovery) { setFormError('Réinitialisez d’abord les scénarios locaux endommagés pour préparer ou faire évoluer un échange.'); return false; }
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setExchanges(next); setStorageError(null); setCorrupt(false); return true;
    } catch { setStorageError('L’enregistrement local a échoué. La modification n’a pas été appliquée ; vérifiez la disponibilité du stockage.'); return false; }
  }
  function advance(exchange: DemoExchange) {
    const current = exchanges.find(item => item.id === exchange.id);
    if (!current) { notify('Ce scénario local n’est plus disponible.'); return; }
    const result = advanceExchange(current);
    if (!result.ok) { notify(result.error); return; }
    if (persist(exchanges.map(item => item.id === current.id ? result.value : item))) notify(`${result.value.status} — simulation locale enregistrée, aucun envoi réel.`);
  }
  function exportJournal() {
    download(JSON.stringify({ product: 'IMPERIUM RDC', environment: 'Démonstration locale', simulation: true, exportedAt: new Date().toISOString(), disclaimer: 'Journal local modifiable. Aucune preuve de transmission, de signature ou de réception officielle.', exchanges }, null, 2), 'IMPERIUM-journal-echanges-fictifs.json', 'application/json;charset=utf-8');
  }
  return <div className="network-module">
    <section className="network-banner" aria-labelledby="network-vision-title">
      <div><div className="section-overline">IMPERIUM SECURE EXCHANGE · VISION NATIONALE</div><h2 id="network-vision-title">Relier les institutions.<br />Préserver la confiance.</h2><p>Explorez le parcours d’une correspondance entre espaces fictifs, de sa préparation à l’accusé de réception.</p><div className="network-caption"><span><Radio size={15} aria-hidden="true" /> {connected} espaces fictifs connectés</span><span><CheckCheck size={15} aria-hidden="true" /> {confirmed} accusés simulés</span></div></div><div className="network-symbol" aria-hidden="true"><NetworkIcon size={76} strokeWidth={1.1} /><span>NSEN / PILOTE</span></div>
    </section>
    <Notice><strong>Simulation dans ce navigateur uniquement.</strong> Aucun courrier n’est envoyé, aucun service distant n’est contacté et aucune signature officielle n’est produite. Les statuts servent à distinguer transmission technique et réception administrative.</Notice>
    {storageError && <Notice danger><div role="alert">{storageError}</div><button type="button" className="secondary" onClick={() => setResetOpen(true)}><RotateCcw size={16} /> Réinitialiser les scénarios fictifs</button></Notice>}

    <section aria-labelledby="directory-title">
      <div className="section-title"><div><div className="section-overline">ANNUAIRE DE DÉMONSTRATION</div><h2 id="directory-title">Trois espaces, un parcours commun</h2></div><span className="subtle-chip">Institutions entièrement fictives</span></div>
      <div className="institution-grid">{institutions.map(institution => <article className="institution-card" key={institution.id}>
        <div className="institution-card-top"><div className="institution-monogram" aria-hidden="true">{institution.code}</div><span className={`badge ${institution.connected ? 'green' : 'amber'}`}>{institution.connected ? 'Pilote connecté' : 'Non connecté'}</span></div>
        <span className="section-overline">{institution.type}</span><h3>{institution.name}</h3><p>{institution.description}.</p>
        <div className="network-caption"><Building2 size={16} aria-hidden="true" /><span>Identifiant fictif · {institution.code}</span></div>
        {institution.id === 'pilote-a' ? <div className="network-caption"><ShieldCheck size={16} aria-hidden="true" /><span>Espace émetteur du pilote</span></div> : institution.connected ? <button type="button" className="secondary" onClick={() => onCreate(institution)}><Plus size={16} /> Rédiger pour ce partenaire</button> : <div className="network-caption"><Unplug size={16} aria-hidden="true" /><span>Préparation d’échange bloquée tant que cet espace reste déconnecté.</span></div>}
      </article>)}</div>
    </section>

    <section className="panel" aria-labelledby="exchange-prepare-title">
      <div className="panel-heading"><div><div className="section-overline">PRÉPARATION LOCALE</div><h2 id="exchange-prepare-title">Préparer un échange fictif</h2><p>Choisissez un courrier sortant déjà validé, puis un partenaire connecté.</p></div><Send size={23} aria-hidden="true" /></div>
      <form className="exchange-form" onSubmit={event => {
        event.preventDefault(); setFormError('');
        const mail = items.find(item => item.id === mailId);
        if (!mail) { setFormError('Sélectionnez un courrier sortant validé ou expédié avant de préparer le scénario.'); return; }
        const result = prepareExchange(mail, destinationId, exchanges);
        if (!result.ok) { setFormError(result.error); return; }
        const duplicate = exchanges.some(exchange => exchange.idempotencyKey === result.value.idempotencyKey);
        if (duplicate) { setSelectedId(result.value.id); notify('Ce courrier possède déjà un échange pour ce destinataire. Le scénario existant a été ouvert sans créer de doublon.'); return; }
        if (persist([result.value, ...exchanges])) { setSelectedId(result.value.id); notify('Échange fictif préparé et enregistré dans ce navigateur. Aucun envoi effectué.'); }
      }}>
        <div className="form-grid"><label>Courrier sortant validé<select value={mailId} onChange={event => { setMailId(event.target.value); setFormError(''); }} required aria-describedby="exchange-eligibility"><option value="">Sélectionner un dossier fictif</option>{eligible.map(mail => <option key={mail.id} value={mail.id}>{mail.ref} · {mail.subject}</option>)}</select></label>
          <label>Institution destinataire<select value={destinationId} onChange={event => { setDestinationId(event.target.value); setFormError(''); }} required>{institutions.map(institution => <option key={institution.id} value={institution.id} disabled={!institution.connected || institution.id === selectedMail?.institutionId}>{institution.name}{!institution.connected ? ' · non connectée' : institution.id === selectedMail?.institutionId ? ' · institution émettrice' : ''}</option>)}</select></label></div>
        <p id="exchange-eligibility">{eligible.length ? `${eligible.length} courrier(s) éligible(s). La préparation est idempotente : un courrier et un destinataire donnent un seul scénario.` : 'Aucun courrier sortant n’est encore validé ou expédié. Faites d’abord évoluer un dossier dans le centre de validation.'}</p>
        {formError && <Notice danger><span role="alert">{formError}</span></Notice>}
        <div className="form-actions">{selectedMail && <button type="button" className="secondary" onClick={() => onOpen(selectedMail)}><FileText size={16} /> Consulter le courrier</button>}<button type="submit" className="primary" disabled={!eligible.length || corrupt}><Plus size={17} /> Préparer le scénario</button></div>
      </form>
    </section>

    <section className="panel" aria-labelledby="exchange-list-title">
      <div className="panel-heading"><div><div className="section-overline">SUIVI DES SCÉNARIOS</div><h2 id="exchange-list-title">Journal des échanges fictifs</h2><p>Historique conservé localement, modifiable et sans valeur de preuve.</p></div><button type="button" className="secondary" onClick={exportJournal} disabled={corrupt}><Download size={16} /> Exporter le journal</button></div>
      <div className="exchange-form"><label>Filtrer les échanges par statut<select value={statusFilter} onChange={event => setStatusFilter(event.target.value as ExchangeStatus | '')}><option value="">Tous les scénarios · {exchanges.length}</option>{exchangeStatuses.map(status => <option key={status}>{status}</option>)}</select></label></div>
      <div className="exchange-list">{visible.length ? visible.map(exchange => <article className="exchange-row" key={exchange.id}>
        <div><div className="network-caption"><span>{exchange.mailRef}</span><span className="badge slate">SIMULATION LOCALE</span></div><h3>{exchange.subject}</h3><p>{institutionName(exchange.sourceId)} · vers {institutionName(exchange.destinationId)}</p><div className="network-caption"><Clock3 size={14} aria-hidden="true" /><span>Dernière étape · {formatTime(exchange.updatedAt)}</span></div></div>
        <div className="exchange-status"><Status value={exchange.status} /><button type="button" className="secondary" onClick={() => setSelectedId(exchange.id)}><History size={16} /> Historique</button>{exchange.status !== 'Accusé confirmé' && <button type="button" className="secondary" onClick={() => advance(exchange)} disabled={corrupt}>{exchange.status === 'Échec' ? <RotateCcw size={16} /> : <CheckCheck size={16} />}{actionLabels[exchange.status]}</button>}</div>
      </article>) : <Empty title={corrupt ? 'Scénarios locaux à récupérer' : 'Aucun échange dans cette sélection'} description={corrupt ? 'Réinitialisez les scénarios fictifs avant de poursuivre.' : 'Préparez un courrier éligible ou choisissez un autre filtre de statut.'} />}</div>
    </section>

    {selected && <Modal title={`Échange fictif · ${selected.mailRef}`} onClose={() => setSelectedId(null)} wide>
      <Notice>Ce journal décrit uniquement une simulation locale. « Transmis » ne signifie pas « reçu » ; aucun accusé officiel n’est généré.</Notice><h2>{selected.subject}</h2><dl><dt>Institution émettrice fictive</dt><dd>{institutionName(selected.sourceId)}</dd><dt>Institution destinataire fictive</dt><dd>{institutionName(selected.destinationId)}</dd><dt>Statut du scénario</dt><dd><Status value={selected.status} /></dd><dt>Identifiant local</dt><dd>{selected.id}</dd></dl>
      <ol className="timeline">{selected.history.map((entry, index) => <li key={`${entry.date}-${index}`}><span className="badge slate">Étape {index + 1} · {entry.status}</span><strong>{entry.label}</strong><small>{formatTime(entry.date)}</small></li>)}</ol>
      <div className="form-actions">{items.some(mail => mail.id === selected.mailId) && <button type="button" className="secondary" onClick={() => { const mail = items.find(item => item.id === selected.mailId); if (mail) { setSelectedId(null); onOpen(mail); } }}><FileText size={16} /> Voir le courrier</button>}{selected.status === 'Accusé confirmé' ? <span className="badge green"><CircleCheck size={16} /> Scénario local terminé</span> : <button type="button" className="primary" onClick={() => advance(selected)} disabled={corrupt}>{selected.status === 'Échec' ? <RotateCcw size={17} /> : <CheckCheck size={17} />}{actionLabels[selected.status]}</button>}</div>
    </Modal>}
    {resetOpen && <Modal title="Réinitialiser les échanges fictifs ?" onClose={() => setResetOpen(false)}><p>Les scénarios d’échange de ce navigateur seront remplacés par les exemples initiaux. Les courriers du registre ne seront pas modifiés.</p><div className="form-actions"><button type="button" className="secondary" onClick={() => setResetOpen(false)}>Annuler</button><button type="button" className="primary" onClick={() => { if (persist(seedExchanges(items), true)) { setResetOpen(false); setSelectedId(null); setFormError(''); notify('Scénarios d’échange fictifs réinitialisés et enregistrés localement.'); } }}><RotateCcw size={17} /> Réinitialiser les scénarios</button></div></Modal>}
  </div>;
}
export default Network;

