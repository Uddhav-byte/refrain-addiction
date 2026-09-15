import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Users } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useWebSocket } from '@/hooks/useWebSocket';
import { ChatMessage } from '@/types';
import { MessageBubble } from './MessageBubble';
import { PresenceIndicator } from './PresenceIndicator';
import { useAuth } from '@/lib/auth';

interface ChatRoomProps {
  roomId: string;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { isConnected, sendMessage, onlineCount } = useWebSocket(roomId, (newMsg: ChatMessage) => {
    setMessages((prev) => [...prev, newMsg]);
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await api.chat.getRoomMessages(roomId);
        setMessages(data);
      } catch (err) {
        console.error('Failed to load chat history');
      }
    };
    if (roomId) fetchMessages();
  }, [roomId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !isConnected) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b flex justify-between items-center bg-muted/20">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Community Chat</h3>
          {!isConnected && <span className="text-xs text-destructive">(Reconnecting...)</span>}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <PresenceIndicator count={onlineCount} />
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {messages.map((msg, idx) => (
          <MessageBubble key={msg.id || idx} message={msg} isOwn={msg.userId === user?.id} />
        ))}
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            No messages yet. Say hello to the community!
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-3 border-t bg-muted/10 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message of support..."
          className="flex-1 rounded-full bg-background"
          disabled={!isConnected}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={!input.trim() || !isConnected}
          className="rounded-full"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};
