import { useId, useState, type FormEvent } from 'react';
import {
  Archive,
  Building2,
  Check,
  CircleHelp,
  Download,
  FileText,
  Fingerprint,
  GitBranch,
  Inbox,
  KeyRound,
  LockKeyhole,
  LogIn,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';
import { Modal } from './ui';
import './login.css';

export interface LoginProps {
  onEnter: (role?: string) => void;
  onInstall?: () => void;
}

const emblem = '/SIGCP/brand/emblem-presidence.jpg';
const profiles = [
  {
    name: 'Agent pilote',
    initials: 'AP',
    description: 'Enregistrer et suivre les dossiers fictifs.',
  },
  {
    name: 'Responsable du courrier',
    initials: 'RC',
    description: 'Présenter la coordination des services pilotes.',
  },
  {
    name: 'Autorité de validation',
    initials: 'AV',
    description: 'Examiner et valider les courriers fictifs.',
  },
] as const;

/** Entry to the synthetic pilot. It does not authenticate an institutional identity. */
export function Login({ onEnter, onInstall }: LoginProps) {
  const selectId = useId();
  const descriptionId = useId();
  const [profileName, setProfileName] = useState<string>(profiles[0].name);
  const [identityInfo, setIdentityInfo] = useState(false);
  const [error, setError] = useState('');
  const profile = profiles.find((item) => item.name === profileName) ?? profiles[0];

  function enter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!profiles.some((item) => item.name === profileName)) {
      setError('Choisissez un profil de démonstration dans la liste.');
      return;
    }
    try {
      onEnter(profileName);
    } catch {
      setError('L’espace de démonstration n’a pas pu s’ouvrir. Réessayez dans quelques instants.');
    }
  }

  return (
    <div className="login-page">
      <a className="login-skip" href="#login-access" onClick={(event) => { event.preventDefault(); const access = document.getElementById('login-access'); access?.focus(); access?.scrollIntoView({ block: 'start' }); }}>Aller à l’accès au pilote</a>
      <div className="login-country-line" aria-hidden="true"><i /><i /><i /></div>

      <header className="login-header">
        <div className="login-brand">
          <img src={emblem} alt="Emblème fourni de la Présidence de la République démocratique du Congo" width="60" height="60" />
          <span><strong>IMPERIUM<span> RDC</span></strong><small>SYSTÈME INTÉGRÉ DE GESTION DES COURRIERS PRÉSIDENTIELS</small></span>
        </div>
        <div className="login-header-context"><span className="login-pilot-dot" /><span>ESPACE DE DÉMONSTRATION</span></div>
      </header>

      <main className="login-main">
        <section className="login-vision" aria-labelledby="login-vision-title">
          <div className="login-vision-grid" aria-hidden="true" />
          <div className="login-vision-content">
            <div className="login-institution"><span>RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</span><strong>Présidence de la République</strong><small>Secrétariat Général · DANTIC</small></div>
            <div className="login-editorial">
              <span className="login-overline">LA CONTINUITÉ DE L’ÉTAT COMMENCE PAR L’INFORMATION</span>
              <h2 id="login-vision-title">Une information maîtrisée.<br /><em>Une action mieux coordonnée.</em></h2>
              <p>De la réception à l’archivage, chaque correspondance trouve sa place. Chaque étape de traitement devient lisible.</p>
            </div>

            <div className="login-workflow-visual" aria-hidden="true">
              <div className="login-visual-orbit" />
              <div className="login-paper login-paper-back" />
              <div className="login-paper">
                <div className="login-paper-heading"><img src={emblem} alt="" width="42" height="42" /><span>IMPERIUM RDC<small>CORRESPONDANCE PILOTE</small></span></div>
                <div className="login-paper-rule" />
                <div className="login-paper-lines"><i /><i /><i /></div>
                <div className="login-paper-state"><span /><span>Dossier enregistré</span><Check size={15} /></div>
              </div>
              <div className="login-trace-card"><span className="login-trace-icon"><GitBranch size={19} /></span><div><strong>Un parcours, une trace.</strong><small>Réception · Traitement · Archivage</small></div><span className="login-trace-check"><Check size={13} /></span></div>
            </div>

            <div className="login-capabilities" aria-label="Parcours du pilote">
              <div><Inbox size={20} /><span>Courriers<small>Un registre organisé</small></span></div>
              <div><GitBranch size={20} /><span>Circuits<small>Des étapes lisibles</small></span></div>
              <div><Archive size={20} /><span>Archives<small>Une mémoire préservée</small></span></div>
            </div>
          </div>
          <div className="login-vision-footer"><span className="login-vision-rule" /><span>SOUVERAINETÉ · CONTINUITÉ · TRAÇABILITÉ</span></div>
        </section>

        <section className="login-access" id="login-access" tabIndex={-1} aria-labelledby="login-title">
          <div className="login-access-inner">
            <span className="login-access-label"><span /> ACCÈS AU PILOTE</span>
            <h1 id="login-title">Bienvenue dans<br />votre espace.</h1>
            <p className="login-intro">Découvrez une nouvelle manière de suivre et de coordonner les correspondances institutionnelles.</p>

            <form className="login-form" onSubmit={enter}>
              <label htmlFor={selectId}>Profil de démonstration</label>
              <div className="login-select-wrap"><UsersRound size={20} aria-hidden="true" /><select id={selectId} value={profileName} onChange={(event) => { setProfileName(event.target.value); setError(''); }} aria-describedby={descriptionId}>{profiles.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}</select></div>
              <div className="login-profile-preview" id={descriptionId}><span className="login-profile-avatar">{profile.initials}</span><div><strong>{profile.name}</strong><p>{profile.description}</p></div><span className="login-profile-check"><Check size={14} /></span></div>
              {error && <p className="login-error" role="alert">{error}</p>}
              <button className="login-enter" type="submit"><LogIn size={19} />Ouvrir la démonstration</button>
              <p className="login-no-credentials"><LockKeyhole size={14} />Aucun identifiant ni mot de passe réel requis</p>
            </form>

            {onInstall && <button className="login-install" type="button" onClick={onInstall}><span className="login-install-icon"><Download size={20} /></span><span><strong>Installer l’application</strong><small>Retrouver IMPERIUM RDC depuis votre appareil</small></span><span className="login-install-tag">PWA</span></button>}

            <div className="login-institutional"><span className="login-institutional-icon"><ShieldCheck size={20} /></span><div><h2>Connexion institutionnelle</h2><p>L’identité OIDC, le MFA et les habilitations serveur sont prévus pour l’infrastructure cible.</p><button type="button" onClick={() => setIdentityInfo(true)}>Comprendre cet accès <CircleHelp size={14} /></button></div></div>

            <div className="login-demo-notice"><FileText size={18} /><p><strong>Des données fictives, un parcours concret.</strong> Ce pilote est une proposition technique non homologuée. Les profils servent à présenter les usages et ne constituent pas des habilitations de sécurité.</p></div>
          </div>
        </section>
      </main>

      <footer className="login-footer"><span>IMPERIUM RDC <b>·</b> L’information au service de l’État.</span><span>Initiateur et concepteur : <strong>LOKALA LOMBOTO Jonathan</strong></span></footer>

      {identityInfo && <Modal title="Connexion institutionnelle" onClose={() => setIdentityInfo(false)}><div className="login-identity-intro"><ShieldCheck size={28} /><h3>Une identité vérifiée sur l’infrastructure cible.</h3><p>Cette démonstration n’est connectée à aucun annuaire institutionnel et ne collecte aucun mot de passe. Son entrée par profil ouvre uniquement un espace local à données fictives.</p></div><ul className="login-identity-list"><li><KeyRound size={20} /><div><strong>Identité institutionnelle</strong><p>Un fournisseur approuvé compatible OIDC assurera la connexion et la gestion des sessions.</p></div></li><li><Fingerprint size={20} /><div><strong>Authentification multifacteur</strong><p>Le MFA et les mécanismes de réauthentification devront être intégrés et vérifiés avant tout usage réel.</p></div></li><li><Building2 size={20} /><div><strong>Habilitations côté serveur</strong><p>Les rôles, services et classifications devront être contrôlés par le backend, indépendamment de l’interface.</p></div></li></ul><button type="button" className="login-info-close" onClick={() => setIdentityInfo(false)}>Revenir à l’accès au pilote</button></Modal>}
    </div>
  );
}

export default Login;
