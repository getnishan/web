import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { ApplyProcess } from './components/ApplyProcess';
import { Button } from './components/ui/Button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import designSystem from './design-system.json';
import { VideoSection } from './components/VideoSection';
import { FourPointers } from './components/FourPointers';

const ctaBullets = [
  'Stay, meals, and learning resources included',
  'Small stipend for deserving candidates',
  'Career opportunities with Aveti for top performers',
];

function App() {
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  const openApply = () => setIsApplyOpen(true);
  const closeApply = () => setIsApplyOpen(false);

  return (
    <div
      className="min-h-screen bg-white selection:bg-primary selection:text-white text-neutral-black"
      style={{
        backgroundColor: designSystem.colors.neutral.background,
        fontFamily: designSystem.typography.fontFamily.brand,
      }}
    >
      <Navbar onApply={openApply} />

      <main>
        <Hero onApply={openApply} />
        <VideoSection onApply={openApply} />
        <FourPointers />
      </main>

      <Footer />

      <ApplyProcess isOpen={isApplyOpen} onClose={closeApply} />
    </div>
  );
}

export default App;
