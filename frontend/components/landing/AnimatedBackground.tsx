import { motion } from 'framer-motion';
import React from 'react';

const AnimatedBackground: React.FC = () => {
  const gradientVariants = {
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    },
  };

  return (
    <motion.div
      className="fixed inset-0 -z-10 bg-gradient-to-r from-hero-start via-purple-500 to-hero-end opacity-70"
      variants={gradientVariants}
      initial="animate"
      animate="animate"
      transition={{
        duration: 15,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'reverse',
      }}
      style={{
        backgroundSize: '200% 200%',
      }}
    />
  );
};

export default AnimatedBackground;
