import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    try {
      const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 5000
      });
      
      newSocket.on('connect', () => {
        console.log('Socket connected successfully');
      });
      
      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        // Continue with app functionality even if socket fails
      });
      
      // Listen for fraud alerts
      newSocket.on('fraud-alert', (alert) => {
        setAlerts(prev => [alert, ...prev.slice(0, 99)]); // Keep last 100 alerts
      });
      
      setSocket(newSocket);
      
      return () => {
        if (newSocket) newSocket.close();
      };
    } catch (error) {
      console.error('Failed to initialize socket:', error);
      // App can still function without real-time updates
    }
  }, []);

  const addAlert = (alert) => {
    setAlerts(prev => [alert, ...prev]);
  };

  const removeAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  const value = {
    alerts,
    addAlert,
    removeAlert,
    clearAlerts,
    socket
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};