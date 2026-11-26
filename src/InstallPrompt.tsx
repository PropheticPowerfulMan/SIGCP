import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { CheckCircle2, Download, LoaderCircle, MonitorSmartphone, RefreshCw, Share2, WifiOff } from 'lucide-react';
import { Modal, Notice } from './ui';
import { applyPwaUpdate, getPwaServerState, getPwaState, initializePwaEvents, installationGuide, promptNativeInstall, subscribePwa } from './pwa';
import './pwa.css';

export interface InstallPromptProps { compact?: boolean; className?: string; updateBlocked?: boolean; }

export function InstallPrompt({ compact = false, className = '', updateBlocked = false }: InstallPromptProps) {
  const pwa = useSyncExternalStore(subscribePwa, getPwaState, getPwaServerState);
  const [guideOpen, setGuideOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const installing = useRef(false);
  const [message, setMessage] = useState('');
  const guide = installationGuide();
  const nativeInstalling = busy && installing.current;
  const updating = busy && !installing.current;

  async function install() {
    if (installing.current) return;
    setMessage('');
    if (!getPwaState().canInstall) { setGuideOpen(true); return; }
    installing.current = true;
    setBusy(true);
    try {
      const result = await promptNativeInstall();
      if (result === 'unavailable') setGuideOpen(true);
      else if (result === 'dismissed') setMessage('Installation annulée. Vous pouvez la relancer quand vous le souhaitez.');
      else setMessage('Installation acceptée par le navigateur.');
    } finally { installing.current = false; setBusy(false); }
  }

  useEffect(() => {
    initializePwaEvents();
    const requested = () => { void install(); };
    window.addEventListener('imperium:request-install', requested);
    return () => window.removeEventListener('imperium:request-install', requested);
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(''), 6500);
    return () => window.clearTimeout(timer);
  }, [message]);

  return <div className={'pwa-control ' + className}>
    {pwa.offline && <span className="pwa-offline" role="status"><WifiOff size={15} /><span>{pwa.shellReady ? 'Hors connexion · pilote local' : 'Connexion indisponible'}</span></span>}
    {pwa.installed ? <span className="pwa-installed" role="status" aria-label="Application installée sur cet appareil" title="Cette application est installée sur cet appareil"><CheckCircle2 size={16} />{!compact && 'Application installée'}</span> : <button className="pwa-install-button" type="button" data-testid="pwa-install" onClick={() => { void install(); }} disabled={busy} aria-busy={nativeInstalling} aria-label={nativeInstalling ? 'Installation d’IMPERIUM RDC en cours' : 'Installer IMPERIUM RDC sur cet appareil'}>{nativeInstalling ? <LoaderCircle size={16} className="button-spinner" aria-hidden="true" /> : <Download size={16} aria-hidden="true" />}<span>{nativeInstalling ? 'Installation…' : compact ? 'Installer' : 'Installer l’application'}</span></button>}
    {pwa.updateReady && <button className="pwa-update-button" type="button" onClick={() => setUpdateOpen(true)} disabled={busy} aria-busy={updating} aria-label={updating ? 'Mise à jour en cours' : 'Une nouvelle version est disponible'}>{updating ? <LoaderCircle size={15} className="button-spinner" aria-hidden="true" /> : <RefreshCw size={15} aria-hidden="true" />}<span>{updating ? 'Mise à jour…' : 'Nouvelle version'}</span></button>}
    {message && <span className="pwa-feedback" role="status">{message}</span>}
    {guideOpen && <Modal title="Installer IMPERIUM RDC" onClose={() => setGuideOpen(false)}>
      <div className="pwa-guide-heading"><span><MonitorSmartphone size={28} /></span><div><h3>Votre espace, à portée de main.</h3><p>Une icône dédiée et une fenêtre adaptée à votre appareil.</p></div></div>
      <div className="pwa-platform"><Share2 size={17} /><strong>{guide.platform}</strong></div>
      <ol className="pwa-guide-steps">{guide.steps.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol>
      <Notice>La possibilité d’installer dépend de votre navigateur et de votre système. Après une première ouverture en ligne, la coque du pilote peut fonctionner hors connexion. Les courriers et les journaux restent locaux ; aucune donnée réelle ne doit être saisie.</Notice>
      {pwa.registrationError && <Notice danger>La préparation hors connexion n’a pas abouti sur ce navigateur. Vérifiez la connexion puis rouvrez la version publiée avant de l’utiliser hors ligne.</Notice>}
      <div className="form-actions"><button className="primary" type="button" onClick={() => setGuideOpen(false)}>J’ai compris</button></div>
    </Modal>}
    {updateOpen && <Modal title="Une nouvelle version est prête" onClose={() => setUpdateOpen(false)}>
      <p>La mise à jour rechargera l’application. Terminez et enregistrez les formulaires en cours avant de continuer. Vos dossiers fictifs enregistrés dans ce navigateur seront conservés.</p>
      {updateBlocked && <Notice danger>Un formulaire est en cours d’édition. Fermez cette fenêtre et terminez votre saisie avant de mettre à jour.</Notice>}
      <div className="form-actions"><button className="secondary" type="button" onClick={() => setUpdateOpen(false)}>Plus tard</button><button className="primary" type="button" disabled={updateBlocked || busy} aria-busy={updating} onClick={() => { if (updateBlocked) return; setBusy(true); if (!applyPwaUpdate()) { setBusy(false); setUpdateOpen(false); setMessage('La nouvelle version n’est plus en attente. Rouvrez l’application pour vérifier.'); } }}>{updating ? <LoaderCircle size={16} className="button-spinner" aria-hidden="true" /> : <RefreshCw size={16} aria-hidden="true" />}{updating ? 'Mise à jour…' : 'Actualiser l’application'}</button></div>
    </Modal>}
  </div>;
}
export default InstallPrompt;
