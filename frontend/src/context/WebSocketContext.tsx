import React, { createContext, useEffect, useState, useCallback, useRef, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

export interface WebSocketMessage {
  type: 'kpi_update' | 'log_event' | 'connection_status' | 'ack';
  data: any;
  timestamp: string | null;
}

export interface WebSocketContextType {
  isConnected: boolean;
  isConnecting: boolean;
  lastMessage: WebSocketMessage | null;
  error: string | null;
  reconnect: () => void;
}

export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const buildWebSocketUrl = useCallback(() => {
    const userId = user?.id || '';
    // In development, connect directly to backend; in production, use relative ws path
    const backendHost = import.meta.env.VITE_WS_HOST || 'localhost:8000';
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${backendHost}/ws/connect?user_id=${encodeURIComponent(userId)}`;
  }, [user?.id]);

  const connect = useCallback(() => {
    if (!isAuthenticated || !user?.id) {
      return;
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const url = buildWebSocketUrl();
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);

          // Handle different message types
          switch (message.type) {
            case 'kpi_update':
              console.debug('KPI update received:', message.data);
              break;
            case 'log_event':
              console.debug('Log event received:', message.data);
              break;
            case 'connection_status':
              console.debug('Connection status:', message.data);
              break;
            default:
              console.debug('Unknown message type:', message.type);
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('WebSocket connection error');
        setIsConnecting(false);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setIsConnecting(false);

        // Attempt to reconnect after 3 seconds if authenticated
        if (isAuthenticated && user?.id) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 3000);
        }
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('WebSocket connection error:', err);
      setError(String(err));
      setIsConnecting(false);
    }
  }, [isAuthenticated, user?.id, buildWebSocketUrl]);

  const reconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
    setIsConnected(false);
    setIsConnecting(false);
    connect();
  }, [connect]);

  // Connect on mount and when authentication changes
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      connect();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isAuthenticated, user?.id, connect]);

  const value: WebSocketContextType = {
    isConnected,
    isConnecting,
    lastMessage,
    error,
    reconnect,
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};
