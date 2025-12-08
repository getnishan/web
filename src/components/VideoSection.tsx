import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

type VideoSectionProps = {
  onApply: () => void;
};

export function VideoSection({ onApply }: VideoSectionProps) {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="container mx-auto max-w-5xl text-center space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary">
            Program story
          </p>
          <h2 className="text-3xl font-bold text-secondary">
            Watch Program Overview
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="rounded-[32px] overflow-hidden relative bg-neutral-black shadow-2xl border border-neutral-light mx-auto"
        >
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80"
            alt="Learners collaborating at Aveti Learning"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-6 left-6 text-left text-white">
            <p className="text-lg font-semibold">Watch Program Overview</p>
            <p className="text-sm text-white/80 max-w-md">
              Discover how our residential training transforms graduates into industry-ready professionals.
            </p>
          </div>
          <button
            onClick={onApply}
            className="absolute inset-0 flex items-center justify-center bg-black/40 text-white"
            aria-label="Play program story video"
          >
            <span className="w-20 h-20 rounded-full bg-white/10 border border-white/40 backdrop-blur text-white flex items-center justify-center">
              <Play size={32} className="ml-1" />
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}

