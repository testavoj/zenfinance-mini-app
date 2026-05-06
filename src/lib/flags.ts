// Build-time feature flags. Vite replaces process.env.* via define() in
// vite.config.ts, so these become inlined constants in the bundle.

export const HAS_AI = Boolean(
  (process.env.GEMINI_API_KEY || '').trim()
);
