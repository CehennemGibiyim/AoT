import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { 
  Map, Search, Star, TrendingUp, 
  Shield, Sword, TreePine, Mountain, Gem,
  Castle, DoorOpen, Compass
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

interface MapData {
  id: string;
  name: string;
  tier: number;
  type: 'avalon' | 'black' | 'red' | 'yellow' | 'blue';
  resources: { type: string; tier: number; abundance: number }[];
  bonuses: { type: string; value: number }[];
  hideouts: number;
  dungeons: number;
  portals: number;
  imageUrl?: string;
}

// Mock Avalon Maps Data
const avalonMaps: MapData[] = [
  { 
    id: 'avalon-1', 
    name: 'Cases-Ugumlos', 
    tier: 6, 
    type: 'avalon',
    resources: [
      { type: 'Wood', tier: 6, abundance: 3 },
      { type: 'Ore', tier: 6, abundance: 2 },
    ],
    bonuses: [
      { type: 'Crafting', value: 15 },
      { type: 'Gathering', value: 10 },
    ],
    hideouts: 2,
    dungeons: 5,
    portals: 3,
  },
  { 
    id: 'avalon-2', 
    name: 'Pons-Feximi', 
    tier: 8, 
    type: 'avalon',
    resources: [
      { type: 'Hide', tier: 8, abundance: 4 },
      { type: 'Fiber', tier: 7, abundance: 3 },
    ],
    bonuses: [
      { type: 'Crafting', value: 20 },
      { type: 'Fame', value: 15 },
    ],
    hideouts: 3,
    dungeons: 8,
    portals: 4,
  },
  { 
    id: 'avalon-3', 
    name: 'Vex-Ormox', 
    tier: 4, 
    type: 'avalon',
    resources: [
      { type: 'Stone', tier: 4, abundance: 3 },
      { type: 'Wood', tier: 4, abundance: 2 },
    ],
    bonuses: [
      { type: 'Gathering', value: 5 },
    ],
    hideouts: 1,
    dungeons: 3,
    portals: 2,
  },
];

// Mock Black Zone Maps
const blackZoneMaps: MapData[] = [
  {
    id: 'bz-1',
    name: 'Rivercopse Crossing',
    tier: 8,
    type: 'black',
    resources: [
      { type: 'Wood', tier: 8, abundance: 4 },
      { type: 'Hide', tier: 7, abundance: 3 },
    ],
    bonuses: [
      { type: 'Gathering', value: 25 },
      { type: 'PvP', value: 30 },
    ],
    hideouts: 5,
    dungeons: 12,
    portals: 2,
  },
  {
    id: 'bz-2',
    name: 'Sunfang Ravine',
    tier: 7,
    type: 'black',
    resources: [
      { type: 'Fiber', tier: 7, abundance: 4 },
      { type: 'Ore', tier: 6, abundance: 3 },
    ],
    bonuses: [
      { type: 'Gathering', value: 20 },
      { type: 'PvP', value: 25 },
    ],
    hideouts: 4,
    dungeons: 10,
    portals: 3,
  },
  {
    id: 'bz-3',
    name: 'Murdergulch Cross',
    tier: 8,
    type: 'black',
    resources: [
      { type: 'Rock', tier: 8, abundance: 5 },
      { type: 'Ore', tier: 7, abundance: 4 },
    ],
    bonuses: [
      { type: 'Gathering', value: 30 },
      { type: 'PvP', value: 35 },
    ],
    hideouts: 6,
    dungeons: 15,
    portals: 4,
  },
];

// Resource icon mapping
const resourceIcons: Record<string, React.ElementType> = {
  Wood: TreePine,
  Rock: Mountain,
  Ore: Gem,
  Hide: Shield,
  Fiber: Compass,
};

export const MapsSection = () => {
  const { t, currentTheme } = useApp();
  const themeColors = currentTheme.colors;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  const filterMaps = (maps: MapData[]) => {
    return maps
      .filter(map => {
        const matchesSearch = map.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTier = selectedTier ? map.tier === selectedTier : true;
        return matchesSearch && matchesTier;
      })
      .sort((a, b) => b.tier - a.tier);
  };

  const MapCard: React.FC<{ map: MapData }> = ({ map }) => {
    return (
      <div 
        className="rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
        style={{ 
          backgroundColor: themeColors.surface,
          border: `1px solid ${themeColors.border}`,
        }}
      >
        {/* Map Header */}
        <div 
          className="p-4 border-b flex items-center justify-between"
          style={{ borderColor: themeColors.border }}
        >
          <div>
            <h3 style={{ color: themeColors.text }} className="font-semibold text-lg">
              {map.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                style={{ 
                  backgroundColor: map.tier >= 8 ? themeColors.error : 
                                   map.tier >= 6 ? themeColors.warning : themeColors.info,
                }}
              >
                Tier {map.tier}
              </Badge>
              {map.type === 'avalon' && (
                <Badge style={{ backgroundColor: themeColors.primary }}>
                  Avalon
                </Badge>
              )}
            </div>
          </div>
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${themeColors.primary}20` }}
          >
            <Map size={24} style={{ color: themeColors.primary }} />
          </div>
        </div>

        {/* Map Content */}
        <div className="p-4">
          {/* Resources */}
          <div className="mb-4">
            <p 
              className="text-sm font-medium mb-2"
              style={{ color: themeColors.textMuted }}
            >
              Kaynaklar
            </p>
            <div className="flex flex-wrap gap-2">
              {map.resources.map((resource, idx) => {
                const Icon = resourceIcons[resource.type] || Gem;
                return (
                  <div 
                    key={idx}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm"
                    style={{ backgroundColor: themeColors.background }}
                  >
                    <Icon size={14} style={{ color: themeColors.primary }} />
                    <span style={{ color: themeColors.text }}>
                      T{resource.tier} {resource.type}
                    </span>
                    <span style={{ color: themeColors.textMuted }}>
                      ({resource.abundance}x)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bonuses */}
          <div className="mb-4">
            <p 
              className="text-sm font-medium mb-2"
              style={{ color: themeColors.textMuted }}
            >
              Bonuslar
            </p>
            <div className="flex flex-wrap gap-2">
              {map.bonuses.map((bonus, idx) => (
                <Badge 
                  key={idx}
                  style={{ 
                    backgroundColor: `${themeColors.success}30`,
                    color: themeColors.success,
                  }}
                >
                  <TrendingUp size={12} className="mr-1" />
                  {bonus.type} +{bonus.value}%
                </Badge>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div 
              className="p-2 rounded-lg text-center"
              style={{ backgroundColor: themeColors.background }}
            >
              <Castle size={16} style={{ color: themeColors.primary }} className="mx-auto mb-1" />
              <span style={{ color: themeColors.textMuted }} className="text-xs">Hideout</span>
              <p style={{ color: themeColors.text }} className="font-semibold">{map.hideouts}</p>
            </div>
            <div 
              className="p-2 rounded-lg text-center"
              style={{ backgroundColor: themeColors.background }}
            >
              <DoorOpen size={16} style={{ color: themeColors.warning }} className="mx-auto mb-1" />
              <span style={{ color: themeColors.textMuted }} className="text-xs">Zindan</span>
              <p style={{ color: themeColors.text }} className="font-semibold">{map.dungeons}</p>
            </div>
            <div 
              className="p-2 rounded-lg text-center"
              style={{ backgroundColor: themeColors.background }}
            >
              <Compass size={16} style={{ color: themeColors.info }} className="mx-auto mb-1" />
              <span style={{ color: themeColors.textMuted }} className="text-xs">Portal</span>
              <p style={{ color: themeColors.text }} className="font-semibold">{map.portals}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section 
      id="maps"
      className="py-20 min-h-screen"
      style={{ backgroundColor: themeColors.background }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h2 
            className="text-4xl font-bold mb-4"
            style={{ color: themeColors.text }}
          >
            {t('maps.title') as string}
          </h2>
          <p style={{ color: themeColors.textMuted }}>
            Avalon Yolları, Black Zone ve diğer haritalar - Bonuslar, kaynaklar ve hideout bilgileri
          </p>
        </div>

        {/* Search and Filters */}
        <div 
          className="p-6 rounded-2xl mb-8"
          style={{ 
            backgroundColor: themeColors.surface,
            border: `1px solid ${themeColors.border}`,
          }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                size={18}
                style={{ color: themeColors.textMuted }}
              />
              <Input
                placeholder={t('maps.searchMap') as string}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                style={{ 
                  backgroundColor: themeColors.background,
                  borderColor: themeColors.border,
                  color: themeColors.text,
                }}
              />
            </div>
            <div className="flex gap-2">
              {[8, 7, 6, 5, 4].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(selectedTier === tier ? null : tier)}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={selectedTier === tier ? {
                    backgroundColor: themeColors.primary,
                    color: '#ffffff',
                  } : {
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    border: `1px solid ${themeColors.border}`,
                  }}
                >
                  T{tier}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="avalon" className="w-full">
          <TabsList 
            className="w-full justify-start mb-8"
            style={{ backgroundColor: themeColors.surface }}
          >
            <TabsTrigger 
              value="avalon"
              className="data-[state=active]:bg-primary"
              style={{ 
                color: themeColors.text,
              }}
            >
              <Compass size={16} className="mr-2" />
              {t('maps.avalon') as string}
            </TabsTrigger>
            <TabsTrigger 
              value="black"
              className="data-[state=active]:bg-primary"
              style={{ 
                color: themeColors.text,
              }}
            >
              <Shield size={16} className="mr-2" />
              {t('maps.blackZone') as string}
            </TabsTrigger>
            <TabsTrigger 
              value="red"
              className="data-[state=active]:bg-primary"
              style={{ 
                color: themeColors.text,
              }}
            >
              <Sword size={16} className="mr-2" />
              {t('maps.redZone') as string}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="avalon">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterMaps(avalonMaps).map((map) => (
                <MapCard key={map.id} map={map} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="black">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterMaps(blackZoneMaps).map((map) => (
                <MapCard key={map.id} map={map} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="red">
            <div 
              className="p-12 rounded-2xl text-center"
              style={{ 
                backgroundColor: themeColors.surface,
                border: `1px solid ${themeColors.border}`,
              }}
            >
              <Sword size={64} style={{ color: themeColors.textMuted }} className="mx-auto mb-4" />
              <p style={{ color: themeColors.textMuted }}>
                Red Zone haritaları yakında eklenecek...
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Smart Sort Info */}
        <div 
          className="mt-8 p-6 rounded-2xl"
          style={{ 
            backgroundColor: `${themeColors.primary}10`,
            border: `1px solid ${themeColors.primary}30`,
          }}
        >
          <h3 
            className="text-lg font-semibold mb-4 flex items-center gap-2"
            style={{ color: themeColors.text }}
          >
            <Star size={20} style={{ color: themeColors.primary }} />
            {t('maps.smartSort') as string}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: 'bestForCrafting', icon: Compass, desc: 'En yüksek crafting bonusuna sahip haritalar' },
              { key: 'bestForGathering', icon: TreePine, desc: 'En zengin kaynaklara sahip haritalar' },
              { key: 'bestForPvp', icon: Sword, desc: 'En yüksek PvP aktivitesi olan haritalar' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.key}
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: themeColors.surface }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={18} style={{ color: themeColors.primary }} />
                    <span style={{ color: themeColors.text }} className="font-medium">
                      {t(`maps.${item.key}`) as string}
                    </span>
                  </div>
                  <p style={{ color: themeColors.textMuted }} className="text-sm">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapsSection;
