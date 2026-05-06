// Adsgram (https://adsgram.ai) is the standard ad network for Telegram
// Mini Apps. The publisher registers at adsgram.ai, creates a "block",
// and gets a Block ID. Pass it via VITE_ADSGRAM_BLOCK_ID at build time.
//
// SDK reference: https://docs.adsgram.ai/

declare global {
  interface Window {
    Adsgram?: {
      init: (opts: { blockId: string; debug?: boolean }) => AdsgramController;
    };
  }
}

export interface AdsgramController {
  show(): Promise<{ done: boolean; description: string; state: 'load' | 'render' | 'playing' | 'destroy'; error: boolean }>;
  destroy?(): void;
  addEventListener?: (event: string, cb: () => void) => void;
}

const BLOCK_ID = (process.env.VITE_ADSGRAM_BLOCK_ID || '').trim();

let controller: AdsgramController | null = null;

export function adsEnabled(): boolean {
  return !!BLOCK_ID && typeof window !== 'undefined' && !!window.Adsgram;
}

function getController(): AdsgramController | null {
  if (controller) return controller;
  if (!adsEnabled()) return null;
  try {
    controller = window.Adsgram!.init({ blockId: BLOCK_ID });
    return controller;
  } catch {
    return null;
  }
}

/**
 * Show a rewarded video ad. Resolves true if the user completed the ad
 * (caller may grant a reward), false otherwise.
 *
 * If Adsgram is not configured (no block ID), resolves false immediately
 * — caller decides what fallback to show.
 */
export async function showRewardedAd(): Promise<boolean> {
  const c = getController();
  if (!c) return false;
  try {
    const r = await c.show();
    return !r.error && r.done;
  } catch {
    return false;
  }
}
