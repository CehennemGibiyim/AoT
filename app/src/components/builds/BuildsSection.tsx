import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { ItemService } from '@/services/api';
import { 
  Sword, User, Users, Target, Zap, 
  Activity, Star, Copy, Check,
  ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { buildTemplates } from '@/config';
import type { BuildTemplate } from '@/config';

interface BuildCardProps {
  build: BuildTemplate;
  isAiRecommended?: boolean;
}

const BuildCard: React.FC<BuildCardProps> = ({ build, isAiRecommended = false }) => {
  const { currentTheme } = useApp();
  const themeColors = currentTheme.colors;
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const getItemImage = (itemId: string | undefined): string => {
    if (!itemId) return '';
    return ItemService.getItemImageUrl(itemId, 1, 64);
  };

  const copyBuild = () => {
    const buildText = `
${build.name}
${build.description}

Weapon: ${build.equipment.weapon}
Head: ${build.equipment.head}
Armor: ${build.equipment.armor}
Shoes: ${build.equipment.shoes}
${build.equipment.offhand ? `Offhand: ${build.equipment.offhand}` : ''}
${build.equipment.cape ? `Cape: ${build.equipment.cape}` : ''}
    `.trim();
    
    navigator.clipboard.writeText(buildText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const StatBar: React.FC<{ label: string; value: number; color: string }> = ({ 
    label, value, color 
  }) => (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1">
        <span style={{ color: themeColors.textMuted }}>{label}</span>
        <span style={{ color }}>{value}/10</span>
      </div>
      <div 
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: themeColors.background }}
      >
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${value * 10}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );

  return (
    <div 
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{ 
        backgroundColor: themeColors.surface,
        border: isAiRecommended 
          ? `2px solid ${themeColors.primary}` 
          : `1px solid ${themeColors.border}`,
        boxShadow: isAiRecommended ? `0 0 20px ${themeColors.primary}30` : 'none',
      }}
    >
      {/* Build Header */}
      <div 
        className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: themeColors.border }}
      >
        <div className="flex items-center gap-3">
          {isAiRecommended && (
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${themeColors.primary}30` }}
            >
              <Sparkles size={16} style={{ color: themeColors.primary }} />
            </div>
          )}
          <div>
            <h3 style={{ color: themeColors.text }} className="font-semibold text-lg">
              {build.name}
            </h3>
            <p style={{ color: themeColors.textMuted }} className="text-sm">
              {build.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            style={{ 
              backgroundColor: build.type === 'pvp' ? themeColors.error :
                               build.type === 'pve' ? themeColors.success :
                               build.type === 'solo' ? themeColors.info :
                               themeColors.warning,
            }}
          >
            {build.type.toUpperCase()}
          </Badge>
          {build.groupSize && (
            <Badge style={{ backgroundColor: themeColors.primary }}>
              {build.groupSize}v{build.groupSize}
            </Badge>
          )}
        </div>
      </div>

      {/* Equipment Preview */}
      <div className="p-4">
        <div className="flex gap-2 justify-center mb-4">
          {[
            build.equipment.weapon,
            build.equipment.head,
            build.equipment.armor,
            build.equipment.shoes,
            build.equipment.offhand,
            build.equipment.cape,
          ].filter(Boolean).map((item, idx) => (
            <div 
              key={idx}
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: themeColors.background }}
            >
              <img 
                src={getItemImage(item)}
                alt={item}
                className="w-10 h-10 object-contain"
              />
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mb-4">
          <StatBar label="Hasar" value={build.stats.damage} color={themeColors.error} />
          <StatBar label="Savunma" value={build.stats.defense} color={themeColors.success} />
          <StatBar label="Hareketlilik" value={build.stats.mobility} color={themeColors.info} />
          <StatBar label="Dayanıklılık" value={build.stats.sustain} color={themeColors.warning} />
          <StatBar label="Zorluk" value={build.stats.difficulty} color={themeColors.primary} />
        </div>

        {/* Expand/Collapse */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2 flex items-center justify-center gap-2 rounded-lg transition-colors"
          style={{ 
            color: themeColors.textMuted,
            backgroundColor: themeColors.background,
          }}
        >
          {expanded ? (
            <><ChevronUp size={16} /> Detayları Gizle</>
          ) : (
            <><ChevronDown size={16} /> Detayları Göster</>
          )}
        </button>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: themeColors.border }}>
            {/* Equipment Details */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {Object.entries(build.equipment).map(([slot, itemId]) => {
                if (!itemId) return null;
                return (
                  <div 
                    key={slot}
                    className="flex items-center gap-2 p-2 rounded-lg"
                    style={{ backgroundColor: themeColors.background }}
                  >
                    <img 
                      src={getItemImage(itemId)}
                      alt={itemId}
                      className="w-8 h-8 object-contain"
                    />
                    <div>
                      <p style={{ color: themeColors.textMuted }} className="text-xs capitalize">
                        {slot}
                      </p>
                      <p style={{ color: themeColors.text }} className="text-sm font-medium">
                        {itemId.split('_').slice(1).join(' ')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Skills */}
            <div className="mb-4">
              <h4 style={{ color: themeColors.text }} className="font-medium mb-2">
                Yetenekler
              </h4>
              <div className="space-y-2">
                {Object.entries(build.skills).map(([slot, skills]) => (
                  <div 
                    key={slot}
                    className="flex items-center gap-2"
                  >
                    <span 
                      style={{ color: themeColors.textMuted }} 
                      className="text-sm capitalize w-20"
                    >
                      {slot}:
                    </span>
                    <div className="flex gap-1">
                      {skills.map((skill, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 rounded text-xs"
                          style={{ 
                            backgroundColor: themeColors.background,
                            color: themeColors.text,
                            border: `1px solid ${themeColors.border}`,
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Copy Button */}
            <Button
              onClick={copyBuild}
              className="w-full"
              style={{ 
                backgroundColor: copied ? themeColors.success : themeColors.primary,
                color: '#ffffff',
              }}
            >
              {copied ? (
                <><Check size={16} className="mr-2" /> Kopyalandı</>
              ) : (
                <><Copy size={16} className="mr-2" /> Build\'i Kopyala</>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export const BuildsSection = () => {
  const { t, currentTheme } = useApp();
  const themeColors = currentTheme.colors;

  const [selectedActivity, setSelectedActivity] = useState('solo');
  const [groupSize, setGroupSize] = useState('5');
  const [showAiRecommendation, setShowAiRecommendation] = useState(false);

  const activities = [
    { id: 'solo', name: 'Solo', icon: User },
    { id: 'group', name: 'Grup', icon: Users },
    { id: 'dungeon', name: 'Zindan', icon: Target },
    { id: 'pvp', name: 'PvP', icon: Sword },
    { id: 'pve', name: 'PvE', icon: Activity },
    { id: 'ganking', name: 'Ganking', icon: Zap },
  ];

  // AI Recommendation
  const getAiRecommendation = () => {
    const size = parseInt(groupSize);
    
    // Find best build based on activity and group size
    let recommended = buildTemplates.find(b => 
      b.type === selectedActivity && 
      (size <= 5 ? b.stats.sustain > 5 : b.stats.damage > 5)
    );
    
    if (!recommended) {
      recommended = buildTemplates[0];
    }
    
    return recommended;
  };

  const aiBuild = getAiRecommendation();

  return (
    <section 
      id="builds"
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
            {t('builds.title') as string}
          </h2>
          <p style={{ color: themeColors.textMuted }}>
            AI destekli build önerileri - Solo, grup, zindan ve PvP için optimize edilmiş setler
          </p>
        </div>

        {/* AI Recommendation Section */}
        <div 
          className="p-6 rounded-2xl mb-8"
          style={{ 
            backgroundColor: `${themeColors.primary}10`,
            border: `2px solid ${themeColors.primary}50`,
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: themeColors.primary }}
            >
              <Sparkles size={24} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ color: themeColors.text }} className="text-xl font-bold">
                AI Build Önerisi
              </h3>
              <p style={{ color: themeColors.textMuted }}>
                Aktivitenize ve grup boyutunuza göre en iyi build
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Activity Select */}
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: themeColors.textMuted }}
              >
                {t('builds.selectActivity') as string}
              </label>
              <Select value={selectedActivity} onValueChange={setSelectedActivity}>
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
                  {activities.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <SelectItem key={activity.id} value={activity.id}>
                        <div className="flex items-center gap-2">
                          <Icon size={14} />
                          {activity.name}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Group Size Select */}
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: themeColors.textMuted }}
              >
                {t('builds.selectGroupSize') as string}
              </label>
              <Select value={groupSize} onValueChange={setGroupSize}>
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
                  <SelectItem value="1">Solo (1)</SelectItem>
                  <SelectItem value="2">Duo (2)</SelectItem>
                  <SelectItem value="5">Small Group (5)</SelectItem>
                  <SelectItem value="10">Medium Group (10)</SelectItem>
                  <SelectItem value="20">Large Group (20)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Generate Button */}
            <div className="flex items-end">
              <Button
                onClick={() => setShowAiRecommendation(true)}
                className="w-full"
                style={{ 
                  backgroundColor: themeColors.primary,
                  color: '#ffffff',
                }}
              >
                <Sparkles size={16} className="mr-2" />
                Öneri Al
              </Button>
            </div>
          </div>

          {/* AI Recommended Build */}
          {showAiRecommendation && (
            <div className="mt-6">
              <BuildCard build={aiBuild} isAiRecommended={true} />
            </div>
          )}
        </div>

        {/* Build Categories */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList 
            className="w-full justify-start mb-8 flex-wrap"
            style={{ backgroundColor: themeColors.surface }}
          >
            <TabsTrigger value="all" style={{ color: themeColors.text }}>
              Tümü
            </TabsTrigger>
            <TabsTrigger value="solo" style={{ color: themeColors.text }}>
              <User size={14} className="mr-2" />
              Solo
            </TabsTrigger>
            <TabsTrigger value="group" style={{ color: themeColors.text }}>
              <Users size={14} className="mr-2" />
              Grup
            </TabsTrigger>
            <TabsTrigger value="pvp" style={{ color: themeColors.text }}>
              <Sword size={14} className="mr-2" />
              PvP
            </TabsTrigger>
            <TabsTrigger value="pve" style={{ color: themeColors.text }}>
              <Activity size={14} className="mr-2" />
              PvE
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {buildTemplates.map((build) => (
                <BuildCard key={build.id} build={build} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="solo">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {buildTemplates.filter(b => b.type === 'solo').map((build) => (
                <BuildCard key={build.id} build={build} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="group">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {buildTemplates.filter(b => b.type === 'group').map((build) => (
                <BuildCard key={build.id} build={build} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pvp">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {buildTemplates.filter(b => b.type === 'pvp').map((build) => (
                <BuildCard key={build.id} build={build} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pve">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {buildTemplates.filter(b => b.type === 'pve').map((build) => (
                <BuildCard key={build.id} build={build} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Build Tips */}
        <div 
          className="mt-8 p-6 rounded-2xl"
          style={{ 
            backgroundColor: themeColors.surface,
            border: `1px solid ${themeColors.border}`,
          }}
        >
          <h3 
            className="text-lg font-semibold mb-4 flex items-center gap-2"
            style={{ color: themeColors.text }}
          >
            <Star size={20} style={{ color: themeColors.warning }} />
            Build İpuçları
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Solo Zindan', desc: 'Yüksek sürdürülebilirlik ve temizleme hızı önemli' },
              { title: 'Grup PvP', desc: 'Sinergi ve rol dağılımına dikkat edin' },
              { title: 'Ganking', desc: 'Hareketlilik ve ani hasar kritik' },
              { title: 'Toplama', desc: 'Kaçış araçları ve hayatta kalma yetenekleri' },
              { title: 'Tank', desc: 'CC ve savunma yeteneklerine odaklanın' },
              { title: 'Healer', desc: 'Enerji yönetimi ve pozisyonlama kritik' },
            ].map((tip, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl"
                style={{ backgroundColor: themeColors.background }}
              >
                <p style={{ color: themeColors.text }} className="font-medium mb-1">
                  {tip.title}
                </p>
                <p style={{ color: themeColors.textMuted }} className="text-sm">
                  {tip.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuildsSection;
