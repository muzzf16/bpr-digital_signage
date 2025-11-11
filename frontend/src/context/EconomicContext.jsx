import React, { createContext, useContext } from 'react';
import useSWR from 'swr';
import axios from 'axios';

// Constants
const DEFAULT_API_KEY = 'secret_dev_key';
const DEFAULT_REFRESH_INTERVAL = 60 * 60 * 1000; // 1 hour

const EconomicContext = createContext({ data: null, loading: true, error: null, refresh: () => {} });

const fetcher = async (url) => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    const newError = new Error('An error occurred while fetching the data.');
    newError.info = error.response?.data;
    newError.status = error.response?.status;
    throw newError;
  }
};

export function EconomicProvider({ children, refreshIntervalMs = DEFAULT_REFRESH_INTERVAL }) {
  const apiKey = import.meta.env.VITE_API_KEY || DEFAULT_API_KEY;
  const { data, error, mutate } = useSWR(`/api/economic?api_key=${encodeURIComponent(apiKey)}`, fetcher, {
    refreshInterval: refreshIntervalMs,
  });

  const loading = !data && !error;

  return (
    <EconomicContext.Provider value={{ data: data?.data, loading, error, refresh: mutate }}>
      {children}
    </EconomicContext.Provider>
  );
}

export function useEconomicData() {
  return useContext(EconomicContext);
}
