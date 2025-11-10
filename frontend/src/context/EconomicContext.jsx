import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

// Constants
const DEFAULT_API_KEY = 'secret_dev_key';
const DEFAULT_REFRESH_INTERVAL = 60 * 60 * 1000; // 1 hour
const MIN_REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes

const EconomicContext = createContext({ data: null, loading: true, error: null, refresh: () => {} });

export function EconomicProvider({ children, apiKey = DEFAULT_API_KEY, refreshIntervalMs = DEFAULT_REFRESH_INTERVAL }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastFetchedRef = useRef(null);
  const abortRef = useRef(null);

  // Fetch economic data
  const fetchEconomic = useCallback(async () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    
    const controller = new AbortController();
    abortRef.current = controller;
    
    try {
      setLoading(true);
      const res = await fetch(`/api/economic?api_key=${encodeURIComponent(apiKey)}`, { 
        signal: controller.signal, 
        cache: 'no-store' 
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      
      if (json && json.data) {
        setData({ 
          ...json.data, 
          updatedAt: json.data.updatedAt || new Date().toISOString(), 
          news: json.news || [] 
        });
        lastFetchedRef.current = Date.now();
        setError(null);
      } else {
        throw new Error('Invalid response shape');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('fetchEconomic error', err);
        setError(err);
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [apiKey]);

  // Initialize data and set up refresh interval
  useEffect(() => {
    // Initial fetch
    fetchEconomic();
    
    // Set up refresh interval
    const intervalId = setInterval(() => {
      // Only fetch if we haven't fetched recently
      if (lastFetchedRef.current && Date.now() - lastFetchedRef.current < refreshIntervalMs / 2) {
        return;
      }
      fetchEconomic();
    }, Math.max(refreshIntervalMs, MIN_REFRESH_INTERVAL));
    
    return () => {
      clearInterval(intervalId);
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [fetchEconomic, refreshIntervalMs]);

  return (
    <EconomicContext.Provider value={{ data, loading, error, refresh: fetchEconomic }}>
      {children}
    </EconomicContext.Provider>
  );
}

export function useEconomicData() {
  return useContext(EconomicContext);
}
