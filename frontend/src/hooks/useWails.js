import { useState, useEffect } from "react";

// Import Wails runtime
let wailsAPI = {};
if (window.go && window.go.app && window.go.app.App) {
  wailsAPI = window.go.app.App;
}

export const useWails = () => {
  const [isReady, setIsReady] = useState(false);
  const [peerID, setPeerID] = useState("");
  const [networkHealth, setNetworkHealth] = useState({});

  useEffect(() => {
    const initWails = async () => {
      try {
        if (wailsAPI.GetPeerID) {
          const id = await wailsAPI.GetPeerID();
          setPeerID(id);
          setIsReady(true);

          // Get initial network health
          const health = await wailsAPI.GetNetworkHealth();
          setNetworkHealth(health);
        }
      } catch (error) {
        console.error("Failed to initialize Wails:", error);
      }
    };

    initWails();
  }, []);

  const addFile = async (filePath) => {
    if (!wailsAPI.AddFile) throw new Error("Wails API not ready");
    return await wailsAPI.AddFile(filePath);
  };

  const listLocalFiles = async () => {
    if (!wailsAPI.ListLocalFiles) throw new Error("Wails API not ready");
    return await wailsAPI.ListLocalFiles();
  };

  const searchByCID = async (cid) => {
    if (!wailsAPI.SearchByCID) throw new Error("Wails API not ready");
    return await wailsAPI.SearchByCID(cid);
  };

  const searchByText = async (query) => {
    if (!wailsAPI.SearchByText) throw new Error("Wails API not ready");
    return await wailsAPI.SearchByText(query);
  };

  const downloadFile = async (cid) => {
    if (!wailsAPI.DownloadFile) throw new Error("Wails API not ready");
    return await wailsAPI.DownloadFile(cid);
  };

  const connectToPeer = async (multiaddr) => {
    if (!wailsAPI.ConnectToPeer) throw new Error("Wails API not ready");
    return await wailsAPI.ConnectToPeer(multiaddr);
  };

  const getConnectedPeers = async () => {
    if (!wailsAPI.GetConnectedPeers) throw new Error("Wails API not ready");
    return await wailsAPI.GetConnectedPeers();
  };

  const announceFile = async (cid) => {
    if (!wailsAPI.AnnounceFile) throw new Error("Wails API not ready");
    return await wailsAPI.AnnounceFile(cid);
  };

  const getNetworkHealth = async () => {
    if (!wailsAPI.GetNetworkHealth) throw new Error("Wails API not ready");
    return await wailsAPI.GetNetworkHealth();
  };

  const getActiveDownloads = async () => {
    if (!wailsAPI.GetActiveDownloads) throw new Error("Wails API not ready");
    return await wailsAPI.GetActiveDownloads();
  };

  return {
    isReady,
    peerID,
    networkHealth,
    addFile,
    listLocalFiles,
    searchByCID,
    searchByText,
    downloadFile,
    connectToPeer,
    getConnectedPeers,
    announceFile,
    getNetworkHealth,
    getActiveDownloads,
  };
};
