declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: { user?: TelegramUser; query_id?: string; auth_date?: number; hash?: string };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: Record<string, string>;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  ready: () => void;
  expand: () => void;
  close: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
  MainButton: {
    text: string;
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    setText: (text: string) => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
    enable: () => void;
    disable: () => void;
  };
  showAlert: (msg: string, cb?: () => void) => void;
  showConfirm: (msg: string, cb?: (ok: boolean) => void) => void;
  onEvent: (event: string, cb: () => void) => void;
  offEvent: (event: string, cb: () => void) => void;
}

export function getTelegram(): TelegramWebApp | null {
  if (typeof window === 'undefined') return null;
  return window.Telegram?.WebApp ?? null;
}

export function isTelegramWebApp(): boolean {
  const tg = getTelegram();
  return !!tg && !!tg.initData;
}

export function getTelegramUser(): TelegramUser | null {
  return getTelegram()?.initDataUnsafe?.user ?? null;
}

export function getTelegramUserId(): string {
  const user = getTelegramUser();
  if (user?.id) return `tg_${user.id}`;
  let anon = localStorage.getItem('zen_anon_id');
  if (!anon) {
    anon = `anon_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem('zen_anon_id', anon);
  }
  return anon;
}

export function initTelegram() {
  const tg = getTelegram();
  if (!tg) return null;
  try {
    tg.ready();
    tg.expand();
    const dark = tg.colorScheme === 'dark';
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = tg.colorScheme;
    const bg = dark ? '#050505' : '#fafafa';
    tg.setBackgroundColor?.(bg);
    tg.setHeaderColor?.(bg);
  } catch {
    /* ignore */
  }
  return tg;
}

export function haptic(kind: 'success' | 'error' | 'warning' | 'tap' = 'tap') {
  const tg = getTelegram();
  if (!tg?.HapticFeedback) return;
  try {
    if (kind === 'tap') tg.HapticFeedback.impactOccurred('light');
    else tg.HapticFeedback.notificationOccurred(kind);
  } catch {
    /* ignore */
  }
}
