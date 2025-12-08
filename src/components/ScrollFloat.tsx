import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';

type ScrollFloatProps = {
  text: string;
  className?: string;
  style?: CSSProperties;
};

export const ScrollFloat = ({ text, className, style }: ScrollFloatProps) => {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.08, 
        delayChildren: 0.1 
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30, rotateX: -20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: { 
        type: 'spring', 
        damping: 20, 
        stiffness: 100 
      } 
    },
  };

  return (
    <motion.h1
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      style={{ perspective: "1000px", ...style }}
    >
      {words.map((word, i) => (
        <motion.span 
          key={i} 
          variants={item} 
          className="inline-block mr-[0.25em] origin-bottom"
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
};
