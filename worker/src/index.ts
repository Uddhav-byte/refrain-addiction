import { handleApiRequest, Env } from './api';
import { verifyJWT } from './auth';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // WebSocket endpoint: /ws/chat/:roomId or /ws/community/:roomId
    if (url.pathname.startsWith('/ws/')) {
      const upgradeHeader = request.headers.get('Upgrade');
      if (upgradeHeader && upgradeHeader.toLowerCase() === 'websocket') {
        const pair = new WebSocketPair();
        const [client, server] = Object.values(pair);

        server.accept();

        const token = url.searchParams.get('token');
        let user: any = null;
        if (token) {
          user = await verifyJWT(token, env.JWT_SECRET);
        }

        // Send initial presence
        server.send(JSON.stringify({
          type: 'presence',
          payload: { count: 5 }
        }));

        server.addEventListener('message', async (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data as string);
            if (data.type === 'ping') {
              server.send(JSON.stringify({ type: 'pong' }));
            } else if (data.type === 'chat_message') {
              const roomId = url.pathname.split('/').pop() || 'general';
              const content = data.content || '';
              const userId = user?.sub || 'user-' + Math.random().toString(36).substring(7);
              const username = user?.username || 'Supportive Peer';
              const msgId = crypto.randomUUID();
              const now = new Date().toISOString();

              // Save to D1
              ctx.waitUntil(
                env.refrain_db.prepare(
                  'INSERT INTO chat_messages (id, room_id, user_id, username, content, message_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
                ).bind(msgId, roomId, userId, username, content, 'text', now).run().catch(console.error)
              );

              server.send(JSON.stringify({
                type: 'chat_message',
                payload: {
                  id: msgId,
                  room_id: roomId,
                  user_id: userId,
                  username,
                  content,
                  message_type: 'text',
                  created_at: now
                }
              }));
            } else if (data.type === 'urge_checkin') {
              server.send(JSON.stringify({
                type: 'presence',
                payload: { count: 6 }
              }));
            }
          } catch (err) {
            console.error('WebSocket error:', err);
          }
        });

        return new Response(null, {
          status: 101,
          webSocket: client
        });
      }
    }

    return handleApiRequest(request, env);
  }
};
