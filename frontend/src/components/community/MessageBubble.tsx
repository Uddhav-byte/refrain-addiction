import React from 'react';
import { motion } from 'framer-motion';
import { ChatMessage } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  if (message.type === 'system') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center my-4"
      >
        <span className="text-xs italic text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
          {message.content}
        </span>
      </motion.div>
    );
  }

  if (message.type === 'urge_checkin') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full flex justify-center my-6"
      >
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 max-w-sm w-full text-center space-y-2 shadow-sm">
          <Heart className="w-6 h-6 text-red-500 mx-auto animate-pulse" />
          <p className="text-sm font-medium">
            <span className="font-bold">{message.userName}</span> is fighting an urge right now.
          </p>
          <button className="text-xs bg-red-500 text-white px-4 py-1.5 rounded-full font-semibold hover:bg-red-600 transition-colors">
            Send Support
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: isOwn ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn("flex w-full", isOwn ? "justify-end" : "justify-start")}
    >
      <div className={cn(
        "max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm relative group",
        isOwn ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"
      )}>
        {!isOwn && (
          <div className="text-[10px] font-semibold opacity-70 mb-1 block">
            {message.userName}
          </div>
        )}
        <p className="text-sm leading-relaxed break-words">
          {message.content}
        </p>
        <span className={cn(
          "text-[9px] block mt-1.5 opacity-60",
          isOwn ? "text-right" : "text-left"
        )}>
          {formatRelativeTime(message.timestamp)}
        </span>
      </div>
    </motion.div>
  );
};
