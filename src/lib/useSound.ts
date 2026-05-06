import { useCallback } from 'react';
import { useApp } from '../AppContext';

const SOUNDS = {
  success: 'https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3',
  error: 'https://assets.mixkit.co/active_storage/sfx/2433/2433-preview.mp3',
  notify: 'https://assets.mixkit.co/active_storage/sfx/2357/2357-preview.mp3',
};

export function useSound() {
  const { preferences } = useApp();

  const playSound = useCallback((type: keyof typeof SOUNDS, category?: 'income' | 'expense' | 'payment' | 'system') => {
    if (!preferences.soundSettings.enabled) return;
    
    if (category && !preferences.soundSettings[category]) return;

    // Determine the source: custom URL from preferences or fallback to default
    let source = SOUNDS[type];
    if (category && preferences.customSounds?.[category]) {
      source = preferences.customSounds[category]!;
    }

    const audio = new Audio(source);
    audio.volume = 0.5;
    audio.play().catch(e => console.warn('Audio playback failed', e));
  }, [preferences.soundSettings, preferences.customSounds]);

  return { playSound };
}
