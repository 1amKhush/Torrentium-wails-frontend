// frontend/src/pages/Download.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { downloadFile, onDownloadComplete, onDownloadError } from '../api';

export function Download() {
  const [cid, setCid] = useState('');
  const [downloadStatus, setDownloadStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    onDownloadComplete((completedCid) => {
      setDownloadStatus(`Download complete for CID: ${completedCid}`);
    });

    onDownloadError((errorMessage) => {
      setError(`Download error: ${errorMessage}`);
    });
  }, []);

  const handleDownload = async () => {
    if (!cid) {
      setError('Please enter a CID');
      return;
    }
    try {
      setDownloadStatus(`Starting download for CID: ${cid}`);
      setError('');
      await downloadFile(cid);
    } catch (err) {
      setError('Failed to start download');
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Download a File</h1>
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          value={cid}
          onChange={(e) => setCid(e.target.value)}
          placeholder="Enter file CID"
          className="flex-grow"
        />
        <Button onClick={handleDownload}>Download</Button>
      </div>
      {downloadStatus && (
        <div className="mt-4 p-2 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          {downloadStatus}
        </div>
      )}
      {error && (
        <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}