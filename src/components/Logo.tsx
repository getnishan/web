import React from 'react';
import designSystem from '../design-system.json';

type LogoProps = {
  showWordmark?: boolean;
  direction?: 'horizontal' | 'stacked';
  className?: string;
};

export const Logo = ({
  showWordmark = true,
  direction = 'horizontal',
  className = '',
}: LogoProps) => {
  const { colors, typography } = designSystem;

  return (
    <div
      className={`flex items-center gap-3 ${direction === 'stacked' ? 'flex-col text-center' : ''} ${className}`}
      style={{ fontFamily: typography.fontFamily.brand }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg text-white font-black tracking-tight"
        style={{
          background: `linear-gradient(135deg, ${colors.primary.base}, ${colors.primary.dark})`,
          boxShadow: '0 15px 35px rgba(132, 188, 84, 0.35)',
        }}
        aria-hidden="true"
      >
        AL
      </div>
      {showWordmark && (
        <div className="leading-none">
          <p className="text-sm font-extrabold uppercase tracking-[0.4em] text-neutral-gray mb-1">
            Aveti
          </p>
          <p
            className="text-2xl font-black text-secondary"
            style={{ letterSpacing: '-0.025em' }}
          >
            Learning
            <span className="text-primary" aria-hidden="true">
              .
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

