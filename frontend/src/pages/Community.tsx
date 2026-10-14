import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChatRoom } from '@/components/community/ChatRoom';
import { RoomList } from '@/components/community/RoomList';
import { UrgeSurfingModal } from '@/components/urge/UrgeSurfingModal';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, MessageCircle, Heart, Flame, Trophy } from 'lucide-react';
import type { ChatRoom as ChatRoomType } from '@/types';

export default function Community() {
  const [rooms, setRooms] = useState<ChatRoomType[]>([]);
  const [activeRoom, setActiveRoom] = useState<string>('general');
  const [loading, setLoading] = useState(true);
  const [showUrgeSurfing, setShowUrgeSurfing] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await api.chat.getRooms();
      setRooms(data);
      if (data.length > 0 && !data.find((r: ChatRoomType) => (r.room_id || r.id) === activeRoom)) {
        setActiveRoom(data[0].room_id || data[0].id || 'general');
      }
    } catch (err) {
      console.error('Failed to load rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMobileRoomIcon = (id: string) => {
    switch (id) {
      case 'urge-surfing': return <Flame className="w-3.5 h-3.5 text-rose-500" />;
      case 'mindfulness': return <Heart className="w-3.5 h-3.5 text-pink-500" />;
      case 'milestones': return <Trophy className="w-3.5 h-3.5 text-amber-500" />;
      default: return <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />;
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 flex gap-6 h-[calc(100vh-6rem)]">
        <div className="w-72 space-y-3 hidden md:block">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <Skeleton className="flex-1 rounded-2xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 md:p-6 h-[calc(100vh-5.5rem)] flex flex-col"
    >
      {/* Community Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Peer Support Community</h1>
          <p className="text-xs text-muted-foreground hidden sm:block">Encourage others, celebrate streaks, and find strength in shared journeys</p>
        </div>
        <Button
          onClick={() => setShowUrgeSurfing(true)}
          variant="destructive"
          size="sm"
          className="gap-2 shadow-sm font-semibold"
        >
          <AlertTriangle className="h-4 w-4" />
          Urge Surfing SOS
        </Button>
      </div>

      {/* Mobile Room Selector Tabs */}
      <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-2 shrink-0 no-scrollbar">
        {rooms.map((room) => {
          const roomId = room.room_id || room.id || '';
          const isActive = activeRoom === roomId;
          return (
            <button
              key={roomId}
              type="button"
              onClick={() => setActiveRoom(roomId)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap font-medium transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                  : 'bg-muted/80 text-muted-foreground hover:bg-muted'
              }`}
            >
              {getMobileRoomIcon(roomId)}
              {room.name}
            </button>
          );
        })}
      </div>

      {/* Main Chat Layout */}
      <div className="flex gap-6 flex-1 min-h-0">
        <div className="w-72 shrink-0 hidden md:block overflow-y-auto">
          <RoomList
            rooms={rooms}
            activeRoom={activeRoom}
            onSelectRoom={setActiveRoom}
          />
        </div>
        <div className="flex-1 min-w-0 h-full">
          <ChatRoom roomId={activeRoom} />
        </div>
      </div>

      {showUrgeSurfing && (
        <UrgeSurfingModal onClose={() => setShowUrgeSurfing(false)} />
      )}
    </motion.div>
  );
}
