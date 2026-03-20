import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { 
  Github, Twitter, MessageCircle, Heart, 
  ExternalLink, Code, Database, Shield
} from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  items: FooterLink[];
}

export const Footer: React.FC = () => {
  const { currentTheme } = useApp();
  const themeColors = currentTheme.colors;

  const links: FooterSection[] = [
    {
      title: 'Araçlar',
      items: [
        { label: 'Pazar', href: '#market' },
        { label: 'Crafting', href: '#crafting' },
        { label: 'Haritalar', href: '#maps' },
        { label: 'Killboard', href: '#killboard' },
        { label: 'Buildler', href: '#builds' },
      ],
    },
    {
      title: 'Kaynaklar',
      items: [
        { label: 'Albion Online', href: 'https://albiononline.com', external: true },
        { label: 'Albion Data Project', href: 'https://www.albion-online-data.com', external: true },
        { label: 'Wiki', href: 'https://wiki.albiononline.com', external: true },
        { label: 'Forum', href: 'https://forum.albiononline.com', external: true },
      ],
    },
    {
      title: 'Geliştirici',
      items: [
        { label: 'GitHub', href: 'https://github.com/CehennemGibiyim', external: true },
        { label: 'API Dokümantasyonu', href: 'https://www.albion-online-data.com/api', external: true },
      ],
    },
  ];

  return (
    <footer 
      className="py-16 border-t"
      style={{ 
        backgroundColor: themeColors.surface,
        borderColor: themeColors.border,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: themeColors.primary }}
              >
                <span className="text-white font-bold text-xl">AO</span>
              </div>
              <span 
                className="font-bold text-2xl"
                style={{ color: themeColors.text }}
              >
                Albion Online Tools
              </span>
            </div>
            <p 
              className="mb-6 max-w-sm"
              style={{ color: themeColors.textMuted }}
            >
              Gerçek zamanlı pazar fiyatları, crafting hesaplayıcı, haritalar, 
              killboard ve AI destekli build önerileri - hepsi bir arada!
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/CehennemGibiyim"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                style={{ 
                  backgroundColor: themeColors.background,
                  color: themeColors.text,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = themeColors.primary;
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = themeColors.background;
                  e.currentTarget.style.color = themeColors.text;
                }}
              >
                <Github size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                style={{ 
                  backgroundColor: themeColors.background,
                  color: themeColors.text,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = themeColors.primary;
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = themeColors.background;
                  e.currentTarget.style.color = themeColors.text;
                }}
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                style={{ 
                  backgroundColor: themeColors.background,
                  color: themeColors.text,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = themeColors.primary;
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = themeColors.background;
                  e.currentTarget.style.color = themeColors.text;
                }}
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          {links.map((section) => (
            <div key={section.title}>
              <h3 
                className="font-semibold mb-4"
                style={{ color: themeColors.text }}
              >
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-1 transition-colors"
                      style={{ color: themeColors.textMuted }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = themeColors.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = themeColors.textMuted;
                      }}
                    >
                      {item.label}
                      {item.external && <ExternalLink size={12} />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div 
          className="border-t pt-8"
          style={{ borderColor: themeColors.border }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div 
              className="flex items-center gap-2 text-sm"
              style={{ color: themeColors.textMuted }}
            >
              <Code size={16} />
              <span>Developed with</span>
              <Heart size={14} style={{ color: themeColors.error }} className="fill-current" />
              <span>by</span>
              <a 
                href="https://github.com/CehennemGibiyim"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
                style={{ color: themeColors.primary }}
              >
                CehennemGibiyim
              </a>
            </div>

            <div 
              className="flex items-center gap-4 text-sm"
              style={{ color: themeColors.textMuted }}
            >
              <div className="flex items-center gap-1">
                <Database size={14} />
                <span>Data by Albion Data Project</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield size={14} />
                <span>Not affiliated with Sandbox Interactive</span>
              </div>
            </div>
          </div>

          <div 
            className="text-center mt-6 text-sm"
            style={{ color: themeColors.textMuted }}
          >
            © {new Date().getFullYear()} Albion Online Tools. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
