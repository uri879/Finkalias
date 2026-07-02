import { useState, useEffect } from 'react';
import { TimerSettings, DEFAULT_SETTINGS } from '@/types/timer';

const STORAGE_KEY = 'alias-timer-settings';

function loadSettings(): TimerSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        turnTime: parsed.turnTime ?? DEFAULT_SETTINGS.turnTime,
        guessTime: parsed.guessTime ?? DEFAULT_SETTINGS.guessTime,
        specialTurnTime: parsed.specialTurnTime ?? DEFAULT_SETTINGS.specialTurnTime,
      };
    }
  } catch {
    // fall through
  }
  return DEFAULT_SETTINGS;
}

export function usePersistedSettings(): [TimerSettings, (settings: TimerSettings) => void] {
  const [settings, setSettings] = useState<TimerSettings>(loadSettings);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // storage unavailable
    }
  }, [settings]);

  return [settings, setSettings];
}
