import { useState, useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import { MarketService, ItemService } from '@/services/api';
import { 
  Search, RefreshCw, TrendingUp, 
  MapPin, Star, Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cities, qualityLevels } from '@/config';

interface MarketPrice {
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

export const MarketSection = () => {
  const { t, currentTheme, server } = useApp();
  const themeColors = currentTheme.colors;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedQuality, setSelectedQuality] = useState<string>('all');
  const [searchResults, setSearchResults] = useState<{ id: string; name: string; imageUrl: string }[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Search items
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const items = await ItemService.searchItems(query);
      const results = items.slice(0, 10).map((item) => ({
        id: item.uniqueName,
        name: item.localizedNames?.en || item.name || item.uniqueName,
        imageUrl: ItemService.getItemImageUrl(item.uniqueName, 1, 64),
      }));
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (err) {
      console.error('Search error:', err);
    }
  }, []);

  // Select item
  const selectItem = useCallback(async (itemId: string) => {
    setSelectedItems([itemId]);
    setSearchQuery('');
    setShowSearchResults(false);
    setIsLoading(true);

    try {
      const locations = selectedCity === 'all' ? cities : [selectedCity];
      const qualities = selectedQuality === 'all' ? [1, 2, 3, 4, 5] : [parseInt(selectedQuality)];
      
      const data = await MarketService.getPrices(server, [itemId], locations, qualities);
      setPrices(data);
    } catch (err) {
      console.error('Price fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [server, selectedCity, selectedQuality]);

  // Refresh prices
  const refreshPrices = useCallback(async () => {
    if (selectedItems.length === 0) return;
    
    setIsLoading(true);
    try {
      const locations = selectedCity === 'all' ? cities : [selectedCity];
      const qualities = selectedQuality === 'all' ? [1, 2, 3, 4, 5] : [parseInt(selectedQuality)];
      
      const data = await MarketService.getPrices(server, selectedItems, locations, qualities);
      setPrices(data);
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [server, selectedItems, selectedCity, selectedQuality]);

  return (
    <section 
      id="market"
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
            {t('market.title') as string}
          </h2>
          <p style={{ color: themeColors.textMuted }}>
            Gerçek zamanlı pazar fiyatları - Tüm şehirler, tüm kaliteler
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                size={18}
                style={{ color: themeColors.textMuted }}
              />
              <Input
                placeholder={t('market.searchPlaceholder') as string}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
                style={{ 
                  backgroundColor: themeColors.background,
                  borderColor: themeColors.border,
                  color: themeColors.text,
                }}
              />
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div 
                  className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-50 max-h-80 overflow-y-auto"
                  style={{ 
                    backgroundColor: themeColors.surface,
                    border: `1px solid ${themeColors.border}`,
                    boxShadow: `0 10px 40px ${themeColors.background}80`,
                  }}
                >
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => selectItem(item.id)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-opacity-10 transition-colors"
                      style={{ 
                        borderBottom: `1px solid ${themeColors.border}`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${themeColors.primary}20`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-10 h-10 object-contain"
                      />
                      <span style={{ color: themeColors.text }}>{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* City Filter */}
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger 
                style={{ 
                  backgroundColor: themeColors.background,
                  borderColor: themeColors.border,
                  color: themeColors.text,
                }}
              >
                <MapPin size={16} className="mr-2" />
                <SelectValue placeholder={t('market.city') as string} />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <SelectItem value="all">Tüm Şehirler</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Quality Filter */}
            <Select value={selectedQuality} onValueChange={setSelectedQuality}>
              <SelectTrigger 
                style={{ 
                  backgroundColor: themeColors.background,
                  borderColor: themeColors.border,
                  color: themeColors.text,
                }}
              >
                <Star size={16} className="mr-2" />
                <SelectValue placeholder={t('market.quality') as string} />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <SelectItem value="all">Tüm Kaliteler</SelectItem>
                {qualityLevels.map((q) => (
                  <SelectItem key={q.id} value={q.id.toString()}>
                    <span style={{ color: q.color }}>{q.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Refresh Button */}
            <Button
              onClick={refreshPrices}
              disabled={isLoading || selectedItems.length === 0}
              className="w-full"
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

        {/* Prices Table */}
        {selectedItems.length > 0 && (
          <div 
            className="rounded-2xl overflow-hidden"
            style={{ 
              backgroundColor: themeColors.surface,
              border: `1px solid ${themeColors.border}`,
            }}
          >
            {isLoading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" style={{ backgroundColor: themeColors.background }} />
                ))}
              </div>
            ) : prices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: themeColors.background }}>
                      <th className="px-6 py-4 text-left" style={{ color: themeColors.textMuted }}>Eşya</th>
                      <th className="px-6 py-4 text-left" style={{ color: themeColors.textMuted }}>Şehir</th>
                      <th className="px-6 py-4 text-center" style={{ color: themeColors.textMuted }}>Kalite</th>
                      <th className="px-6 py-4 text-right" style={{ color: themeColors.textMuted }}>Satış (Min)</th>
                      <th className="px-6 py-4 text-right" style={{ color: themeColors.textMuted }}>Satış (Max)</th>
                      <th className="px-6 py-4 text-right" style={{ color: themeColors.textMuted }}>Alış (Min)</th>
                      <th className="px-6 py-4 text-right" style={{ color: themeColors.textMuted }}>Alış (Max)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prices.map((price, index) => (
                      <tr 
                        key={`${price.item_id}-${price.city}-${price.quality}-${index}`}
                        className="border-t transition-colors"
                        style={{ 
                          borderColor: themeColors.border,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${themeColors.primary}10`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={ItemService.getItemImageUrl(price.item_id, price.quality, 48)}
                              alt={price.item_id}
                              className="w-10 h-10 object-contain"
                            />
                            <span style={{ color: themeColors.text }}>{price.item_id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4" style={{ color: themeColors.text }}>{price.city}</td>
                        <td className="px-6 py-4 text-center">
                          <Badge 
                            style={{ 
                              backgroundColor: `${qualityLevels.find(q => q.id === price.quality)?.color}30`,
                              color: qualityLevels.find(q => q.id === price.quality)?.color,
                            }}
                          >
                            {qualityLevels.find(q => q.id === price.quality)?.name}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right font-mono" style={{ color: themeColors.success }}>
                          {price.sell_price_min.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right font-mono" style={{ color: themeColors.success }}>
                          {price.sell_price_max.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right font-mono" style={{ color: themeColors.error }}>
                          {price.buy_price_min.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right font-mono" style={{ color: themeColors.error }}>
                          {price.buy_price_max.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <Package size={48} style={{ color: themeColors.textMuted }} className="mx-auto mb-4" />
                <p style={{ color: themeColors.textMuted }}>{t('market.noData') as string}</p>
              </div>
            )}
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            { 
              title: 'Gerçek Zamanlı Veriler', 
              desc: 'Albion Data Project API ile anlık fiyat güncellemeleri',
              icon: TrendingUp,
              color: themeColors.success 
            },
            { 
              title: '3 Sunucu Desteği', 
              desc: 'West, East ve Europe sunucuları için ayrı veriler',
              icon: MapPin,
              color: themeColors.info 
            },
            { 
              title: 'Tüm Kaliteler', 
              desc: 'Normalden Masterpiece\'e kadar tüm kalite seviyeleri',
              icon: Star,
              color: themeColors.warning 
            },
          ].map((card, index) => {
            const Icon = card.icon;
            return (
              <div 
                key={index}
                className="p-6 rounded-xl"
                style={{ 
                  backgroundColor: themeColors.surface,
                  border: `1px solid ${themeColors.border}`,
                }}
              >
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${card.color}20` }}
                >
                  <Icon size={24} style={{ color: card.color }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: themeColors.text }}>{card.title}</h3>
                <p className="text-sm" style={{ color: themeColors.textMuted }}>{card.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MarketSection;
