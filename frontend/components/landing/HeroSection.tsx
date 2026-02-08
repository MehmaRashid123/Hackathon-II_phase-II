'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GradientButton } from '../ui/GradientButton'; // Assuming correct path
import ParticleBackground from '../ParticleBackground'; // Assuming correct path

interface CTAButtonProps {
  text: string;
  href: string;
}

interface HeroSectionProps {
  title: string;
  subtitle: string;
  primaryCTA: CTAButtonProps;
  secondaryCTA: CTAButtonProps;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle, primaryCTA, secondaryCTA }) => {
  return (
    <section className="relative h-screen flex items-center justify-center text-center px-4">
      <ParticleBackground />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-4"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8"
        >
          {subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <GradientButton size="lg" asChild>
            <a href={primaryCTA.href}>{primaryCTA.text}</a>
          </GradientButton>
          <GradientButton variant="secondary" size="lg" asChild>
            <a href={secondaryCTA.href}>{secondaryCTA.text}</a>
          </GradientButton>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;