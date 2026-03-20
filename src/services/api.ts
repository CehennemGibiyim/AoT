import axios from 'axios';
import { API_BASE_URLS, KILLBOARD_API_URL, ITEM_RENDER_URL, GITHUB_RAW_URL } from '@/config';
import type { ServerType } from '@/config';

// ============================================================================
// AXIOS INSTANCES
// ============================================================================

export const createMarketApi = (server: ServerType) => {
  return axios.create({
    baseURL: API_BASE_URLS[server],
    timeout: 30000,
    headers: {
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip',
    },
  });
};

export const killboardApi = axios.create({
  baseURL: KILLBOARD_API_URL,
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
  },
});

export const githubApi = axios.create({
  baseURL: GITHUB_RAW_URL,
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
  },
});

// ============================================================================
// MARKET API SERVICES
// ============================================================================

export interface MarketPrice {
  item_id: string;
  city: string;
  quality: number;
  sell_price_min: number;
  sell_price_max: number;
  buy_price_min: number;
  buy_price_max: number;
  sell_price_min_date: string;
  sell_price_max_date: string;
  buy_price_min_date: string;
  buy_price_max_date: string;
}

export interface HistoricalPrice {
  item_id: string;
  city: string;
  quality: number;
  data: {
    timestamp: number;
    avg_price: number;
    min_price: number;
    max_price: number;
    volume: number;
  }[];
}

export interface GoldPrice {
  timestamp: number;
  price: number;
}

export const MarketService = {
  // Get current prices for items
  getPrices: async (
    server: ServerType,
    itemIds: string[],
    locations?: string[],
    qualities?: number[]
  ): Promise<MarketPrice[]> => {
    const api = createMarketApi(server);
    const itemsParam = itemIds.join(',');
    const params: Record<string, string> = {};
    
    if (locations && locations.length > 0) {
      params.locations = locations.join(',');
    }
    if (qualities && qualities.length > 0) {
      params.qualities = qualities.join(',');
    }

    const response = await api.get(`/api/v2/stats/prices/${itemsParam}.json`, { params });
    return response.data;
  },

  // Get historical prices
  getHistory: async (
    server: ServerType,
    itemIds: string[],
    date?: string,
    endDate?: string,
    locations?: string[],
    qualities?: number[],
    timeScale: number = 24
  ): Promise<HistoricalPrice[]> => {
    const api = createMarketApi(server);
    const itemsParam = itemIds.join(',');
    const params: Record<string, string | number> = { 'time-scale': timeScale };
    
    if (date) params.date = date;
    if (endDate) params.end_date = endDate;
    if (locations) params.locations = locations.join(',');
    if (qualities) params.qualities = qualities.join(',');

    const response = await api.get(`/api/v2/stats/history/${itemsParam}.json`, { params });
    return response.data;
  },

  // Get gold prices
  getGoldPrices: async (
    server: ServerType,
    count?: number,
    date?: string,
    endDate?: string
  ): Promise<GoldPrice[]> => {
    const api = createMarketApi(server);
    const params: Record<string, string | number> = {};
    
    if (count) params.count = count;
    if (date) params.date = date;
    if (endDate) params.end_date = endDate;

    const response = await api.get('/api/v2/stats/gold.json', { params });
    return response.data;
  },

  // Get item image URL
  getItemImageUrl: (itemId: string, quality: number = 1, size: number = 217): string => {
    return `${ITEM_RENDER_URL}/${itemId}.png?quality=${quality}&size=${size}`;
  },
};

// ============================================================================
// KILLBOARD API SERVICES
// ============================================================================

export interface KillEvent {
  eventId: number;
  timestamp: string;
  version: number;
  killer: {
    id: string;
    name: string;
    guildName?: string;
    guildId?: string;
    allianceName?: string;
    allianceId?: string;
    allianceTag?: string;
    equipment: Equipment;
    stats: PlayerStats;
  };
  victim: {
    id: string;
    name: string;
    guildName?: string;
    guildId?: string;
    allianceName?: string;
    allianceId?: string;
    allianceTag?: string;
    equipment: Equipment;
    stats: PlayerStats;
    inventory: Item[];
  };
  totalVictimKillFame: number;
  location?: {
    zoneId: number;
    zoneName: string;
    positionX: number;
    positionY: number;
  };
  participants: Participant[];
  groupMembers: GroupMember[];
  battleId?: number;
  killArea: string;
  category?: string;
  type: string;
}

export interface Equipment {
  mainHand?: Item;
  offHand?: Item;
  head?: Item;
  armor?: Item;
  shoes?: Item;
  bag?: Item;
  cape?: Item;
  mount?: Item;
  potion?: Item;
  food?: Item;
}

export interface Item {
  type: string;
  count: number;
  quality: number;
  activeSpells?: string[];
  passiveSpells?: string[];
}

export interface PlayerStats {
  averageItemPower: number;
  killFame: number;
  deathFame: number;
}

export interface Participant {
  id: string;
  name: string;
  guildName?: string;
  guildId?: string;
  allianceName?: string;
  allianceId?: string;
  allianceTag?: string;
  equipment: Equipment;
  stats: PlayerStats;
  damageDone: number;
  supportHealingDone: number;
}

export interface GroupMember {
  id: string;
  name: string;
  guildName?: string;
  guildId?: string;
  allianceName?: string;
  allianceId?: string;
  allianceTag?: string;
  equipment: Equipment;
  stats: PlayerStats;
  damageDone: number;
  supportHealingDone: number;
}

export interface PlayerInfo {
  id: string;
  name: string;
  guildName?: string;
  guildId?: string;
  allianceName?: string;
  allianceId?: string;
  allianceTag?: string;
  avatar?: string;
  avatarRing?: string;
  deathFame: number;
  killFame: number;
  fameRatio: number;
  totalKills: number;
  totalDeaths: number;
  gvgKills: number;
  gvgWon: number;
}

export interface GuildInfo {
  id: string;
  name: string;
  tag: string;
  alliance?: string;
  allianceId?: string;
  killFame: number;
  deathFame: number;
  memberCount: number;
}

export const KillboardService = {
  // Get recent kills
  getRecentKills: async (limit: number = 50): Promise<KillEvent[]> => {
    const response = await killboardApi.get('/events', {
      params: { limit },
    });
    return response.data;
  },

  // Get kill details
  getKillDetails: async (eventId: number): Promise<KillEvent> => {
    const response = await killboardApi.get(`/events/${eventId}`);
    return response.data;
  },

  // Search player
  searchPlayer: async (query: string): Promise<PlayerInfo[]> => {
    const response = await killboardApi.get('/search', {
      params: { q: query },
    });
    return response.data.players || [];
  },

  // Get player info
  getPlayerInfo: async (playerId: string): Promise<PlayerInfo> => {
    const response = await killboardApi.get(`/players/${playerId}`);
    return response.data;
  },

  // Get player kills
  getPlayerKills: async (playerId: string, limit: number = 50): Promise<KillEvent[]> => {
    const response = await killboardApi.get(`/players/${playerId}/kills`, {
      params: { limit },
    });
    return response.data;
  },

  // Get player deaths
  getPlayerDeaths: async (playerId: string, limit: number = 50): Promise<KillEvent[]> => {
    const response = await killboardApi.get(`/players/${playerId}/deaths`, {
      params: { limit },
    });
    return response.data;
  },

  // Search guild
  searchGuild: async (query: string): Promise<GuildInfo[]> => {
    const response = await killboardApi.get('/search', {
      params: { q: query },
    });
    return response.data.guilds || [];
  },

  // Get guild info
  getGuildInfo: async (guildId: string): Promise<GuildInfo> => {
    const response = await killboardApi.get(`/guilds/${guildId}`);
    return response.data;
  },

  // Get guild kills
  getGuildKills: async (guildId: string, limit: number = 50): Promise<KillEvent[]> => {
    const response = await killboardApi.get(`/guilds/${guildId}/kills`, {
      params: { limit },
    });
    return response.data;
  },

  // Get battles
  getBattles: async (limit: number = 50, offset: number = 0): Promise<{ battles: any[] }> => {
    const response = await killboardApi.get('/battles', {
      params: { limit, offset },
    });
    return response.data;
  },

  // Get battle details
  getBattleDetails: async (battleId: number): Promise<any> => {
    const response = await killboardApi.get(`/battles/${battleId}`);
    return response.data;
  },
};

// ============================================================================
// ITEM DATA SERVICES
// ============================================================================

export interface ItemData {
  uniqueName: string;
  name: string;
  localizedNames?: Record<string, string>;
  description?: string;
  category?: string;
  slotType?: string;
  tier?: number;
  enchantmentLevel?: number;
}

export const ItemService = {
  // Get all items
  getAllItems: async (): Promise<ItemData[]> => {
    const response = await githubApi.get('/items.json');
    return response.data;
  },

  // Get item details
  getItemDetails: async (itemId: string): Promise<ItemData | null> => {
    const items = await ItemService.getAllItems();
    return items.find(item => item.uniqueName === itemId) || null;
  },

  // Search items by name
  searchItems: async (query: string, language: string = 'en'): Promise<ItemData[]> => {
    const items = await ItemService.getAllItems();
    const lowerQuery = query.toLowerCase();
    
    return items.filter(item => {
      const nameMatch = item.name?.toLowerCase().includes(lowerQuery);
      const localizedMatch = item.localizedNames?.[language]?.toLowerCase().includes(lowerQuery);
      const idMatch = item.uniqueName.toLowerCase().includes(lowerQuery);
      return nameMatch || localizedMatch || idMatch;
    });
  },

  // Get items by category
  getItemsByCategory: async (category: string): Promise<ItemData[]> => {
    const items = await ItemService.getAllItems();
    return items.filter(item => item.category === category);
  },

  // Get item image URL
  getItemImageUrl: (itemId: string, quality: number = 1, size: number = 217): string => {
    return `${ITEM_RENDER_URL}/${itemId}.png?quality=${quality}&size=${size}`;
  },
};

// ============================================================================
// WORLD DATA SERVICES
// ============================================================================

export interface WorldData {
  id: string;
  name: string;
  type: string;
  tier?: number;
  resources?: string[];
}

export const WorldService = {
  // Get all world data
  getWorldData: async (): Promise<WorldData[]> => {
    const response = await githubApi.get('/world.json');
    return response.data;
  },

  // Get zone by ID
  getZoneById: async (zoneId: string): Promise<WorldData | null> => {
    const worldData = await WorldService.getWorldData();
    return worldData.find(zone => zone.id === zoneId) || null;
  },

  // Get zones by type
  getZonesByType: async (type: string): Promise<WorldData[]> => {
    const worldData = await WorldService.getWorldData();
    return worldData.filter(zone => zone.type === type);
  },
};

// ============================================================================
// CRAFTING CALCULATOR SERVICE
// ============================================================================

export interface CraftingRecipe {
  itemId: string;
  craftingRequirements: {
    craftResource: {
      uniqueName: string;
      count: number;
    }[];
    silverCost: number;
    time: number;
  };
}

export const CraftingService = {
  // Calculate crafting cost
  calculateCost: async (
    _server: ServerType,
    itemId: string,
    quantity: number = 1,
    _city?: string,
    useFocus: boolean = false
  ): Promise<{
    itemId: string;
    quantity: number;
    resourceCost: { itemId: string; count: number; price: number }[];
    totalCost: number;
    returnRate: number;
    returnedResources: { itemId: string; count: number }[];
    profit: number;
  }> => {
    // Get recipe data (would need to be fetched from a recipe database)
    // For now, return a placeholder
    return {
      itemId,
      quantity,
      resourceCost: [],
      totalCost: 0,
      returnRate: useFocus ? 0.595 : 0.152,
      returnedResources: [],
      profit: 0,
    };
  },

  // Get resource return rate
  getReturnRate: (city: string, useFocus: boolean = false): number => {
    const baseRates: Record<string, number> = {
      'Caerleon': 0,
      'Brecilien': 0,
    };
    
    const baseRate = baseRates[city] ?? 0.152;
    return useFocus ? baseRate + 0.443 : baseRate;
  },
};

export default {
  MarketService,
  KillboardService,
  ItemService,
  WorldService,
  CraftingService,
};
