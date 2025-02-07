'use client';

import { motion } from 'framer-motion';
import { cn } from '@lib';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export function AnimatedText({ text, className }: AnimatedTextProps) {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className={cn('flex', className)}>
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index}>
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.div>
  );
}
