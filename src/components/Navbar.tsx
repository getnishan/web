import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Menu, X, Instagram, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import designSystem from '../design-system.json';
import logoImg from '../assets/aveti-logo.svg';

export function Navbar({ onApply }: { onApply: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Program', href: '#program-overview' },
    { label: 'Learning Tracks', href: '#curriculum' },
    { label: 'Selection', href: '#selection-process' },
    { label: 'Residential Life', href: '#nature-of-program' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm py-3' : 'bg-transparent py-5'
      }`}
      style={{ borderBottom: isScrolled ? `1px solid ${designSystem.colors.neutral.line}` : 'transparent' }}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a
          href="#top"
          className="flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/40 rounded-pill"
        >
          <img src={logoImg} alt="Aveti Learning logo" className="w-12 h-12" />
          <div className="leading-tight text-secondary font-bold">
            <span className="block text-primary text-xs tracking-[0.4em] uppercase">AL</span>
            <span>Aveti Learning</span>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-neutral-dark hover:text-primary font-semibold text-sm transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-5">
          {[{ icon: Instagram, href: 'https://www.instagram.com/avetilearning/' }, { icon: Facebook, href: 'https://www.facebook.com/AvetiLearningEducation/' }].map(
            ({ icon: Icon, href }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                aria-label={`Visit us on ${href.includes('instagram') ? 'Instagram' : 'Facebook'}`}
              >
                <Icon size={16} />
              </a>
            )
          )}
          <Button onClick={onApply} size="sm" className="bg-primary text-white hover:bg-primary-variant border-none">
            Apply Now
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-neutral-dark p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-neutral-light absolute w-full"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((item) => (
                <a key={item.href} href={item.href} className="text-neutral-dark font-medium py-2">
                  {item.label}
                </a>
              ))}
              <div className="flex gap-3">
                {[{ icon: Instagram, href: 'https://www.instagram.com/avetilearning/' }, { icon: Facebook, href: 'https://www.facebook.com/AvetiLearningEducation/' }].map(
                  ({ icon: Icon, href }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center rounded-xl border border-primary/30 py-3 text-primary"
                    >
                      <Icon size={18} />
                    </a>
                  )
                )}
              </div>
              <Button onClick={onApply} className="w-full bg-primary hover:bg-primary-variant text-white">
                Apply Now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
