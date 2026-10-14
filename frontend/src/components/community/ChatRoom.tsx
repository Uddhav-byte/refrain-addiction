import { useState, useEffect, useRef } from 'react';
import { Send, Users, Sparkles, MessageSquareHeart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api, isSupabaseConfigured } from '@/lib/api';
import { ChatMessage } from '@/types';
import { MessageBubble } from './MessageBubble';
import { PresenceIndicator } from './PresenceIndicator';
import { useAuth } from '@/lib/auth';
import toast from 'react-hot-toast';

interface ChatRoomProps {
  roomId: string;
}

const QUICK_SUPPORT_CHIPS = [
  'Stay strong! 💪',
  'Proud of you! ❤️',
  'One day at a time 🌱',
  'Breathe through the wave 🌊',
  'You are not alone in this 🙏',
];

export const ChatRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load message history
  useEffect(() => {
    let isMounted = true;
    const fetchMessages = async () => {
      try {
        const data = await api.chat.getRoomMessages(roomId, 50);
        if (isMounted) {
          setMessages(data);
        }
      } catch (err) {
        console.error('Failed to load chat history', err);
      }
    };

    if (roomId) {
      fetchMessages();
    }

    // Subscribe to real-time messages (Supabase Realtime or local fallback)
    const unsubscribe = api.chat.subscribe(roomId, (newMsg: ChatMessage) => {
      if (isMounted) {
        setMessages((prev) => {
          // Prevent duplicates
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [roomId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customText || input).trim();
    if (!textToSend || sending) return;

    setSending(true);
    try {
      const saved = await api.chat.sendMessage(roomId, textToSend);
      setMessages((prev) => {
        if (prev.some((m) => m.id === saved.id)) return prev;
        return [...prev, saved];
      });
      if (!customText) setInput('');
    } catch (err: any) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getRoomTitle = (id: string) => {
    switch (id) {
      case 'urge-surfing': return '🌊 Urge Surfing Station';
      case 'mindfulness': return '🧘 Mindfulness & Meditation';
      case 'milestones': return '🏆 Celebrations & Milestones';
      default: return '🌱 General Recovery';
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Room Header */}
      <div className="px-5 py-3.5 border-b border-border flex justify-between items-center bg-muted/30 backdrop-blur-sm">
        <div>
          <h3 className="font-bold text-base tracking-tight">{getRoomTitle(roomId)}</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
            {isSupabaseConfigured ? (
              <span className="flex items-center gap-1 text-emerald-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Supabase Realtime Active
              </span>
            ) : (
              <span>Peer Support Community</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/80 px-3 py-1.5 rounded-full border border-border shadow-xs">
          <Users className="w-3.5 h-3.5 text-primary" />
          <PresenceIndicator count={12} />
        </div>
      </div>

      {/* Messages Feed */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scroll-smooth"
      >
        {messages.map((msg, idx) => (
          <MessageBubble
            key={msg.id || idx}
            message={msg}
            isOwn={msg.user_id === user?.id || msg.userId === user?.id || msg.username === user?.username}
          />
        ))}

        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm space-y-2 p-8 text-center">
            <MessageSquareHeart className="w-10 h-10 text-primary/40 mb-2" />
            <p className="font-semibold text-foreground">No messages in this room yet.</p>
            <p className="text-xs max-w-xs">Be the first to say hello or share a word of encouragement with your peers!</p>
          </div>
        )}
      </div>

      {/* Quick encouragement chips */}
      <div className="px-4 py-2 border-t border-border/40 bg-muted/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mr-1" />
        {QUICK_SUPPORT_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleSend(undefined, chip)}
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-background/90 hover:bg-primary hover:text-primary-foreground border border-border/80 transition-colors shadow-2xs font-medium"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={(e) => handleSend(e)} className="p-3 border-t border-border bg-card flex gap-2 items-center">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${getRoomTitle(roomId)}...`}
          className="flex-1 rounded-full bg-background border-border text-sm px-4"
          disabled={sending}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={!input.trim() || sending}
          className="rounded-full h-10 w-10 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};
