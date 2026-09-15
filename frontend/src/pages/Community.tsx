import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChatRoom } from '@/components/community/ChatRoom';
import { RoomList } from '@/components/community/RoomList';
import { UrgeSurfingModal } from '@/components/urge/UrgeSurfingModal';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';
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
      if (data.length > 0 && !data.find((r: ChatRoomType) => r.room_id === activeRoom)) {
        setActiveRoom(data[0].room_id);
      }
    } catch (err) {
      console.error('Failed to load rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex gap-6 h-[calc(100vh-4rem)]">
        <div className="w-72 space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <Skeleton className="flex-1" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 h-[calc(100vh-4rem)]"
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Community</h1>
        <Button
          onClick={() => setShowUrgeSurfing(true)}
          variant="destructive"
          className="gap-2"
        >
          <AlertTriangle className="h-4 w-4" />
          Urge Surfing
        </Button>
      </div>

      <div className="flex gap-6 h-[calc(100%-3.5rem)]">
        <div className="w-72 shrink-0 hidden md:block">
          <RoomList
            rooms={rooms}
            activeRoom={activeRoom}
            onSelectRoom={setActiveRoom}
          />
        </div>
        <div className="flex-1 min-w-0">
          <ChatRoom roomId={activeRoom} />
        </div>
      </div>

      {showUrgeSurfing && (
        <UrgeSurfingModal onClose={() => setShowUrgeSurfing(false)} />
      )}
    </motion.div>
  );
}
