import { useState, useEffect, useCallback } from 'react';
import { MarketService, ItemService } from '@/services/api';
import { useApp } from '@/contexts/AppContext';
import type { MarketPrice } from '@/services/api';

interface UseMarketOptions {
  itemIds?: string[];
  locations?: string[];
  qualities?: number[];
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseMarketReturn {
  prices: MarketPrice[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  searchItems: (query: string) => Promise<void>;
  searchResults: { id: string; name: string; imageUrl: string }[];
}

export const useMarket = (options: UseMarketOptions = {}): UseMarketReturn => {
  const { server, lastRefresh } = useApp();
  const { itemIds, locations, qualities, autoRefresh = false, refreshInterval = 300000 } = options;

  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<{ id: string; name: string; imageUrl: string }[]>([]);

  const fetchPrices = useCallback(async () => {
    if (!itemIds || itemIds.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await MarketService.getPrices(server, itemIds, locations, qualities);
      setPrices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prices');
    } finally {
      setIsLoading(false);
    }
  }, [server, itemIds, locations, qualities]);

  const searchItems = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const items = await ItemService.searchItems(query);
      const results = items.slice(0, 20).map(item => ({
        id: item.uniqueName,
        name: item.localizedNames?.en || item.name || item.uniqueName,
        imageUrl: ItemService.getItemImageUrl(item.uniqueName),
      }));
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchPrices();
  }, [fetchPrices]);

  // Initial fetch
  useEffect(() => {
    fetchPrices();
  }, [fetchPrices, lastRefresh]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchPrices();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchPrices]);

  return {
    prices,
    isLoading,
    error,
    refresh,
    searchItems,
    searchResults,
  };
};

export default useMarket;
