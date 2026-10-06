import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { listProperties } from '../lib/repository';
import { sampleProperties } from '../data/properties';
import { isLiveBackendConfigured } from '../lib/supabase';
import type { Property } from '../types';

interface PropertyContextValue {
  properties: Property[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const PropertyContext = createContext<PropertyContextValue>({ properties: sampleProperties, loading: false, refresh: async () => undefined });

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState(() => isLiveBackendConfigured ? [] : sampleProperties);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const results = await listProperties(true);
    setProperties(results);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    listProperties().then((results) => {
      if (active) setProperties(results);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  return <PropertyContext.Provider value={{ properties, loading, refresh }}>{children}</PropertyContext.Provider>;
}

export function useProperties() {
  return useContext(PropertyContext);
}
