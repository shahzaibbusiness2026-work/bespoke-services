import { useState, useEffect } from 'react';

interface CountdownState {
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formattedHours: string;
  formattedMinutes: string;
  formattedSeconds: string;
  totalSecondsRemaining: number;
}

const STORAGE_KEY = 'boski_vault_end_time';
// Default drop window: 18 hours, 42 minutes, 19 seconds
const DEFAULT_DROP_DURATION_MS = (18 * 3600 + 42 * 60 + 19) * 1000;

const INITIAL_STATE: CountdownState = {
  hours: 18,
  minutes: 42,
  seconds: 19,
  isExpired: false,
  formattedHours: '18',
  formattedMinutes: '42',
  formattedSeconds: '19',
  totalSecondsRemaining: 18 * 3600 + 42 * 60 + 19,
};

export const useVaultCountdown = (initialTargetTimestamp?: number): CountdownState => {
  const getTargetTimestamp = (): number => {
    if (initialTargetTimestamp) return initialTargetTimestamp;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed > Date.now()) {
          return parsed;
        }
      }
    } catch {
      // Ignore localStorage access issues
    }

    // Set a new synchronized drop window (persisting in client storage)
    const newTarget = Date.now() + DEFAULT_DROP_DURATION_MS;
    try {
      localStorage.setItem(STORAGE_KEY, newTarget.toString());
    } catch {}
    return newTarget;
  };

  const calculateTimeRemaining = (targetTime: number): CountdownState => {
    const now = Date.now();
    const diff = Math.max(0, targetTime - now);
    const totalSecondsRemaining = Math.floor(diff / 1000);

    const hours = Math.floor(totalSecondsRemaining / 3600);
    const minutes = Math.floor((totalSecondsRemaining % 3600) / 60);
    const seconds = totalSecondsRemaining % 60;
    const isExpired = totalSecondsRemaining <= 0;

    return {
      hours,
      minutes,
      seconds,
      isExpired,
      formattedHours: String(hours).padStart(2, '0'),
      formattedMinutes: String(minutes).padStart(2, '0'),
      formattedSeconds: String(seconds).padStart(2, '0'),
      totalSecondsRemaining,
    };
  };

  // Deterministic initial state ensures server and initial client render match identically
  const [state, setState] = useState<CountdownState>(INITIAL_STATE);

  useEffect(() => {
    const target = getTargetTimestamp();

    const updateCountdown = () => {
      const newState = calculateTimeRemaining(target);
      setState(newState);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [initialTargetTimestamp]);

  return state;
};
