import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatRoom as ChatRoomType } from '@/types';
import { api } from '@/lib/api';
import { MessageCircle, Heart, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PresenceIndicator } from './PresenceIndicator';

interface RoomListProps {
  rooms?: ChatRoomType[];
  activeRoom?: string;
  activeRoomId?: string;
  onSelectRoom?: (roomId: string) => void;
  onSelect?: (roomId: string) => void;
}

export const RoomList: React.FC<RoomListProps> = ({
  rooms: propRooms,
  activeRoom,
  activeRoomId,
  onSelectRoom,
  onSelect,
}) => {
  const [rooms, setRooms] = useState<ChatRoomType[]>(propRooms || []);
  const [loading, setLoading] = useState(!propRooms || propRooms.length === 0);

  const selectedRoomId = activeRoom || activeRoomId;
  const handleSelect = onSelectRoom || onSelect || (() => {});

  useEffect(() => {
    if (propRooms && propRooms.length > 0) {
      setRooms(propRooms);
      setLoading(false);
      return;
    }
    const fetchRooms = async () => {
      try {
        const data = await api.chat.getRooms();
        setRooms(data);
      } catch (err) {
        console.error('Failed to fetch rooms');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [propRooms]);

  const getIcon = (type?: string) => {
    switch (type) {
      case 'support': return <Heart className="w-4 h-4 text-pink-500" />;
      case 'emergency': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <MessageCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {rooms.map((room) => {
        const roomId = room.room_id || room.id || '';
        const isActive = selectedRoomId === roomId || (room.id && selectedRoomId === room.id);
        return (
          <div
            key={roomId || room.name}
            onClick={() => handleSelect(roomId)}
            className={cn(
              "p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50",
              isActive ? "bg-muted border-primary shadow-sm" : "bg-card border-transparent"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 mb-1">
                {getIcon(room.type || room.room_type)}
                <h4 className="font-semibold text-sm">{room.name}</h4>
              </div>
              <div className="flex items-center gap-1.5 bg-background px-2 py-0.5 rounded-full text-xs shadow-sm border">
                <PresenceIndicator count={room.onlineCount ?? room.online_count ?? 0} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{room.description}</p>
          </div>
        );
      })}
    </div>
  );
};
