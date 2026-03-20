import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ServerType, ThemeType, LanguageType } from '@/config';
import { appConfig, themes } from '@/config';

// ============================================================================
// APP CONTEXT TYPES
// ============================================================================

interface AppContextType {
  // Server
  server: ServerType;
  setServer: (server: ServerType) => void;
  
  // Theme
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  currentTheme: typeof themes[0];
  
  // Language
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
  t: (key: string) => string | Record<string, string>;
  
  // Loading
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Error
  error: string | null;
  setError: (error: string | null) => void;
  
  // Refresh
  lastRefresh: number;
  triggerRefresh: () => void;
}

// ============================================================================
// TRANSLATIONS IMPORT
// ============================================================================

import { translations } from '@/config';

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const AppContext = createContext<AppContextType | undefined>(undefined);

// ============================================================================
// APP PROVIDER
// ============================================================================

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Server state
  const [server, setServerState] = useState<ServerType>(() => {
    const saved = localStorage.getItem('albion-server');
    return (saved as ServerType) || appConfig.defaultServer;
  });

  // Theme state
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('albion-theme');
    return (saved as ThemeType) || appConfig.defaultTheme;
  });

  // Language state
  const [language, setLanguageState] = useState<LanguageType>(() => {
    const saved = localStorage.getItem('albion-language');
    return (saved as LanguageType) || appConfig.defaultLanguage;
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Refresh state
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Get current theme config
  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  // Set server with persistence
  const setServer = useCallback((newServer: ServerType) => {
    setServerState(newServer);
    localStorage.setItem('albion-server', newServer);
  }, []);

  // Set theme with persistence
  const setTheme = useCallback((newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('albion-theme', newTheme);
  }, []);

  // Set language with persistence
  const setLanguage = useCallback((newLanguage: LanguageType) => {
    setLanguageState(newLanguage);
    localStorage.setItem('albion-language', newLanguage);
  }, []);

  // Trigger refresh
  const triggerRefresh = useCallback(() => {
    setLastRefresh(Date.now());
  }, []);

  // Translation function
  const t = useCallback((key: string): string | Record<string, string> => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return value || key;
  }, [language]);

  // Apply theme CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const themeColors = currentTheme.colors;
    
    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Set data-theme attribute for Tailwind
    root.setAttribute('data-theme', theme);
  }, [theme, currentTheme]);

  // Set language attribute
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value: AppContextType = {
    server,
    setServer,
    theme,
    setTheme,
    currentTheme,
    language,
    setLanguage,
    t,
    isLoading,
    setIsLoading,
    error,
    setError,
    lastRefresh,
    triggerRefresh,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// ============================================================================
// USE APP HOOK
// ============================================================================

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
