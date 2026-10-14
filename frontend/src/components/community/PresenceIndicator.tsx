import React from 'react';
import { motion } from 'framer-motion';

interface PresenceIndicatorProps {
  count: number;
}

export const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({ count }) => {
  return (
    <motion.div 
      className="flex items-center gap-1.5"
      key={count} // Re-animate on count change
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
      </div>
      <span className="text-xs font-medium text-muted-foreground">{count} online</span>
    </motion.div>
  );
};
