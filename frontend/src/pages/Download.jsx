import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { DownloadFile } from '../../wailsjs/go/main/App';
import { EventsOn, EventsOff } from '../../wailsjs/runtime/runtime';
import { useApp } from '../context/AppContext';

export function Download() {
  const [cid, setCid] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const { addNotification } = useApp();

  useEffect(() => {
    // Setup event listeners for download events
    const unsubscribeComplete = EventsOn('download-complete', (data) => {
      setIsDownloading(false);
      addNotification(`Download completed: ${data.filename || 'File'}`, 'success');
    });

    const unsubscribeError = EventsOn('download-error', (error) => {
      setIsDownloading(false);
      addNotification(`Download failed: ${error.message || error}`, 'error');
    });

    const unsubscribeProgress = EventsOn('download-progress', (data) => {
      // You could add a progress bar here if needed
      console.log('Download progress:', data);
    });

    return () => {
      EventsOff('download-complete');
      EventsOff('download-error');
      EventsOff('download-progress');
    };
  }, [addNotification]);

  const handleDownload = async () => {
    if (!cid.trim()) {
      addNotification('Please enter a valid CID.', 'error');
      return;
    }

    setIsDownloading(true);
    try {
      await DownloadFile(cid.trim());
      addNotification(`Download started for CID: ${cid}`, 'success');
    } catch (error) {
      setIsDownloading(false);
      addNotification(`Error starting download: ${error}`, 'error');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isDownloading) {
      handleDownload();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Download File</CardTitle>
          <CardDescription>
            Enter the CID of the file you want to download from the network.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              value={cid}
              onChange={(e) => setCid(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter file CID (e.g., QmXYZ...)"
              disabled={isDownloading}
            />
            <p className="text-xs text-text-secondary">
              The CID (Content Identifier) uniquely identifies the file on the network.
            </p>
          </div>
          <Button 
            onClick={handleDownload} 
            disabled={!cid.trim() || isDownloading}
            className="w-full"
          >
            {isDownloading ? 'Downloading...' : 'Download'}
          </Button>
          {isDownloading && (
            <div className="text-center">
              <p className="text-sm text-text-secondary">
                Download in progress... You will be notified when it completes.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}