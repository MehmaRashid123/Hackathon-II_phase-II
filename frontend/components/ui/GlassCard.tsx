import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={`
        relative p-6 rounded-lg shadow-lg overflow-hidden
        backdrop-filter backdrop-blur-lg
        bg-gradient-to-br from-white/10 to-white/5
        border border-solid border-white/20 dark:border-white/10
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;