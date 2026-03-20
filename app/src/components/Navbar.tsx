import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { 
  Menu, X, Globe, Palette, Server, 
  Home, ShoppingCart, Hammer, Map, Skull, 
  Shield, Calculator
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { servers, themes, type ServerType, type ThemeType, type LanguageType } from '@/config';

const navItems = [
  { key: 'home', href: '#home', icon: Home },
  { key: 'market', href: '#market', icon: ShoppingCart },
  { key: 'crafting', href: '#crafting', icon: Hammer },
  { key: 'maps', href: '#maps', icon: Map },
  { key: 'killboard', href: '#killboard', icon: Skull },
  { key: 'builds', href: '#builds', icon: Shield },
  { key: 'calculator', href: '#calculator', icon: Calculator },
];

const languages: { code: LanguageType; name: string; flag: string }[] = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export const Navbar = () => {
  const { server, setServer, theme, setTheme, language, setLanguage, t, currentTheme } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const themeColors = currentTheme.colors;

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md"
      style={{ 
        backgroundColor: `${themeColors.background}ee`,
        borderColor: themeColors.border,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: themeColors.primary }}
            >
              <span className="text-white font-bold text-lg">AO</span>
            </div>
            <span 
              className="font-bold text-xl hidden sm:block"
              style={{ color: themeColors.text }}
            >
              {t('siteName') as string}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.key}
                  href={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                  style={{ 
                    color: themeColors.textMuted,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = themeColors.text;
                    e.currentTarget.style.backgroundColor = themeColors.surfaceHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = themeColors.textMuted;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Icon size={16} />
                  {t(`nav.${item.key}`) as string}
                </a>
              );
            })}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2">
            {/* Server Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex items-center gap-2"
                  style={{ color: themeColors.text }}
                >
                  <Server size={16} />
                  <span className="hidden sm:inline">
                    {servers.find(s => s.id === server)?.flag}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end"
                style={{ 
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                }}
              >
                <DropdownMenuLabel style={{ color: themeColors.textMuted }}>
                  {t('server.title') as string}
                </DropdownMenuLabel>
                <DropdownMenuSeparator style={{ backgroundColor: themeColors.border }} />
                {servers.map((s) => (
                  <DropdownMenuItem
                    key={s.id}
                    onClick={() => setServer(s.id as ServerType)}
                    className="flex items-center gap-2 cursor-pointer"
                    style={{ 
                      color: server === s.id ? themeColors.primary : themeColors.text,
                      backgroundColor: server === s.id ? `${themeColors.primary}20` : 'transparent',
                    }}
                  >
                    <span>{s.flag}</span>
                    <span>{s.nameLocalized[language]}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex items-center gap-2"
                  style={{ color: themeColors.text }}
                >
                  <Palette size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end"
                className="max-h-80 overflow-auto"
                style={{ 
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                }}
              >
                <DropdownMenuLabel style={{ color: themeColors.textMuted }}>
                  {t('theme.title') as string}
                </DropdownMenuLabel>
                <DropdownMenuSeparator style={{ backgroundColor: themeColors.border }} />
                {themes.map((th) => (
                  <DropdownMenuItem
                    key={th.id}
                    onClick={() => setTheme(th.id as ThemeType)}
                    className="flex items-center gap-2 cursor-pointer"
                    style={{ 
                      color: theme === th.id ? th.colors.primary : themeColors.text,
                      backgroundColor: theme === th.id ? `${th.colors.primary}20` : 'transparent',
                    }}
                  >
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: th.colors.primary }}
                    />
                    <span>{th.nameLocalized[language]}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex items-center gap-2"
                  style={{ color: themeColors.text }}
                >
                  <Globe size={16} />
                  <span className="hidden sm:inline uppercase">{language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end"
                className="max-h-80 overflow-auto"
                style={{ 
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                }}
              >
                <DropdownMenuLabel style={{ color: themeColors.textMuted }}>
                  {t('language.title') as string}
                </DropdownMenuLabel>
                <DropdownMenuSeparator style={{ backgroundColor: themeColors.border }} />
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className="flex items-center gap-2 cursor-pointer"
                    style={{ 
                      color: language === lang.code ? themeColors.primary : themeColors.text,
                      backgroundColor: language === lang.code ? `${themeColors.primary}20` : 'transparent',
                    }}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: themeColors.text }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div 
            className="lg:hidden py-4 border-t"
            style={{ borderColor: themeColors.border }}
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    className="px-3 py-3 rounded-md text-sm font-medium transition-colors flex items-center gap-3"
                    style={{ 
                      color: themeColors.text,
                      backgroundColor: themeColors.surface,
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon size={18} style={{ color: themeColors.primary }} />
                    {t(`nav.${item.key}`) as string}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
