import { useApp } from '@/contexts/AppContext';
import { ChevronDown, TrendingUp, Skull, Map, Hammer } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Hero = () => {
  const { t, currentTheme } = useApp();
  const themeColors = currentTheme.colors;

  const features = [
    { icon: TrendingUp, key: 'market', color: '#22c55e' },
    { icon: Hammer, key: 'crafting', color: '#f59e0b' },
    { icon: Map, key: 'maps', color: '#3b82f6' },
    { icon: Skull, key: 'killboard', color: '#ef4444' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16"
      style={{ backgroundColor: themeColors.background }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${themeColors.primary} 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Gradient Orbs */}
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: themeColors.primary }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: themeColors.secondary }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
            style={{ 
              backgroundColor: `${themeColors.primary}20`,
              color: themeColors.primary,
              border: `1px solid ${themeColors.primary}40`,
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: themeColors.success }} />
            {t('siteDescription') as string}
          </div>

          {/* Main Title */}
          <h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            style={{ color: themeColors.text }}
          >
            <span style={{ color: themeColors.primary }}>Albion</span>
            <span style={{ color: themeColors.text }}> Online</span>
            <br />
            <span style={{ color: themeColors.secondary }}>Tools</span>
          </h1>

          {/* Subtitle */}
          <p 
            className="text-xl sm:text-2xl mb-12 max-w-2xl mx-auto"
            style={{ color: themeColors.textMuted }}
          >
            Gerçek zamanlı pazar fiyatları, crafting hesaplayıcı, haritalar, killboard ve AI destekli build önerileri - hepsi bir arada!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="px-8 py-6 text-lg font-semibold rounded-xl"
              style={{ 
                backgroundColor: themeColors.primary,
                color: '#ffffff',
              }}
              onClick={() => scrollToSection('market')}
            >
              {t('nav.market') as string}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg font-semibold rounded-xl"
              style={{ 
                borderColor: themeColors.border,
                color: themeColors.text,
              }}
              onClick={() => scrollToSection('crafting')}
            >
              {t('nav.crafting') as string}
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.key}
                  onClick={() => scrollToSection(feature.key)}
                  className="p-6 rounded-2xl transition-all duration-300 hover:scale-105 group"
                  style={{ 
                    backgroundColor: themeColors.surface,
                    border: `1px solid ${themeColors.border}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = feature.color;
                    e.currentTarget.style.boxShadow = `0 0 20px ${feature.color}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = themeColors.border;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors"
                    style={{ 
                      backgroundColor: `${feature.color}20`,
                    }}
                  >
                    <Icon size={24} style={{ color: feature.color }} />
                  </div>
                  <span 
                    className="font-medium"
                    style={{ color: themeColors.text }}
                  >
                    {t(`nav.${feature.key}`) as string}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown size={24} style={{ color: themeColors.textMuted }} />
      </div>
    </section>
  );
};

export default Hero;
