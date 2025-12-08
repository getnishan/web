import React from 'react';
import { Button } from './ui/Button';
import { Users, BookOpenCheck, Trophy, ClipboardList } from 'lucide-react';

const primaryCard = {
  title: 'A comprehensive training program designed for your success.',
  description:
    'Gain structure, mentorship, and analytics-backed feedback loops that keep you progressing every single week.',
};

const secondaryCard = {
  title: 'Performance',
  description: 'Identify your strengths through weekly reviews and ensure every project ships with confidence.',
};

const highlights = [
  {
    icon: Users,
    title: 'Engagement',
    copy: 'Daily peer feedback and mentor stand-ups keep you accountable and inspired.',
  },
  {
    icon: BookOpenCheck,
    title: 'Analytics',
    copy: 'Learning dashboards reveal progress so you can double down where it matters.',
  },
  {
    icon: Trophy,
    title: 'Grow',
    copy: 'Live project showcases and hiring partner connects accelerate your next role.',
  },
];

export function FourPointers() {
  return (
    <section className="py-20 px-6 bg-secondary text-white">
      <div className="container mx-auto max-w-6xl space-y-10">
        <p className="text-sm uppercase tracking-[0.4em] text-primary font-semibold">Program benefits</p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[28px] bg-secondary-variant/40 border border-white/5 p-8 space-y-4 shadow-[0px_25px_70px_rgba(0,0,0,0.35)]">
            <p className="text-2xl font-bold">{primaryCard.title}</p>
            <p className="text-white/70 leading-relaxed">{primaryCard.description}</p>
            <Button size="lg" className="w-full sm:w-auto bg-white text-secondary hover:bg-white/90 text-base font-bold shadow-lg shadow-black/30">
              Apply Now
            </Button>
          </div>

          <div className="rounded-[28px] bg-secondary-variant/40 border border-white/5 p-8 space-y-4 shadow-[0px_25px_70px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-3 text-primary">
              <ClipboardList size={20} />
              <span className="uppercase tracking-[0.3em] text-xs text-white/70">Performance</span>
            </div>
            <p className="text-xl font-semibold">{secondaryCard.title}</p>
            <p className="text-white/70 leading-relaxed">{secondaryCard.description}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-[24px] bg-secondary-variant/30 border border-white/5 p-6 space-y-3 shadow-[0px_20px_40px_rgba(0,0,0,0.25)]"
            >
              <item.icon size={22} className="text-primary" />
              <p className="text-lg font-semibold">{item.title}</p>
              <p className="text-sm text-white/70 leading-relaxed">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

