import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { 
  Sprout, Users, Factory, BookOpen, 
  Apple, Building2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Farming Calculator
const FarmingCalculator = () => {
  const { currentTheme } = useApp();
  const themeColors = currentTheme.colors;

  const [seedCost, setSeedCost] = useState(1000);
  const [yieldPerPlot, setYieldPerPlot] = useState(10);
  const [productPrice, setProductPrice] = useState(500);
  const [plotCount, setPlotCount] = useState(9);

  const totalCost = seedCost * plotCount;
  const totalYield = yieldPerPlot * plotCount;
  const totalRevenue = totalYield * productPrice;
  const profit = totalRevenue - totalCost;
  const profitPerPlot = profit / plotCount;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label style={{ color: themeColors.textMuted }} className="block text-sm mb-2">
            Tohum Maliyeti (adet)
          </label>
          <Input
            type="number"
            value={seedCost}
            onChange={(e) => setSeedCost(Number(e.target.value))}
            style={{ 
              backgroundColor: themeColors.background,
              borderColor: themeColors.border,
              color: themeColors.text,
            }}
          />
        </div>
        <div>
          <label style={{ color: themeColors.textMuted }} className="block text-sm mb-2">
            Verim (adet/plot)
          </label>
          <Input
            type="number"
            value={yieldPerPlot}
            onChange={(e) => setYieldPerPlot(Number(e.target.value))}
            style={{ 
              backgroundColor: themeColors.background,
              borderColor: themeColors.border,
              color: themeColors.text,
            }}
          />
        </div>
        <div>
          <label style={{ color: themeColors.textMuted }} className="block text-sm mb-2">
            Ürün Fiyatı (adet)
          </label>
          <Input
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(Number(e.target.value))}
            style={{ 
              backgroundColor: themeColors.background,
              borderColor: themeColors.border,
              color: themeColors.text,
            }}
          />
        </div>
        <div>
          <label style={{ color: themeColors.textMuted }} className="block text-sm mb-2">
            Plot Sayısı
          </label>
          <Input
            type="number"
            value={plotCount}
            onChange={(e) => setPlotCount(Number(e.target.value))}
            style={{ 
              backgroundColor: themeColors.background,
              borderColor: themeColors.border,
              color: themeColors.text,
            }}
          />
        </div>
      </div>

      <div 
        className="p-6 rounded-xl"
        style={{ backgroundColor: themeColors.background }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p style={{ color: themeColors.textMuted }} className="text-sm mb-1">Toplam Maliyet</p>
            <p style={{ color: themeColors.error }} className="text-xl font-bold">
              {totalCost.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p style={{ color: themeColors.textMuted }} className="text-sm mb-1">Toplam Gelir</p>
            <p style={{ color: themeColors.success }} className="text-xl font-bold">
              {totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p style={{ color: themeColors.textMuted }} className="text-sm mb-1">Kar</p>
            <p 
              style={{ color: profit >= 0 ? themeColors.success : themeColors.error }} 
              className="text-xl font-bold"
            >
              {profit.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p style={{ color: themeColors.textMuted }} className="text-sm mb-1">Kar/Plot</p>
            <p 
              style={{ color: profitPerPlot >= 0 ? themeColors.success : themeColors.error }} 
              className="text-xl font-bold"
            >
              {profitPerPlot.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Laborer Calculator
const LaborerCalculator = () => {
  const { currentTheme } = useApp();
  const themeColors = currentTheme.colors;

  const [tier, setTier] = useState(8);
  const [happiness, setHappiness] = useState(100);
  const [laborerCount, setLaborerCount] = useState(1);
  const [journalPrice, setJournalPrice] = useState(5000);
  const [returnValue, setReturnValue] = useState(8000);

  const efficiency = (happiness / 100) * (tier / 8);
  const dailyProfit = (returnValue * efficiency - journalPrice) * laborerCount;
  const weeklyProfit = dailyProfit * 7;
  const monthlyProfit = dailyProfit * 30;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label style={{ color: themeColors.textMuted }} className="block text-sm mb-2">
            Tier
          </label>
          <Select value={tier.toString()} onValueChange={(v) => setTier(Number(v))}>
            <SelectTrigger 
              style={{ 
                backgroundColor: themeColors.background,
                borderColor: themeColors.border,
                color: themeColors.text,
              }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: themeColors.surface }}>
              {[3, 4, 5, 6, 7, 8].map((t) => (
                <SelectItem key={t} value={t.toString()}>Tier {t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label style={{ color: themeColors.textMuted }} className="block text-sm mb-2">
            Mutluluk (%)
          </label>
          <Input
            type="number"
            value={happiness}
            onChange={(e) => setHappiness(Number(e.target.value))}
            style={{ 
              backgroundColor: themeColors.background,
              borderColor: themeColors.border,
              color: themeColors.text,
            }}
          />
        </div>
        <div>
          <label style={{ color: themeColors.textMuted }} className="block text-sm mb-2">
            İşçi Sayısı
          </label>
          <Input
            type="number"
            value={laborerCount}
            onChange={(e) => setLaborerCount(Number(e.target.value))}
            style={{ 
              backgroundColor: themeColors.background,
              borderColor: themeColors.border,
              color: themeColors.text,
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label style={{ color: themeColors.textMuted }} className="block text-sm mb-2">
            Günlük Fiyatı
          </label>
          <Input
            type="number"
            value={journalPrice}
            onChange={(e) => setJournalPrice(Number(e.target.value))}
            style={{ 
              backgroundColor: themeColors.background,
              borderColor: themeColors.border,
              color: themeColors.text,
            }}
          />
        </div>
        <div>
          <label style={{ color: themeColors.textMuted }} className="block text-sm mb-2">
            Dönüş Değeri
          </label>
          <Input
            type="number"
            value={returnValue}
            onChange={(e) => setReturnValue(Number(e.target.value))}
            style={{ 
              backgroundColor: themeColors.background,
              borderColor: themeColors.border,
              color: themeColors.text,
            }}
          />
        </div>
      </div>

      <div 
        className="p-6 rounded-xl"
        style={{ backgroundColor: themeColors.background }}
      >
        <div className="flex items-center justify-between mb-4">
          <span style={{ color: themeColors.textMuted }}>Verimlilik</span>
          <Badge style={{ backgroundColor: themeColors.primary }}>
            {(efficiency * 100).toFixed(0)}%
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p style={{ color: themeColors.textMuted }} className="text-sm mb-1">Günlük Kar</p>
            <p 
              style={{ color: dailyProfit >= 0 ? themeColors.success : themeColors.error }} 
              className="text-xl font-bold"
            >
              {dailyProfit.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p style={{ color: themeColors.textMuted }} className="text-sm mb-1">Haftalık Kar</p>
            <p 
              style={{ color: weeklyProfit >= 0 ? themeColors.success : themeColors.error }} 
              className="text-xl font-bold"
            >
              {weeklyProfit.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p style={{ color: themeColors.textMuted }} className="text-sm mb-1">Aylık Kar</p>
            <p 
              style={{ color: monthlyProfit >= 0 ? themeColors.success : themeColors.error }} 
              className="text-xl font-bold"
            >
              {monthlyProfit.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CalculatorSection = () => {
  const { t, currentTheme } = useApp();
  const themeColors = currentTheme.colors;

  const calculators = [
    { id: 'farming', name: 'Farming', icon: Sprout, component: FarmingCalculator },
    { id: 'laborers', name: 'İşçiler', icon: Users, component: LaborerCalculator },
    { id: 'refining', name: 'Rafine', icon: Factory, component: () => <div>Rafine hesaplayıcı yakında...</div> },
    { id: 'journal', name: 'Günlük', icon: BookOpen, component: () => <div>Günlük hesaplayıcı yakında...</div> },
    { id: 'nutrition', name: 'Besin', icon: Apple, component: () => <div>Besin hesaplayıcı yakında...</div> },
    { id: 'association', name: 'Birlik', icon: Building2, component: () => <div>Birlik hesaplayıcı yakında...</div> },
  ];

  return (
    <section 
      id="calculator"
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
            {t('calculator.title') as string}
          </h2>
          <p style={{ color: themeColors.textMuted }}>
            Farming, işçiler, rafine ve daha fazlası için hesaplayıcılar
          </p>
        </div>

        {/* Calculator Tabs */}
        <Tabs defaultValue="farming" className="w-full">
          <TabsList 
            className="w-full justify-start mb-8 flex-wrap"
            style={{ backgroundColor: themeColors.surface }}
          >
            {calculators.map((calc) => {
              const Icon = calc.icon;
              return (
                <TabsTrigger 
                  key={calc.id} 
                  value={calc.id}
                  style={{ color: themeColors.text }}
                >
                  <Icon size={16} className="mr-2" />
                  {calc.name}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {calculators.map((calc) => {
            const Component = calc.component;
            return (
              <TabsContent key={calc.id} value={calc.id}>
                <div 
                  className="p-6 rounded-2xl"
                  style={{ 
                    backgroundColor: themeColors.surface,
                    border: `1px solid ${themeColors.border}`,
                  }}
                >
                  <h3 
                    className="text-xl font-semibold mb-6 flex items-center gap-2"
                    style={{ color: themeColors.text }}
                  >
                    <calc.icon size={24} style={{ color: themeColors.primary }} />
                    {calc.name} Hesaplayıcı
                  </h3>
                  <Component />
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            { 
              title: 'Farming', 
              desc: 'En karlı ekinleri hesaplayın ve plot verimliliğinizi artırın',
              icon: Sprout,
              color: themeColors.success 
            },
            { 
              title: 'İşçiler', 
              desc: 'Mutluluk ve tier seviyesine göre günlük kar hesaplayın',
              icon: Users,
              color: themeColors.info 
            },
            { 
              title: 'Rafine', 
              desc: 'Şehir bonusları ve focus kullanımı ile maliyet analizi',
              icon: Factory,
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
                <h3 style={{ color: themeColors.text }} className="font-semibold mb-2">
                  {card.title}
                </h3>
                <p style={{ color: themeColors.textMuted }} className="text-sm">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CalculatorSection;
