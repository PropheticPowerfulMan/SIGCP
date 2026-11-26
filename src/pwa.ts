/// <reference types="vite/client" />

export interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}
export interface PwaState {
  installed: boolean;
  canInstall: boolean;
  updateReady: boolean;
  offline: boolean;
  shellReady: boolean;
  registrationError: boolean;
}

const listeners = new Set<() => void>();
const serverSnapshot: PwaState = { installed: false, canInstall: false, updateReady: false, offline: false, shellReady: false, registrationError: false };
let state: PwaState = { ...serverSnapshot };
let initialized = false;
let deferredPrompt: InstallPromptEvent | null = null;
let registration: ServiceWorkerRegistration | null = null;
let registrationPromise: Promise<ServiceWorkerRegistration | null> | null = null;
let reloadRequested = false;

function update(next: Partial<PwaState>) {
  if (!Object.entries(next).some(([key, value]) => state[key as keyof PwaState] !== value)) return;
  state = { ...state, ...next };
  listeners.forEach(listener => listener());
}
export function getPwaState() { return state; }
export function getPwaServerState() { return serverSnapshot; }
export function subscribePwa(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}
export function initializePwaEvents() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  update({ installed: isStandalone(), offline: !navigator.onLine });
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event as InstallPromptEvent;
    update({ canInstall: true });
  });
  window.addEventListener('appinstalled', () => { deferredPrompt = null; update({ installed: true, canInstall: false }); });
  window.addEventListener('online', () => update({ offline: false }));
  window.addEventListener('offline', () => update({ offline: true }));
  const display = window.matchMedia('(display-mode: standalone)');
  display.addEventListener?.('change', () => update({ installed: isStandalone() }));
}

/** Synchronous event dispatch preserves the browser's user activation. */
export function requestPwaInstall() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('imperium:request-install'));
}

export async function promptNativeInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  const event = deferredPrompt;
  if (!event) return 'unavailable';
  deferredPrompt = null;
  update({ canInstall: false });
  try {
    await event.prompt();
    const choice = await event.userChoice;
    if (choice.outcome === 'accepted') update({ installed: true });
    return choice.outcome;
  } catch { return 'unavailable'; }
}

/** Does not reload unless a person explicitly confirms the waiting update. */
export function applyPwaUpdate(): boolean {
  if (!registration?.waiting) return false;
  reloadRequested = true;
  try { registration.waiting.postMessage({ type: 'SKIP_WAITING' }); return true; }
  catch { reloadRequested = false; return false; }
}

export function registerPwa(): Promise<ServiceWorkerRegistration | null> {
  initializePwaEvents();
  if (!import.meta.env.PROD || !('serviceWorker' in navigator) || !window.isSecureContext) return Promise.resolve(null);
  if (registrationPromise) return registrationPromise;
  registrationPromise = (async () => {
    try {
      registration = await navigator.serviceWorker.register('/SIGCP/sw.js', { scope: '/SIGCP/', updateViaCache: 'none' });
      const observed = registration;
      const showWaiting = () => update({ updateReady: !!observed.waiting });
      showWaiting();
      observed.addEventListener('updatefound', () => {
        const worker = observed.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed') {
            showWaiting();
            if (!navigator.serviceWorker.controller && observed.active) update({ shellReady: true });
          } else if (worker.state === 'redundant') {
            update({ registrationError: true, shellReady: !!observed.active });
          }
        });
      });
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        update({ shellReady: !!navigator.serviceWorker.controller, updateReady: false });
        if (reloadRequested) { reloadRequested = false; window.location.reload(); }
      });
      void navigator.serviceWorker.ready.then(ready => { if (ready.scope.endsWith('/SIGCP/')) update({ shellReady: true }); });
      let lastCheck = Date.now();
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && navigator.onLine && Date.now() - lastCheck > 15 * 60 * 1000) {
          lastCheck = Date.now();
          void observed.update().catch(() => {});
        }
      });
      update({ shellReady: !!observed.active, registrationError: false });
      return observed;
    } catch {
      update({ registrationError: true, shellReady: false });
      return null;
    }
  })();
  return registrationPromise;
}

export function installationGuide(userAgent = navigator.userAgent) {
  if (/iPhone|iPad|iPod/i.test(userAgent) || (/Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1)) {
    return { platform: 'iPhone et iPad', steps: ['Ouvrez la démonstration dans Safari.', 'Touchez Partager, puis « Sur l’écran d’accueil » ou « Ajouter à l’écran d’accueil ».', 'Conservez le nom IMPERIUM RDC, activez « Ouvrir comme app » si proposé, puis touchez Ajouter.'] };
  }
  if (/Android/i.test(userAgent)) return { platform: 'Téléphone et tablette Android', steps: ['Ouvrez la démonstration dans Chrome ou Samsung Internet.', 'Ouvrez le menu du navigateur, puis « Installer l’application » ou « Ajouter à l’écran d’accueil ».', 'Confirmez l’installation proposée. Le libellé et le type d’installation dépendent du navigateur et de l’appareil.'] };
  if (/Macintosh/i.test(userAgent) && /Safari/i.test(userAgent) && !/Chrome|Chromium|Edg/i.test(userAgent)) {
    return { platform: 'Mac avec Safari', steps: ['Sur macOS Sonoma ou une version ultérieure, ouvrez le menu Fichier de Safari.', 'Choisissez « Ajouter au Dock », puis confirmez le nom IMPERIUM RDC.', 'Sur une version plus ancienne, utilisez Chrome ou Edge pour installer la PWA.'] };
  }
  return { platform: 'Ordinateur Windows, macOS ou Linux', steps: ['Ouvrez la démonstration dans Chrome ou Edge.', 'Utilisez l’icône d’installation de la barre d’adresse ou l’option Installer dans le menu du navigateur.', 'Si aucune installation n’est proposée, gardez le site ouvert en ligne ou utilisez un navigateur compatible. Firefox desktop ne propose pas l’installation par manifeste.'] };
}

initializePwaEvents();
