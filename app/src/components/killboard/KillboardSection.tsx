import { useState, useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useKillboard } from '@/hooks/useKillboard';
import { KillboardService, ItemService } from '@/services/api';
import { 
  Skull, Search, RefreshCw, TrendingUp,
  User, Swords, Clock, Trophy,
  ChevronRight, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import type { KillEvent, PlayerInfo } from '@/services/api';

interface KillCardProps {
  kill: KillEvent;
}

const KillCard: React.FC<KillCardProps> = ({ kill }) => {
  const { currentTheme } = useApp();
  const themeColors = currentTheme.colors;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getItemImage = (type: string | undefined): string => {
    if (!type) return '';
    return ItemService.getItemImageUrl(type, 1, 48);
  };

  return (
    <div 
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{ 
        backgroundColor: themeColors.surface,
        border: `1px solid ${themeColors.border}`,
      }}
    >
      {/* Kill Header */}
      <div 
        className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: themeColors.border }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${themeColors.success}20` }}
          >
            <Swords size={20} style={{ color: themeColors.success }} />
          </div>
          <div>
            <p style={{ color: themeColors.text }} className="font-semibold">
              {kill.killer.name}
            </p>
            <p style={{ color: themeColors.textMuted }} className="text-sm">
              {kill.killer.guildName && `[${kill.killer.guildName}] `}
              killed {kill.victim.name}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p style={{ color: themeColors.success }} className="font-bold">
            +{formatNumber(kill.totalVictimKillFame)}
          </p>
          <p style={{ color: themeColors.textMuted }} className="text-xs">
            {formatTime(kill.timestamp)}
          </p>
        </div>
      </div>

      {/* Equipment */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Killer Equipment */}
          <div>
            <p 
              className="text-xs font-medium mb-2"
              style={{ color: themeColors.success }}
            >
              Killer
            </p>
            <div className="flex gap-1 flex-wrap">
              {kill.killer.equipment.mainHand && (
                <img 
                  src={getItemImage(kill.killer.equipment.mainHand.type)}
                  alt="Weapon"
                  className="w-8 h-8 object-contain rounded"
                  style={{ backgroundColor: themeColors.background }}
                />
              )}
              {kill.killer.equipment.head && (
                <img 
                  src={getItemImage(kill.killer.equipment.head.type)}
                  alt="Head"
                  className="w-8 h-8 object-contain rounded"
                  style={{ backgroundColor: themeColors.background }}
                />
              )}
              {kill.killer.equipment.armor && (
                <img 
                  src={getItemImage(kill.killer.equipment.armor.type)}
                  alt="Armor"
                  className="w-8 h-8 object-contain rounded"
                  style={{ backgroundColor: themeColors.background }}
                />
              )}
              {kill.killer.equipment.shoes && (
                <img 
                  src={getItemImage(kill.killer.equipment.shoes.type)}
                  alt="Shoes"
                  className="w-8 h-8 object-contain rounded"
                  style={{ backgroundColor: themeColors.background }}
                />
              )}
            </div>
          </div>

          {/* Victim Equipment */}
          <div>
            <p 
              className="text-xs font-medium mb-2"
              style={{ color: themeColors.error }}
            >
              Victim
            </p>
            <div className="flex gap-1 flex-wrap">
              {kill.victim.equipment.mainHand && (
                <img 
                  src={getItemImage(kill.victim.equipment.mainHand.type)}
                  alt="Weapon"
                  className="w-8 h-8 object-contain rounded"
                  style={{ backgroundColor: themeColors.background }}
                />
              )}
              {kill.victim.equipment.head && (
                <img 
                  src={getItemImage(kill.victim.equipment.head.type)}
                  alt="Head"
                  className="w-8 h-8 object-contain rounded"
                  style={{ backgroundColor: themeColors.background }}
                />
              )}
              {kill.victim.equipment.armor && (
                <img 
                  src={getItemImage(kill.victim.equipment.armor.type)}
                  alt="Armor"
                  className="w-8 h-8 object-contain rounded"
                  style={{ backgroundColor: themeColors.background }}
                />
              )}
              {kill.victim.equipment.shoes && (
                <img 
                  src={getItemImage(kill.victim.equipment.shoes.type)}
                  alt="Shoes"
                  className="w-8 h-8 object-contain rounded"
                  style={{ backgroundColor: themeColors.background }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Location */}
        {kill.location && (
          <div 
            className="mt-3 pt-3 border-t flex items-center gap-2"
            style={{ borderColor: themeColors.border }}
          >
            <Target size={14} style={{ color: themeColors.textMuted }} />
            <span style={{ color: themeColors.textMuted }} className="text-sm">
              {kill.location.zoneName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export const KillboardSection = () => {
  const { t, currentTheme } = useApp();
  const themeColors = currentTheme.colors;

  const { recentKills, isLoading, refresh, searchPlayer } = useKillboard({ autoRefresh: true });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PlayerInfo[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerInfo | null>(null);
  const [playerKills, setPlayerKills] = useState<KillEvent[]>([]);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results = await searchPlayer(query);
    setSearchResults(results.slice(0, 5));
    setShowSearchResults(true);
  }, [searchPlayer]);

  const selectPlayer = useCallback(async (player: PlayerInfo) => {
    setSelectedPlayer(player);
    setSearchQuery(player.name);
    setShowSearchResults(false);
    
    const kills = await KillboardService.getPlayerKills(player.id, 20);
    setPlayerKills(kills);
  }, []);

  return (
    <section 
      id="killboard"
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
            {t('killboard.title') as string}
          </h2>
          <p style={{ color: themeColors.textMuted }}>
            Son öldürmeler, oyuncu istatistikleri ve savaşlar
          </p>
        </div>

        {/* Search */}
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
                placeholder={t('killboard.searchPlayer') as string}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
                style={{ 
                  backgroundColor: themeColors.background,
                  borderColor: themeColors.border,
                  color: themeColors.text,
                }}
              />
              
              {/* Search Results */}
              {showSearchResults && searchResults.length > 0 && (
                <div 
                  className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-50"
                  style={{ 
                    backgroundColor: themeColors.surface,
                    border: `1px solid ${themeColors.border}`,
                  }}
                >
                  {searchResults.map((player) => (
                    <button
                      key={player.id}
                      onClick={() => selectPlayer(player)}
                      className="w-full px-4 py-3 flex items-center gap-3 transition-colors"
                      style={{ borderBottom: `1px solid ${themeColors.border}` }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${themeColors.primary}20`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <User size={20} style={{ color: themeColors.primary }} />
                      <div className="text-left">
                        <p style={{ color: themeColors.text }}>{player.name}</p>
                        <p style={{ color: themeColors.textMuted }} className="text-sm">
                          {player.guildName && `[${player.guildName}] `}
                          K/D: {player.totalKills}/{player.totalDeaths}
                        </p>
                      </div>
                      <ChevronRight size={16} style={{ color: themeColors.textMuted }} className="ml-auto" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <Button
              onClick={refresh}
              disabled={isLoading}
              style={{ 
                backgroundColor: themeColors.primary,
                color: '#ffffff',
              }}
            >
              <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {t('common.refresh') as string}
            </Button>
          </div>
        </div>

        {/* Player Stats */}
        {selectedPlayer && (
          <div 
            className="p-6 rounded-2xl mb-8"
            style={{ 
              backgroundColor: `${themeColors.primary}10`,
              border: `1px solid ${themeColors.primary}30`,
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: themeColors.primary }}
                >
                  <User size={32} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ color: themeColors.text }} className="text-2xl font-bold">
                    {selectedPlayer.name}
                  </h3>
                  <p style={{ color: themeColors.textMuted }}>
                    {selectedPlayer.guildName && `[${selectedPlayer.guildName}] `}
                    {selectedPlayer.allianceName && `<${selectedPlayer.allianceName}>`}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPlayer(null)}
                style={{ color: themeColors.textMuted }}
              >
                Kapat
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div 
                className="p-4 rounded-xl text-center"
                style={{ backgroundColor: themeColors.surface }}
              >
                <Trophy size={20} style={{ color: themeColors.warning }} className="mx-auto mb-2" />
                <p style={{ color: themeColors.textMuted }} className="text-sm">
                  {t('killboard.killFame') as string}
                </p>
                <p style={{ color: themeColors.text }} className="text-xl font-bold">
                  {(selectedPlayer.killFame / 1000000).toFixed(1)}M
                </p>
              </div>
              <div 
                className="p-4 rounded-xl text-center"
                style={{ backgroundColor: themeColors.surface }}
              >
                <Skull size={20} style={{ color: themeColors.error }} className="mx-auto mb-2" />
                <p style={{ color: themeColors.textMuted }} className="text-sm">
                  {t('killboard.deathFame') as string}
                </p>
                <p style={{ color: themeColors.text }} className="text-xl font-bold">
                  {(selectedPlayer.deathFame / 1000000).toFixed(1)}M
                </p>
              </div>
              <div 
                className="p-4 rounded-xl text-center"
                style={{ backgroundColor: themeColors.surface }}
              >
                <Swords size={20} style={{ color: themeColors.success }} className="mx-auto mb-2" />
                <p style={{ color: themeColors.textMuted }} className="text-sm">K/D Ratio</p>
                <p style={{ color: themeColors.text }} className="text-xl font-bold">
                  {(selectedPlayer.totalKills / Math.max(selectedPlayer.totalDeaths, 1)).toFixed(2)}
                </p>
              </div>
              <div 
                className="p-4 rounded-xl text-center"
                style={{ backgroundColor: themeColors.surface }}
              >
                <TrendingUp size={20} style={{ color: themeColors.info }} className="mx-auto mb-2" />
                <p style={{ color: themeColors.textMuted }} className="text-sm">Fame Ratio</p>
                <p style={{ color: themeColors.text }} className="text-xl font-bold">
                  {selectedPlayer.fameRatio.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="recent" className="w-full">
          <TabsList 
            className="w-full justify-start mb-8"
            style={{ backgroundColor: themeColors.surface }}
          >
            <TabsTrigger value="recent" style={{ color: themeColors.text }}>
              <Clock size={16} className="mr-2" />
              {t('killboard.recentKills') as string}
            </TabsTrigger>
            <TabsTrigger value="top" style={{ color: themeColors.text }}>
              <Trophy size={16} className="mr-2" />
              {t('killboard.topKills') as string}
            </TabsTrigger>
            <TabsTrigger value="solo" style={{ color: themeColors.text }}>
              <User size={16} className="mr-2" />
              {t('killboard.soloKills') as string}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recent">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton 
                    key={i} 
                    className="h-32 w-full" 
                    style={{ backgroundColor: themeColors.surface }} 
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {(selectedPlayer ? playerKills : recentKills).slice(0, 20).map((kill) => (
                  <KillCard key={kill.eventId} kill={kill} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="top">
            <div 
              className="p-12 rounded-2xl text-center"
              style={{ 
                backgroundColor: themeColors.surface,
                border: `1px solid ${themeColors.border}`,
              }}
            >
              <Trophy size={64} style={{ color: themeColors.textMuted }} className="mx-auto mb-4" />
              <p style={{ color: themeColors.textMuted }}>
                En iyi öldürmeler yakında eklenecek...
              </p>
            </div>
          </TabsContent>

          <TabsContent value="solo">
            <div 
              className="p-12 rounded-2xl text-center"
              style={{ 
                backgroundColor: themeColors.surface,
                border: `1px solid ${themeColors.border}`,
              }}
            >
              <User size={64} style={{ color: themeColors.textMuted }} className="mx-auto mb-4" />
              <p style={{ color: themeColors.textMuted }}>
                Solo öldürmeler yakında eklenecek...
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default KillboardSection;
