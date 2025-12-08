import React from 'react';
import { ScrollFloat } from './ScrollFloat';
import { Button } from './ui/Button';
import { ArrowRight, MapPin, Users, CalendarDays, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import designSystem from '../design-system.json';

type HeroProps = {
  onApply: () => void;
};

const heroChips = [
  { icon: CalendarDays, text: 'Starts 15 Dec 2025' },
  { icon: MapPin, text: 'Bhubaneswar, Odisha' },
  { icon: Users, text: '10 – 15 fellows' },
  { icon: Home, text: 'Fully residential' },
];

export function Hero({ onApply }: HeroProps) {
  return (
    <section
      id="top"
      className="relative pt-32 pb-20 px-6 bg-neutral-light overflow-hidden"
      style={{ fontFamily: designSystem.typography.fontFamily.brand }}
    >
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute -top-16 right-0 w-[360px] h-[360px] bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[280px] h-[280px] bg-accent-blue/15 blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-4xl text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-sm font-semibold border border-neutral-light shadow-sm"
        >
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Applications close 30 Nov 2025
        </motion.div>

        <div className="space-y-1">
          <p className="text-primary text-sm font-semibold tracking-[0.5em] uppercase">Residential Cohort</p>
          <h1
            className="text-[clamp(2.5rem,6vw,4.5rem)] font-black text-secondary leading-tight"
            style={{ letterSpacing: '-0.03em' }}
          >
            Transform Your Career with Aveti Learning's 3‑Month Residential Training Program.
          </h1>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-neutral-dark text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
        >
          Gain real-world skills, hands-on experience, and career opportunities in a fully
          residential, no-fee program designed exclusively for graduates ready to lead.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button size="lg" onClick={onApply} className="w-full sm:w-auto">
            Apply Now <ArrowRight className="ml-2" size={20} />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-neutral-dark/20 text-neutral-dark hover:bg-white"
            onClick={() => window.open('https://avetilearning.com/brochure.pdf', '_blank')}
          >
            Download Brochure
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-4"
        >
          {heroChips.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white border border-neutral-light px-4 py-3 text-sm font-semibold text-secondary shadow-sm"
            >
              <Icon size={16} className="text-primary" />
              {text}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
