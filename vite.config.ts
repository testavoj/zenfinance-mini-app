import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const geminiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  const adsgramBlockId = env.VITE_ADSGRAM_BLOCK_ID || process.env.VITE_ADSGRAM_BLOCK_ID || '';
  return {
    base: './',
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(geminiKey),
      'process.env.VITE_ADSGRAM_BLOCK_ID': JSON.stringify(adsgramBlockId),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      target: 'es2020',
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
