from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, Depends, HTTPException, status
import asyncio
import json
import datetime
import logging
from typing import Dict, List, Any
from app.services import chat_service
from app.core.security import decode_token

logger = logging.getLogger(__name__)
router = APIRouter(tags=['Chat & WebSocket'])

class ConnectionManager:
    def __init__(self):
        # room_id -> {user_id: websocket}
        self.active_connections: Dict[str, Dict[str, WebSocket]] = {}

    async def connect(self, room_id: str, user_id: str, websocket: WebSocket):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = {}
        self.active_connections[room_id][user_id] = websocket
        
        # Broadcast join event
        await self.broadcast(room_id, {
            "type": "user_joined",
            "user_id": user_id,
            "online_count": self.get_online_count(room_id),
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
        })

    async def disconnect(self, room_id: str, user_id: str):
        if room_id in self.active_connections and user_id in self.active_connections[room_id]:
            del self.active_connections[room_id][user_id]
            if not self.active_connections[room_id]:
                del self.active_connections[room_id]
            else:
                await self.broadcast(room_id, {
                    "type": "user_left",
                    "user_id": user_id,
                    "online_count": self.get_online_count(room_id),
                    "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
                })

    async def broadcast(self, room_id: str, message: dict):
        if room_id in self.active_connections:
            stale_users = []
            for user_id, connection in self.active_connections[room_id].items():
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"Error sending to {user_id}: {e}")
                    stale_users.append(user_id)
            
            for user_id in stale_users:
                await self.disconnect(room_id, user_id)

    def get_online_count(self, room_id: str) -> int:
        return len(self.active_connections.get(room_id, {}))

    def get_total_online(self) -> int:
        return sum(len(room) for room in self.active_connections.values())

manager = ConnectionManager()

@router.websocket("/ws/community/{room_id}")
@router.websocket("/ws/chat/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, token: str = Query(...)):
    try:
        # Validate token
        payload = decode_token(token)
        if not payload or "sub" not in payload:
            await websocket.close(code=1008)
            return
        user_id = payload["sub"]
    except Exception:
        await websocket.close(code=1008)
        return

    await manager.connect(room_id, user_id, websocket)

    try:
        # Send chat history (last 50 messages)
        history = await chat_service.get_room_messages(room_id, limit=50)
        await websocket.send_json({
            "type": "history",
            "messages": [msg.model_dump() if hasattr(msg, 'model_dump') else dict(msg) for msg in history] if history else []
        })

        while True:
            try:
                data_str = await asyncio.wait_for(websocket.receive_text(), timeout=60.0)
                data = json.loads(data_str)
                msg_type = data.get("type", "")

                if msg_type == "message":
                    content = data.get("content", "")
                    saved_msg = await chat_service.save_message(
                        room_id=room_id,
                        user_id=user_id,
                        content=content
                    )
                    await manager.broadcast(room_id, {
                        "type": "message",
                        "message": saved_msg.model_dump() if hasattr(saved_msg, 'model_dump') else saved_msg
                    })
                elif msg_type == "ping":
                    await websocket.send_json({"type": "pong"})
                elif msg_type == "urge_checkin":
                    await manager.broadcast(room_id, {
                        "type": "urge_checkin",
                        "user_id": user_id,
                        "total_online": manager.get_total_online(),
                        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
                    })
            except asyncio.TimeoutError:
                # Send a ping to keep connection alive
                await websocket.send_json({"type": "ping"})
            except json.JSONDecodeError:
                pass
            
    except WebSocketDisconnect:
        await manager.disconnect(room_id, user_id)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await manager.disconnect(room_id, user_id)

@router.get('/api/v1/chat/rooms')
async def get_available_rooms():
    rooms = await chat_service.get_available_rooms()
    result = []
    for r in rooms:
        r_dict = r.model_dump() if hasattr(r, 'model_dump') else dict(r)
        r_dict['online_count'] = manager.get_online_count(str(r_dict.get('id', '')))
        result.append(r_dict)
    return result

@router.get('/api/v1/chat/rooms/{room_id}/messages')
async def get_room_messages(room_id: str, limit: int = Query(50), before: str = Query(None)):
    return await chat_service.get_room_messages(room_id, limit=limit, before=before)

@router.post('/api/v1/chat/rooms/{room_id}/messages')
async def post_room_message(room_id: str, data: dict):
    content = data.get("content", "")
    username = data.get("username", "Anonymous")
    user_id = data.get("user_id", "anon")
    saved = await chat_service.save_message(room_id=room_id, user_id=user_id, content=content)
    return saved
