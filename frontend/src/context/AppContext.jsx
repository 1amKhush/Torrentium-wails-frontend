import React, { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [isWailsReady, setIsWailsReady] = useState(false);
  const [peerID, setPeerID] = useState('');
  const [files, setFiles] = useState([]);
  const [peers, setPeers] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [networkHealth, setNetworkHealth] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize Wails connection
  useEffect(() => {
    const initWails = async () => {
      try {
        // Wait for Wails to be ready
        if (window.go && window.go.app && window.go.app.App) {
          const id = await window.go.app.App.GetPeerID();
          setPeerID(id);
          setIsWailsReady(true);
          
          // Get initial data
          await refreshData();
        } else {
          // Retry after a short delay if Wails isn't ready
          setTimeout(initWails, 100);
        }
      } catch (error) {
        console.error('Failed to initialize Wails:', error);
        setError('Failed to connect to backend');
      }
    };

    initWails();
  }, []);

  // Periodic data refresh
  useEffect(() => {
    if (!isWailsReady) return;

    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, [isWailsReady]);

  const refreshData = async () => {
    if (!window.go?.app?.App) return;

    try {
      const [localFiles, connectedPeers, networkHealthData] = await Promise.all([
        window.go.app.App.ListLocalFiles(),
        window.go.app.App.GetConnectedPeers(),
        window.go.app.App.GetNetworkHealth(),
      ]);

      setFiles(localFiles || []);
      setPeers(connectedPeers || []);
      setNetworkHealth(networkHealthData || {});
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  const addFile = async (filePath) => {
    if (!window.go?.app?.App) throw new Error('Backend not ready');
    
    setLoading(true);
    try {
      await window.go.app.App.AddFile(filePath);
      await refreshData();
      return { success: true };
    } catch (error) {
      console.error('Failed to add file:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (cid) => {
    if (!window.go?.app?.App) throw new Error('Backend not ready');
    
    setLoading(true);
    try {
      await window.go.app.App.DownloadFile(cid);
      return { success: true };
    } catch (error) {
      console.error('Failed to download file:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const searchFiles = async (query) => {
    if (!window.go?.app?.App) throw new Error('Backend not ready');
    
    setLoading(true);
    try {
      let results;
      if (query.startsWith('bafy') || query.startsWith('Qm')) {
        results = await window.go.app.App.SearchByCID(query);
      } else {
        results = await window.go.app.App.SearchByText(query);
      }
      return results || [];
    } catch (error) {
      console.error('Failed to search:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const connectToPeer = async (multiaddr) => {
    if (!window.go?.app?.App) throw new Error('Backend not ready');
    
    setLoading(true);
    try {
      await window.go.app.App.ConnectToPeer(multiaddr);
      await refreshData();
      return { success: true };
    } catch (error) {
      console.error('Failed to connect to peer:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const announceFile = async (cid) => {
    if (!window.go?.app?.App) throw new Error('Backend not ready');
    
    try {
      await window.go.app.App.AnnounceFile(cid);
      return { success: true };
    } catch (error) {
      console.error('Failed to announce file:', error);
      throw error;
    }
  };

  const getListeningAddresses = async () => {
    if (!window.go?.app?.App) return [];
    
    try {
      return await window.go.app.App.GetListeningAddresses();
    } catch (error) {
      console.error('Failed to get listening addresses:', error);
      return [];
    }
  };

  const value = {
    // State
    isWailsReady,
    peerID,
    files,
    peers,
    downloads,
    networkHealth,
    loading,
    error,
    
    // Actions
    addFile,
    downloadFile,
    searchFiles,
    connectToPeer,
    announceFile,
    getListeningAddresses,
    refreshData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
