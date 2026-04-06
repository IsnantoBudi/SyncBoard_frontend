import { useEffect, useRef, useState } from 'react';

export function useWebSocket(url: string) {
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(url);
    
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'USER_COUNT') {
        setActiveUsers(data.payload);
      } else if (data.type === 'TASK_UPDATED') {
        setLastMessage({ timestamp: Date.now(), ...data });
      }
    };

    ws.current.onclose = () => console.log('WS Disconnected');
    
    return () => {
      ws.current?.close();
    };
  }, [url]);

  return { activeUsers, lastMessage };
}
