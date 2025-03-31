import { useEffect, useRef, useState, useCallback } from 'react';

import { Opportunity } from '@/types/opportunity';
import { opportunityService } from '@/services/opportunities';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export const useOpportunitiesWebSocket = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reconnection logic refs
  const wsActive = useRef(false);
  const retryTimeout = useRef<NodeJS.Timeout | null>(null);
  const cleanupRef = useRef<() => void>(() => {});
  const retryCount = useRef(0);
  const clientRef = useRef<Client | null>(null);

  const handleStatusChange = useCallback((newStatus: ConnectionStatus) => {
    console.log(`Connection status changing to: ${newStatus}`);
    setConnectionStatus(newStatus);
    if (newStatus === 'connected') {
      retryCount.current = 0;
    }
  }, []);

  const reconnect = useCallback(() => {
    const MAX_RETRIES = 5;
    const BASE_DELAY = 3000;
    const MAX_DELAY = 30000;

    if (retryCount.current >= MAX_RETRIES) {
      handleStatusChange('error');
      return;
    }

    retryCount.current++;
    const delay = Math.min(BASE_DELAY * Math.pow(2, retryCount.current - 1), MAX_DELAY);
    
    retryTimeout.current = setTimeout(() => {
      initializeWebSocket();
    }, delay);
  }, [handleStatusChange]);

  const initializeWebSocket = useCallback(async () => {
    if (wsActive.current) return;

    try {
      handleStatusChange('connecting');
      wsActive.current = true;

      if (retryTimeout.current) {
        clearTimeout(retryTimeout.current);
        retryTimeout.current = null;
      }

      const cleanupPromise = new Promise<() => void>((resolve) => {
        // Store the client instance to check connection state
        const client = new Client({
          brokerURL: process.env.NEXT_PUBLIC_WS_URL || 'http://192.168.1.150:8080/ws',
          webSocketFactory: () => new SockJS(process.env.NEXT_PUBLIC_WS_URL || 'http://192.168.1.150:8080/ws'),
          reconnectDelay: 5000,
          debug: (str) => console.debug('STOMP:', str),
          onConnect: () => {
            console.log('STOMP connected via SockJS');
            handleStatusChange('connected');
            const subscription = client.subscribe('/topic/opportunities', (message) => {
              try {
                const data = JSON.parse(message.body);
                setOpportunities(data);
              } catch (error) {
                console.error('Error parsing message:', error);
              }
            });
            
            resolve(() => {
              subscription.unsubscribe();
              client.deactivate();
            });
          },
          onStompError: (frame) => {
            console.error('STOMP protocol error:', frame.headers.message);
            handleStatusChange('error');
          },
          onWebSocketError: (error) => {
            console.error('WebSocket transport error:', error);
            handleStatusChange('error');
          },
          onDisconnect: () => {
            console.log('STOMP disconnected');
            handleStatusChange('disconnected');
          }
        });

        clientRef.current = client;
        client.activate();
      });

      cleanupRef.current = await cleanupPromise;
    } catch (error) {
      console.error('WebSocket initialization failed:', error);
      wsActive.current = false;
      handleStatusChange('error');
      reconnect();
    }
  }, [handleStatusChange, reconnect]);
  const fetchInitialData = useCallback(async () => {
    try {
      const data = await opportunityService.getAll();
      setOpportunities(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch initial opportunities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial setup
  useEffect(() => {
    fetchInitialData();
    initializeWebSocket();

    return () => {
      cleanupRef.current?.();
      if (retryTimeout.current) {
        clearTimeout(retryTimeout.current);
      }
      wsActive.current = false;
      handleStatusChange('disconnected');
    };
  }, [fetchInitialData, initializeWebSocket, handleStatusChange]);

  // Fallback polling when WebSocket fails
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    if (connectionStatus === 'error') {
      pollInterval = setInterval(() => {
        opportunityService.getAll()
          .then(data => setOpportunities(data))
          .catch(err => console.error('Polling error:', err));
      }, 30000);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [connectionStatus]);

  // Expose a manual reconnect function
  const manualReconnect = useCallback(() => {
    if (retryTimeout.current) {
      clearTimeout(retryTimeout.current);
      retryTimeout.current = null;
    }
    retryCount.current = 0;
    initializeWebSocket();
  }, [initializeWebSocket]);

  return { 
    opportunities, 
    loading, 
    error, 
    connectionStatus,
    reconnect: manualReconnect
  };
};