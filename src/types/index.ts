// ============================================================================
// ALBION ONLINE TYPES
// ============================================================================

// Server Types
export type ServerType = 'west' | 'east' | 'europe';

// Theme Types
export type ThemeType = 
  | 'dark' 
  | 'light' 
  | 'blue' 
  | 'red' 
  | 'green' 
  | 'purple' 
  | 'orange' 
  | 'cyan' 
  | 'pink' 
  | 'gold' 
  | 'midnight';

// Language Types
export type LanguageType = 
  | 'tr' 
  | 'en' 
  | 'de' 
  | 'fr' 
  | 'es' 
  | 'ru' 
  | 'pt' 
  | 'it' 
  | 'pl' 
  | 'zh';

// ============================================================================
// ITEM TYPES
// ============================================================================

export interface Item {
  uniqueName: string;
  name: string;
  localizedNames?: Record<string, string>;
  description?: string;
  category: string;
  slotType?: string;
  tier: number;
  enchantmentLevel?: number;
  itemPower?: number;
  craftingRequirements?: CraftingRequirement[];
}

export interface CraftingRequirement {
  craftResource: CraftResource[];
  silverCost: number;
  time: number;
  craftingFocus: number;
}

export interface CraftResource {
  uniqueName: string;
  count: number;
}

// ============================================================================
// MARKET TYPES
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

// ============================================================================
// KILLBOARD TYPES
// ============================================================================

export interface KillEvent {
  eventId: number;
  timestamp: string;
  version: number;
  killer: Player;
  victim: Player;
  totalVictimKillFame: number;
  location?: Location;
  participants: Participant[];
  groupMembers: GroupMember[];
  battleId?: number;
  killArea: string;
  category?: string;
  type: string;
}

export interface Player {
  id: string;
  name: string;
  guildName?: string;
  guildId?: string;
  allianceName?: string;
  allianceId?: string;
  allianceTag?: string;
  equipment: Equipment;
  stats: PlayerStats;
  inventory?: ItemSlot[];
}

export interface Equipment {
  mainHand?: ItemSlot;
  offHand?: ItemSlot;
  head?: ItemSlot;
  armor?: ItemSlot;
  shoes?: ItemSlot;
  bag?: ItemSlot;
  cape?: ItemSlot;
  mount?: ItemSlot;
  potion?: ItemSlot;
  food?: ItemSlot;
}

export interface ItemSlot {
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

export interface Location {
  zoneId: number;
  zoneName: string;
  positionX: number;
  positionY: number;
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

// ============================================================================
// MAP TYPES
// ============================================================================

export interface MapZone {
  id: string;
  name: string;
  type: 'blue' | 'yellow' | 'red' | 'black' | 'avalon';
  tier: number;
  resources: ResourceInfo[];
  hideouts?: HideoutInfo[];
  dungeons?: DungeonInfo[];
  portals?: PortalInfo[];
  craftingBonus?: CraftingBonus[];
}

export interface ResourceInfo {
  type: string;
  tier: number;
  abundance: number;
}

export interface HideoutInfo {
  id: string;
  name: string;
  guildName: string;
  guildId: string;
  position: { x: number; y: number };
}

export interface DungeonInfo {
  id: string;
  type: 'solo' | 'group' | 'corrupted' | 'hellgate' | 'avalon';
  tier: number;
  position: { x: number; y: number };
}

export interface PortalInfo {
  id: string;
  type: 'entrance' | 'exit';
  destination?: string;
  size: number;
  remainingTime?: number;
}

export interface CraftingBonus {
  itemType: string;
  bonus: number;
}

// ============================================================================
// BUILD TYPES
// ============================================================================

export interface Build {
  id: string;
  name: string;
  description: string;
  type: BuildType;
  groupSize?: number;
  equipment: BuildEquipment;
  skills: BuildSkills;
  alternatives?: BuildAlternatives;
  stats: BuildStats;
  author?: string;
  votes?: number;
  createdAt?: string;
}

export type BuildType = 
  | 'solo' 
  | 'group' 
  | 'dungeon' 
  | 'pvp' 
  | 'pve' 
  | 'ganking' 
  | 'gathering' 
  | 'healing' 
  | 'tanking' 
  | 'dps' 
  | 'support';

export interface BuildEquipment {
  weapon: string;
  offhand?: string;
  head: string;
  armor: string;
  shoes: string;
  cape?: string;
  bag?: string;
  potion?: string;
  food?: string;
}

export interface BuildSkills {
  weapon: string[];
  head: string[];
  armor: string[];
  shoes: string[];
}

export interface BuildAlternatives {
  weapon?: string[];
  head?: string[];
  armor?: string[];
  shoes?: string[];
}

export interface BuildStats {
  damage: number;
  defense: number;
  mobility: number;
  sustain: number;
  difficulty: number;
}

// ============================================================================
// CRAFTING TYPES
// ============================================================================

export interface CraftingCalculation {
  itemId: string;
  quantity: number;
  city: string;
  useFocus: boolean;
  resourceCost: ResourceCost[];
  totalCost: number;
  returnRate: number;
  returnedResources: ReturnedResource[];
  profit: number;
  profitMargin: number;
}

export interface ResourceCost {
  itemId: string;
  count: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ReturnedResource {
  itemId: string;
  count: number;
}

// ============================================================================
// CALCULATOR TYPES
// ============================================================================

export interface FarmingCalculation {
  cropType: string;
  seedCost: number;
  yield: number;
  productPrice: number;
  profit: number;
  profitPerDay: number;
}

export interface LaborerCalculation {
  laborerType: string;
  tier: number;
  happiness: number;
  journalType: string;
  dailyProfit: number;
}

export interface RefiningCalculation {
  resourceType: string;
  inputTier: number;
  outputTier: number;
  city: string;
  useFocus: boolean;
  profit: number;
}

// ============================================================================
// UI TYPES
// ============================================================================

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  nameLocalized: Record<LanguageType, string>;
  colors: {
    background: string;
    surface: string;
    surfaceHover: string;
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    text: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export interface ServerConfig {
  id: ServerType;
  name: string;
  nameLocalized: Record<LanguageType, string>;
  flag: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
}

export interface TableColumn {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface FilterState {
  key: string;
  value: string | number | boolean | string[];
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
}

export interface SortState {
  key: string;
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export default {};
