import { AppProvider } from '@/contexts/AppContext';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { MarketSection } from '@/components/market/MarketSection';
import { CraftingSection } from '@/components/crafting/CraftingSection';
import { MapsSection } from '@/components/maps/MapsSection';
import { KillboardSection } from '@/components/killboard/KillboardSection';
import { BuildsSection } from '@/components/builds/BuildsSection';
import { CalculatorSection } from '@/components/calculator/CalculatorSection';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Hero />
          <MarketSection />
          <CraftingSection />
          <MapsSection />
          <KillboardSection />
          <BuildsSection />
          <CalculatorSection />
        </main>
        <Footer />
        <Toaster />
      </div>
    </AppProvider>
  );
}

export default App;
