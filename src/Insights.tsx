import { useId } from 'react';
import {
  Archive, ChartNoAxesCombined, CheckCheck,
  ChevronRight, Clock3, FileCheck2, Inbox, Layers3,
  Send, ShieldCheck, TriangleAlert,
} from 'lucide-react';
import { filterMail, getStats, type Mail, type MailFilters } from './domain.ts';
import { formatDate, Priority, Status } from './ui';

type Navigate = (page: string, filters?: MailFilters) => void;
type DashboardProps = { items: Mail[]; onNavigate: Navigate; onOpen: (mail: Mail) => void };
type AnalyticsProps = { items: Mail[]; onService: (service: string) => void };
type Icon = typeof Inbox;
type Statistics = ReturnType<typeof getStats>;

function Metric({ label, value, description, icon: Icon, color, action }: {
  label: string; value: number | string; description: string; icon: Icon;
  color: 'blue' | 'green' | 'amber' | 'red'; action?: () => void;
}) {
  const content = <>
    <div className="metric-top"><span>{label}</span><span className={`metric-icon ${color}`}><Icon size={19} aria-hidden="true" /></span></div>
    <strong>{typeof value === 'number' ? value.toLocaleString('fr-FR') : value}</strong>
    <p>{description}</p>
  </>;
  return action
    ? <button className="metric panel metric-action" onClick={action}>{content}</button>
    : <article className="metric panel">{content}</article>;
}

function TrendChart({ trend }: { trend: Statistics['weeklyTrend'] }) {
  const id = useId();
  const peak = Math.max(1, ...trend.flatMap(day => [day.incoming, day.outgoing]));
  const ceiling = Math.max(2, Math.ceil(peak / 2) * 2);
  const incoming = trend.reduce((sum, day) => sum + day.incoming, 0);
  const outgoing = trend.reduce((sum, day) => sum + day.outgoing, 0);
  return <figure className="trend-chart" aria-labelledby={`${id}-caption`}>
    <figcaption className="sr-only" id={`${id}-caption`}>Courriers enregistrés sur les sept derniers jours : {incoming} entrants et {outgoing} sortants. Chaque journée indique les valeurs exactes.</figcaption>
    <div className="chart-y" aria-hidden="true"><span>{ceiling}</span><span>{ceiling / 2}</span><span>0</span></div>
    <div className="chart-plot">
      {trend.map(day => {
        const label = new Date(`${day.date}T12:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
        const summary = `${label} : ${day.incoming} entrant${day.incoming > 1 ? 's' : ''}, ${day.outgoing} sortant${day.outgoing > 1 ? 's' : ''}`;
        return <div className="trend-day" key={day.date} tabIndex={0} role="group" aria-label={summary} title={summary}>
          <div className="trend-bars" aria-hidden="true">
            <span className="trend-bar incoming" style={{ height: `${day.incoming / ceiling * 100}%`, minHeight: day.incoming ? 5 : 2 }} />
            <span className="trend-bar outgoing" style={{ height: `${day.outgoing / ceiling * 100}%`, minHeight: day.outgoing ? 5 : 2 }} />
          </div>
          <span aria-hidden="true">{new Date(`${day.date}T12:00:00`).toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '')}</span>
        </div>;
      })}
    </div>
    <div className="chart-legend"><span><i className="legend-blue" />Entrants <b>{incoming}</b></span><span><i className="legend-gold" />Sortants <b>{outgoing}</b></span><small>7 derniers jours</small></div>
  </figure>;
}

export function Dashboard({ items, onNavigate, onOpen }: DashboardProps) {
  const stats = getStats(items);
  const recent = filterMail(items, { sortBy: 'date', sortDirection: 'desc' }).slice(0, 5);
  const urgentCount = items.filter(mail => mail.priority === 'Urgente').length;
  const priorities = [
    { label: 'En attente de validation', description: 'Examiner les dossiers du circuit pilote', value: stats.pendingValidation, icon: CheckCheck, page: 'validation', filters: { status: 'En validation' } as MailFilters, tone: 'amber' },
    { label: 'Courriers urgents', description: 'Consulter les dossiers à priorité urgente', value: urgentCount, icon: TriangleAlert, page: 'workflow', filters: { priority: 'Urgente' } as MailFilters, tone: 'red' },
    { label: 'Dossiers archivés', description: 'Retrouver les correspondances clôturées', value: stats.archived, icon: Archive, page: 'documents', filters: { status: 'Archivé' } as MailFilters, tone: 'blue' },
  ];
  return <>
    <section className="hero" aria-labelledby="pilot-hero-title">
      <div className="hero-copy">
        <span className="hero-eyebrow">L’INFORMATION AU SERVICE DE L’ACTION PUBLIQUE</span>
        <h2 id="pilot-hero-title">Une information maîtrisée.<br /><em>Une action mieux coordonnée.</em></h2>
        <p>Du premier enregistrement à l’archivage, chaque courrier trouve sa place. Chaque décision conserve son histoire.</p>
        <button className="hero-button" onClick={() => onNavigate('workflow')}>Explorer le registre <ChevronRight size={16} aria-hidden="true" /></button>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="hero-grid" /><div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <img className="hero-presidential-emblem" src="/SIGCP/brand/emblem-presidence.jpg" alt="" width="709" height="709" />
        <span className="visual-caption"><span />RÉCEPTION · TRAITEMENT · ARCHIVAGE</span>
      </div>
    </section>
    <section className="stats-grid" aria-label="Indicateurs du registre de démonstration">
      <Metric label="Courriers enregistrés" value={stats.total} description={`${stats.incoming} entrants · ${stats.outgoing} sortants`} icon={Inbox} color="blue" action={() => onNavigate('workflow')} />
      <Metric label="Dossiers en cours" value={stats.inProgress} description={`${stats.pendingValidation} en attente de validation`} icon={Clock3} color="amber" />
      <Metric label="Traitement terminé" value={stats.completed} description={`${stats.completionRate} % du registre · validés, expédiés ou archivés`} icon={CheckCheck} color="green" />
      <Metric label="Échéances dépassées" value={stats.overdue} description="Dossiers actifs à examiner en priorité" icon={TriangleAlert} color="red" action={() => onNavigate('workflow', { onlyOverdue: true })} />
    </section>
    <div className="dashboard-columns">
      <section className="panel activity-panel" aria-labelledby="activity-title">
        <div className="panel-heading"><div><span className="section-overline">LE RYTHME DE VOTRE ACTIVITÉ</span><h3 id="activity-title">Les correspondances en mouvement</h3><p>Volumes enregistrés dans votre espace pilote</p></div><span className="subtle-chip">Cette semaine</span></div>
        <TrendChart trend={stats.weeklyTrend} />
      </section>
      <section className="panel attention-panel" aria-labelledby="attention-title">
        <div className="panel-heading"><div><span className="section-overline">VOTRE ESPACE DE DÉCISION</span><h3 id="attention-title">L’essentiel à suivre</h3><p>Les dossiers qui méritent votre attention</p></div><Layers3 size={21} aria-hidden="true" /></div>
        <div className="attention-list">{priorities.map(priority => <button className="attention-row" key={priority.label} onClick={() => onNavigate(priority.page, priority.filters)}>
          <span className={`metric-icon ${priority.tone}`}><priority.icon size={18} aria-hidden="true" /></span>
          <span><strong>{priority.label}</strong><small>{priority.description}</small></span><b>{priority.value}</b><ChevronRight size={16} aria-hidden="true" />
        </button>)}</div>
        <div className="quiet-note"><ShieldCheck size={17} aria-hidden="true" /><p>Un espace pilote pour éprouver les parcours, avec des institutions et des courriers fictifs.</p></div>
      </section>
    </div>
    <section className="panel register recent-register" aria-labelledby="recent-title">
      <div className="panel-heading"><div><span className="section-overline">AU FIL DU REGISTRE</span><h3 id="recent-title">Dernières correspondances</h3><p>Les cinq enregistrements les plus récents</p></div><button className="text-button" onClick={() => onNavigate('workflow')}>Tout le registre <ChevronRight size={16} aria-hidden="true" /></button></div>
      {recent.length ? <><div className="table-scroll" tabIndex={0} role="region" aria-label="Dernières correspondances, tableau défilant"><table><caption className="sr-only">Derniers courriers du registre fictif</caption><thead><tr><th scope="col">CORRESPONDANCE</th><th scope="col">EXPÉDITEUR FICTIF</th><th scope="col">PRIORITÉ</th><th scope="col">STATUT</th><th scope="col">RÉCEPTION</th><th scope="col"><span className="sr-only">Consulter le dossier</span></th></tr></thead><tbody>{recent.map(mail => <tr key={mail.id}>
        <td><button className="mail-title" onClick={() => onOpen(mail)}><span className="reference">{mail.ref}</span><strong>{mail.subject}</strong></button></td>
        <td>{mail.sender}<small>{mail.service}</small></td>
        <td><Priority value={mail.priority} /></td><td><Status value={mail.status} /></td><td className="date-cell">{formatDate(mail.date)}</td>
        <td><button className="row-action" aria-label={`Consulter ${mail.ref}`} onClick={() => onOpen(mail)}><ChevronRight size={17} aria-hidden="true" /></button></td>
      </tr>)}</tbody></table></div><div className="table-footer"><span>{recent.length} sur {stats.total} correspondances</span><span>Registre de démonstration</span></div></> : <div className="empty-state"><Inbox size={31} aria-hidden="true" /><h3>Votre registre est prêt</h3><p>Enregistrez un premier courrier fictif pour suivre son évolution.</p></div>}
    </section>
  </>;
}

export function Analytics({ items, onService }: AnalyticsProps) {
  const stats = getStats(items);
  const maxService = Math.max(1, ...stats.byService.map(service => service.total));
  return <>
    <section className="stats-grid" aria-label="Synthèse statistique du pilote">
      <Metric label="Volume total" value={stats.total} description="Courriers présents dans le registre" icon={Inbox} color="blue" />
      <Metric label="Taux de traitement" value={`${stats.completionRate} %`} description={`${stats.completed} dossiers validés, expédiés ou archivés`} icon={CheckCheck} color="green" />
      <Metric label="Délai moyen observé" value={`${stats.averageDays.toLocaleString('fr-FR')} j`} description="De la réception à la première validation" icon={Clock3} color="amber" />
      <Metric label="Échéances dépassées" value={stats.overdue} description="Dossiers actifs hors délai dans le pilote" icon={TriangleAlert} color="red" />
    </section>
    <div className="analytics-grid">
      <section className="panel" aria-labelledby="service-chart-title">
        <div className="panel-heading"><div><span className="section-overline">RÉPARTITION DU REGISTRE</span><h3 id="service-chart-title">L’activité par service</h3><p>Sélectionnez un service pour ouvrir ses correspondances</p></div><ChartNoAxesCombined size={22} aria-hidden="true" /></div>
        <div className="service-chart">{stats.byService.map((service, index) => <button className="service-row" key={service.name} onClick={() => onService(service.name)} aria-label={`${service.name} : ${service.total} courriers, dont ${service.active} actifs. Consulter le registre.`}>
          <span className="service-row-label"><strong>{service.name}</strong><b>{service.total}</b></span>
          <span className="service-track" aria-hidden="true"><span className={`service-fill fill-${index}`} style={{ width: `${service.total / maxService * 100}%` }} /></span>
          <span className="service-row-meta"><small>{service.active} dossier{service.active > 1 ? 's' : ''} actif{service.active > 1 ? 's' : ''}</small><ChevronRight size={14} aria-hidden="true" /></span>
        </button>)}</div>
        <div className="quiet-note"><Layers3 size={17} aria-hidden="true" /><p>Les services présentés sont des structures fictives. Cette répartition ne représente aucun organigramme officiel.</p></div>
      </section>
      <section className="panel" aria-labelledby="completion-title">
        <div className="panel-heading"><div><span className="section-overline">AVANCEMENT DES DOSSIERS</span><h3 id="completion-title">Du courrier à l’aboutissement</h3><p>Une mesure calculée sur le registre courant</p></div><CheckCheck size={22} aria-hidden="true" /></div>
        <div className="completion-visual">
          <div className="completion-ring" role="img" aria-label={`${stats.completionRate} pour cent des dossiers ont terminé leur traitement : ${stats.completed} sur ${stats.total}.`} style={{ background: `conic-gradient(var(--gold, #c5a761) 0% ${stats.completionRate}%, var(--line, #e8edf2) ${stats.completionRate}% 100%)` }}>
            <div><strong>{stats.completionRate}<span>%</span></strong><small>de traitement terminé</small></div>
          </div>
          <div className="completion-legend"><span><i className="legend-gold" /><strong>{stats.completed}</strong> terminés</span><span><i className="legend-blue" /><strong>{stats.inProgress}</strong> en cours</span></div>
        </div>
        <div className="quiet-note"><FileCheck2 size={17} aria-hidden="true" /><p>Un dossier est compté comme terminé lorsqu’il est validé, expédié ou archivé dans le circuit fictif.</p></div>
      </section>
    </div>
    <div className="analytics-grid analytics-bottom">
      <section className="panel" aria-labelledby="weekly-analysis-title">
        <div className="panel-heading"><div><span className="section-overline">TENDANCE HEBDOMADAIRE</span><h3 id="weekly-analysis-title">Entrants et sortants</h3><p>Les sept derniers jours de réception</p></div><span className="subtle-chip"><Inbox size={13} aria-hidden="true" /> {stats.incoming} / <Send size={13} aria-hidden="true" /> {stats.outgoing}</span></div>
        <TrendChart trend={stats.weeklyTrend} />
      </section>
      <section className="panel" aria-labelledby="status-analysis-title">
        <div className="panel-heading"><div><span className="section-overline">LECTURE DU CIRCUIT</span><h3 id="status-analysis-title">Répartition par statut</h3><p>Le nombre de dossiers à chaque étape</p></div><Layers3 size={22} aria-hidden="true" /></div>
        <dl className="status-breakdown">{stats.byStatus.map(status => <div key={status.name}><dt><Status value={status.name} /></dt><dd><strong>{status.total}</strong><span>{stats.total ? Math.round(status.total / stats.total * 100) : 0} %</span></dd></div>)}</dl>
      </section>
    </div>
  </>;
}



