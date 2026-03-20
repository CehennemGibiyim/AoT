import { useState, useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import { MarketService, ItemService } from '@/services/api';
import { 
  Search, Calculator, TrendingUp, MapPin, 
  Package
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cities, cityBonuses } from '@/config';

interface CraftingItem {
  id: string;
  name: string;
  imageUrl: string;
  tier: number;
  category: string;
}

interface ResourceCost {
  itemId: string;
  name: string;
  count: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl: string;
}

export const CraftingSection = () => {
  const { t, currentTheme, server } = useApp();
  const themeColors = currentTheme.colors;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CraftingItem[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CraftingItem | null>(null);
  const [selectedCity, setSelectedCity] = useState('Caerleon');
  const [useFocus, setUseFocus] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [resourceCosts, setResourceCosts] = useState<ResourceCost[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [sellPrice, setSellPrice] = useState(0);

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
      const results = items
        .filter(item => item.uniqueName.includes('T4') || item.uniqueName.includes('T5') || 
                item.uniqueName.includes('T6') || item.uniqueName.includes('T7') || item.uniqueName.includes('T8'))
        .slice(0, 10)
        .map(item => ({
          id: item.uniqueName,
          name: item.localizedNames?.en || item.name || item.uniqueName,
          imageUrl: ItemService.getItemImageUrl(item.uniqueName, 1, 64),
          tier: item.tier || 4,
          category: item.category || 'unknown',
        }));
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (err) {
      console.error('Search error:', err);
    }
  }, []);

  // Select item
  const selectItem = useCallback(async (item: CraftingItem) => {
    setSelectedItem(item);
    setSearchQuery(item.name);
    setShowSearchResults(false);
    setIsCalculating(true);

    try {
      // Mock resource calculation - in real app, this would come from recipe data
      const mockResources: ResourceCost[] = [
        {
          itemId: `T${item.tier}_PLANKS`,
          name: `Tier ${item.tier} Planks`,
          count: 16 * quantity,
          unitPrice: 0,
          totalPrice: 0,
          imageUrl: ItemService.getItemImageUrl(`T${item.tier}_PLANKS`, 1, 48),
        },
        {
          itemId: `T${item.tier}_METALBAR`,
          name: `Tier ${item.tier} Metal Bar`,
          count: 8 * quantity,
          unitPrice: 0,
          totalPrice: 0,
          imageUrl: ItemService.getItemImageUrl(`T${item.tier}_METALBAR`, 1, 48),
        },
      ];

      // Fetch prices for resources
      const resourceIds = mockResources.map(r => r.itemId);
      const prices = await MarketService.getPrices(server, resourceIds, [selectedCity]);

      const updatedResources = mockResources.map(resource => {
        const price = prices.find(p => p.item_id === resource.itemId && p.city === selectedCity);
        const unitPrice = price?.sell_price_min || 0;
        return {
          ...resource,
          unitPrice,
          totalPrice: unitPrice * resource.count,
        };
      });

      setResourceCosts(updatedResources);

      // Fetch sell price for crafted item
      const itemPrices = await MarketService.getPrices(server, [item.id], [selectedCity]);
      const itemPrice = itemPrices.find(p => p.city === selectedCity);
      setSellPrice((itemPrice?.sell_price_min || 0) * quantity);
    } catch (err) {
      console.error('Calculation error:', err);
    } finally {
      setIsCalculating(false);
    }
  }, [server, selectedCity, quantity]);

  // Calculate totals
  const totalCost = resourceCosts.reduce((sum, r) => sum + r.totalPrice, 0);
  const returnRate = useFocus ? 0.595 : 0.152;
  const returnedValue = totalCost * returnRate;
  const actualCost = totalCost - returnedValue;
  const profit = sellPrice - actualCost;
  const profitMargin = actualCost > 0 ? (profit / actualCost) * 100 : 0;

  // Get city bonus
  const cityBonus = cityBonuses.find(cb => cb.city === selectedCity);
  const relevantBonus = cityBonus?.crafting.find(b => 
    selectedItem?.category?.toLowerCase().includes(b.item.toLowerCase())
  );

  return (
    <section 
      id="crafting"
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
            {t('crafting.title') as string}
          </h2>
          <p style={{ color: themeColors.textMuted }}>
            Crafting maliyetlerini hesaplayın, karlılığı analiz edin
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Inputs */}
          <div 
            className="lg:col-span-1 p-6 rounded-2xl h-fit"
            style={{ 
              backgroundColor: themeColors.surface,
              border: `1px solid ${themeColors.border}`,
            }}
          >
            <h3 
              className="text-lg font-semibold mb-6 flex items-center gap-2"
              style={{ color: themeColors.text }}
            >
              <Calculator size={20} style={{ color: themeColors.primary }} />
              Hesaplama Ayarları
            </h3>

            {/* Item Search */}
            <div className="mb-4">
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: themeColors.textMuted }}
              >
                {t('crafting.selectItem') as string}
              </label>
              <div className="relative">
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                  size={18}
                  style={{ color: themeColors.textMuted }}
                />
                <Input
                  placeholder="Eşya ara..."
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
                    className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-50 max-h-60 overflow-y-auto"
                    style={{ 
                      backgroundColor: themeColors.surface,
                      border: `1px solid ${themeColors.border}`,
                    }}
                  >
                    {searchResults.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => selectItem(item)}
                        className="w-full px-4 py-3 flex items-center gap-3 transition-colors"
                        style={{ borderBottom: `1px solid ${themeColors.border}` }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${themeColors.primary}20`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <img src={item.imageUrl} alt={item.name} className="w-8 h-8 object-contain" />
                        <span style={{ color: themeColors.text }}>{item.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* City Selection */}
            <div className="mb-4">
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: themeColors.textMuted }}
              >
                <MapPin size={14} className="inline mr-1" />
                Şehir
              </label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger 
                  style={{ 
                    backgroundColor: themeColors.background,
                    borderColor: themeColors.border,
                    color: themeColors.text,
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: themeColors.textMuted }}
              >
                <Package size={14} className="inline mr-1" />
                Miktar
              </label>
              <Input
                type="number"
                min={1}
                max={999}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                style={{ 
                  backgroundColor: themeColors.background,
                  borderColor: themeColors.border,
                  color: themeColors.text,
                }}
              />
            </div>

            {/* Use Focus */}
            <div className="flex items-center justify-between p-4 rounded-xl mb-4"
              style={{ backgroundColor: themeColors.background }}
            >
              <div>
                <span 
                  className="block font-medium"
                  style={{ color: themeColors.text }}
                >
                  Focus Kullan
                </span>
                <span 
                  className="text-sm"
                  style={{ color: themeColors.textMuted }}
                >
                  %59.5 Kaynak İadesi
                </span>
              </div>
              <Switch
                checked={useFocus}
                onCheckedChange={setUseFocus}
              />
            </div>

            {/* City Bonus Info */}
            {relevantBonus && (
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: `${themeColors.success}20` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} style={{ color: themeColors.success }} />
                  <span style={{ color: themeColors.success }}>Şehir Bonusu</span>
                </div>
                <p style={{ color: themeColors.text }}>
                  {relevantBonus.item}: +{relevantBonus.bonus}%
                </p>
              </div>
            )}
          </div>

          {/* Right Panel - Results */}
          <div 
            className="lg:col-span-2 p-6 rounded-2xl"
            style={{ 
              backgroundColor: themeColors.surface,
              border: `1px solid ${themeColors.border}`,
            }}
          >
            {selectedItem ? (
              <>
                {/* Selected Item Header */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b"
                  style={{ borderColor: themeColors.border }}
                >
                  <img 
                    src={selectedItem.imageUrl} 
                    alt={selectedItem.name}
                    className="w-16 h-16 object-contain"
                  />
                  <div>
                    <h3 style={{ color: themeColors.text }} className="text-xl font-semibold">
                      {selectedItem.name}
                    </h3>
                    <Badge style={{ backgroundColor: themeColors.primary }}>
                      Tier {selectedItem.tier}
                    </Badge>
                  </div>
                </div>

                {/* Resources */}
                <div className="mb-8">
                  <h4 
                    className="text-lg font-semibold mb-4 flex items-center gap-2"
                    style={{ color: themeColors.text }}
                  >
                    <Package size={18} style={{ color: themeColors.primary }} />
                    {t('crafting.resources') as string}
                  </h4>
                  
                  {isCalculating ? (
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <div 
                          key={i}
                          className="h-16 rounded-lg animate-pulse"
                          style={{ backgroundColor: themeColors.background }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {resourceCosts.map((resource) => (
                        <div 
                          key={resource.itemId}
                          className="flex items-center justify-between p-4 rounded-xl"
                          style={{ backgroundColor: themeColors.background }}
                        >
                          <div className="flex items-center gap-3">
                            <img 
                              src={resource.imageUrl} 
                              alt={resource.name}
                              className="w-10 h-10 object-contain"
                            />
                            <div>
                              <p style={{ color: themeColors.text }}>{resource.name}</p>
                              <p style={{ color: themeColors.textMuted }}>
                                {resource.count} adet
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p style={{ color: themeColors.text }}>
                              {resource.totalPrice.toLocaleString()} silver
                            </p>
                            <p style={{ color: themeColors.textMuted }}>
                              {resource.unitPrice.toLocaleString()} / adet
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div 
                  className="p-6 rounded-xl"
                  style={{ backgroundColor: themeColors.background }}
                >
                  <h4 
                    className="text-lg font-semibold mb-4"
                    style={{ color: themeColors.text }}
                  >
                    Özet
                  </h4>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg"
                      style={{ backgroundColor: themeColors.surface }}
                    >
                      <p style={{ color: themeColors.textMuted }} className="text-sm mb-1">
                        Toplam Maliyet
                      </p>
                      <p style={{ color: themeColors.text }} className="text-xl font-bold">
                        {totalCost.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="text-center p-4 rounded-lg"
                      style={{ backgroundColor: themeColors.surface }}
                    >
                      <p style={{ color: themeColors.textMuted }} className="text-sm mb-1">
                        İade ({useFocus ? '%59.5' : '%15.2'})
                      </p>
                      <p style={{ color: themeColors.success }} className="text-xl font-bold">
                        {returnedValue.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="text-center p-4 rounded-lg"
                      style={{ backgroundColor: themeColors.surface }}
                    >
                      <p style={{ color: themeColors.textMuted }} className="text-sm mb-1">
                        Gerçek Maliyet
                      </p>
                      <p style={{ color: themeColors.text }} className="text-xl font-bold">
                        {actualCost.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="text-center p-4 rounded-lg"
                      style={{ backgroundColor: themeColors.surface }}
                    >
                      <p style={{ color: themeColors.textMuted }} className="text-sm mb-1">
                        Kar
                      </p>
                      <p 
                        style={{ color: profit >= 0 ? themeColors.success : themeColors.error }} 
                        className="text-xl font-bold"
                      >
                        {profit.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Profit Margin */}
                  <div className="mt-4 p-4 rounded-lg text-center"
                    style={{ 
                      backgroundColor: profit >= 0 ? `${themeColors.success}20` : `${themeColors.error}20`,
                    }}
                  >
                    <p style={{ color: themeColors.textMuted }} className="text-sm mb-1">
                      Kar Marjı
                    </p>
                    <p 
                      style={{ color: profit >= 0 ? themeColors.success : themeColors.error }}
                      className="text-2xl font-bold"
                    >
                      {profitMargin >= 0 ? '+' : ''}{profitMargin.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <Calculator size={64} style={{ color: themeColors.textMuted }} className="mx-auto mb-4" />
                <p style={{ color: themeColors.textMuted }}>
                  Crafting hesaplaması için bir eşya seçin
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CraftingSection;
