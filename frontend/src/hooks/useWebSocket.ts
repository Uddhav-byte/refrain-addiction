import { useState, useEffect, useRef, useCallback } from 'react'
import { ChatMessage } from '../types'

interface WebSocketMessage {
  type: string
  payload: any
}

export function useWebSocket(roomId: string, onMessage: (msg: ChatMessage) => void) {
  const [isConnected, setIsConnected] = useState(false)
  const [onlineCount, setOnlineCount] = useState(0)
  const ws = useRef<WebSocket | null>(null)
  const reconnectTimeout = useRef<number | null>(null)
  const backoffDelay = useRef(1000)

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return

    const token = localStorage.getItem('access_token')
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const url = `${protocol}//${window.location.host}/ws/chat/${roomId}?token=${token}`

    ws.current = new WebSocket(url)

    ws.current.onopen = () => {
      setIsConnected(true)
      backoffDelay.current = 1000
    }

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WebSocketMessage
        if (data.type === 'chat_message') {
          onMessage(data.payload as ChatMessage)
        } else if (data.type === 'presence') {
          setOnlineCount(data.payload.count)
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message', err)
      }
    }

    ws.current.onclose = () => {
      setIsConnected(false)
      ws.current = null
      
      // Exponential backoff reconnect
      if (!reconnectTimeout.current) {
        reconnectTimeout.current = window.setTimeout(() => {
          reconnectTimeout.current = null
          backoffDelay.current = Math.min(backoffDelay.current * 1.5, 30000)
          connect()
        }, backoffDelay.current)
      }
    }

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error)
      ws.current?.close()
    }
  }, [roomId, onMessage])

  useEffect(() => {
    connect()

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current)
      }
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [connect])

  const sendMessage = useCallback((content: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'chat_message', content }))
    }
  }, [])

  const sendPing = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'ping' }))
    }
  }, [])

  const sendUrgeCheckin = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'urge_checkin' }))
    }
  }, [])

  return { isConnected, sendMessage, sendPing, sendUrgeCheckin, onlineCount }
}
