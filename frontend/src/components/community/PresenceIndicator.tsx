import React from 'react';
import { motion } from 'framer-motion';

interface PresenceIndicatorProps {
  count: number;
  isConnected: boolean;
}

export default function PresenceIndicator({ count, isConnected }: PresenceIndicatorProps) {
  return (
    <div className="flex items-center gap-2 bg-muted/40 px-3 py-1 rounded-full">
      <div className="relative flex items-center justify-center w-2 h-2">
        {isConnected ? (
          <>
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </>
        ) : (
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        )}
      </div>
      <motion.span 
        key={count}
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-xs font-medium text-muted-foreground"
      >
        {isConnected ? `${count} online` : 'Disconnected'}
      </motion.span>
    </div>
  );
}
