"use client";

import { motion } from 'framer-motion';

interface SkipToContentProps {
  targetId?: string;
  children?: React.ReactNode;
}

export function SkipToContent({ 
  targetId = 'main-content', 
  children = 'Pular para o conteúdo principal' 
}: SkipToContentProps) {
  const handleSkip = () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.button
      onClick={handleSkip}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-yellow-400 focus:text-black focus:font-semibold focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
      initial={{ opacity: 0, y: -10 }}
      whileFocus={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      aria-label="Pular para o conteúdo principal"
    >
      {children}
    </motion.button>
  );
}
