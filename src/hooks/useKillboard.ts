import { useState, useEffect, useCallback } from 'react';
import { KillboardService } from '@/services/api';
import type { KillEvent, PlayerInfo, GuildInfo } from '@/services/api';

interface UseKillboardOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseKillboardReturn {
  recentKills: KillEvent[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  searchPlayer: (query: string) => Promise<PlayerInfo[]>;
  searchGuild: (query: string) => Promise<GuildInfo[]>;
  getPlayerKills: (playerId: string) => Promise<KillEvent[]>;
  getPlayerDeaths: (playerId: string) => Promise<KillEvent[]>;
  getKillDetails: (eventId: number) => Promise<KillEvent | null>;
}

export const useKillboard = (options: UseKillboardOptions = {}): UseKillboardReturn => {
  const { autoRefresh = false, refreshInterval = 60000 } = options;

  const [recentKills, setRecentKills] = useState<KillEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentKills = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await KillboardService.getRecentKills(50);
      setRecentKills(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch kills');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchPlayer = useCallback(async (query: string): Promise<PlayerInfo[]> => {
    try {
      return await KillboardService.searchPlayer(query);
    } catch (err) {
      console.error('Player search error:', err);
      return [];
    }
  }, []);

  const searchGuild = useCallback(async (query: string): Promise<GuildInfo[]> => {
    try {
      return await KillboardService.searchGuild(query);
    } catch (err) {
      console.error('Guild search error:', err);
      return [];
    }
  }, []);

  const getPlayerKills = useCallback(async (playerId: string): Promise<KillEvent[]> => {
    try {
      return await KillboardService.getPlayerKills(playerId, 50);
    } catch (err) {
      console.error('Player kills error:', err);
      return [];
    }
  }, []);

  const getPlayerDeaths = useCallback(async (playerId: string): Promise<KillEvent[]> => {
    try {
      return await KillboardService.getPlayerDeaths(playerId, 50);
    } catch (err) {
      console.error('Player deaths error:', err);
      return [];
    }
  }, []);

  const getKillDetails = useCallback(async (eventId: number): Promise<KillEvent | null> => {
    try {
      return await KillboardService.getKillDetails(eventId);
    } catch (err) {
      console.error('Kill details error:', err);
      return null;
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchRecentKills();
  }, [fetchRecentKills]);

  // Initial fetch
  useEffect(() => {
    fetchRecentKills();
  }, [fetchRecentKills]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchRecentKills();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchRecentKills]);

  return {
    recentKills,
    isLoading,
    error,
    refresh,
    searchPlayer,
    searchGuild,
    getPlayerKills,
    getPlayerDeaths,
    getKillDetails,
  };
};

export default useKillboard;
