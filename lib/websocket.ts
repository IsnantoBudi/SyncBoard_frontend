import { useEffect, useRef, useState, useCallback } from 'react';

const RECONNECT_DELAY_MS = 3000;
const MAX_RECONNECT_ATTEMPTS = 5;

export function useWebSocket(url: string) {
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [lastMessage, setLastMessage] = useState<{ type: string; payload: unknown; timestamp: number } | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    ws.current = new WebSocket(url);

    ws.current.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data as string);
      if (data.type === 'USER_COUNT') {
        setActiveUsers(data.payload as number);
      } else if (data.type === 'TASK_UPDATED') {
        setLastMessage({ timestamp: Date.now(), ...data });
      }
    };

    ws.current.onopen = () => {
      reconnectAttempts.current = 0;
    };

    ws.current.onclose = () => {
      if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts.current += 1;
        reconnectTimeout.current = setTimeout(connect, RECONNECT_DELAY_MS);
      }
    };

    ws.current.onerror = () => {
      ws.current?.close();
    };
  }, [url]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      ws.current?.close();
    };
  }, [connect]);

  return { activeUsers, lastMessage };
}
