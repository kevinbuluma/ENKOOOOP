import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type VisitorIntent = 'buy' | 'rent' | 'invest' | 'sell';

interface ExperienceContextValue {
  intent: VisitorIntent | null;
  favorites: string[];
  recentlyViewed: string[];
  setIntent: (intent: VisitorIntent | null) => void;
  toggleFavorite: (propertyId: string) => void;
  recordViewed: (propertyId: string) => void;
}

const KEYS = {
  intent: 'enkop.experience.intent.v1',
  favorites: 'enkop.experience.favorites.v1',
  recent: 'enkop.experience.recent.v1',
} as const;

function readStored<T>(key: string, fallback: T, validate: (value: unknown) => value is T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(key) || 'null');
    return validate(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

const validIntent = (value: unknown): value is VisitorIntent | null => value === null || value === 'buy' || value === 'rent' || value === 'invest' || value === 'sell';
const validIds = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === 'string');

const ExperienceContext = createContext<ExperienceContextValue>({
  intent: null,
  favorites: [],
  recentlyViewed: [],
  setIntent: () => undefined,
  toggleFavorite: () => undefined,
  recordViewed: () => undefined,
});

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [intent, setIntent] = useState<VisitorIntent | null>(() => readStored(KEYS.intent, null, validIntent));
  const [favorites, setFavorites] = useState<string[]>(() => readStored(KEYS.favorites, [], validIds));
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => readStored(KEYS.recent, [], validIds));

  useEffect(() => {
    try { window.localStorage.setItem(KEYS.intent, JSON.stringify(intent)); } catch { /* storage can be disabled */ }
  }, [intent]);
  useEffect(() => {
    try { window.localStorage.setItem(KEYS.favorites, JSON.stringify(favorites)); } catch { /* storage can be disabled */ }
  }, [favorites]);
  useEffect(() => {
    try { window.localStorage.setItem(KEYS.recent, JSON.stringify(recentlyViewed)); } catch { /* storage can be disabled */ }
  }, [recentlyViewed]);

  const toggleFavorite = useCallback((propertyId: string) => {
    setFavorites((current) => current.includes(propertyId)
      ? current.filter((id) => id !== propertyId)
      : [propertyId, ...current].slice(0, 100));
  }, []);

  const recordViewed = useCallback((propertyId: string) => {
    setRecentlyViewed((current) => [propertyId, ...current.filter((id) => id !== propertyId)].slice(0, 8));
  }, []);

  const value = useMemo(() => ({ intent, favorites, recentlyViewed, setIntent, toggleFavorite, recordViewed }), [intent, favorites, recentlyViewed, toggleFavorite, recordViewed]);
  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}

export function useExperience() {
  return useContext(ExperienceContext);
}
