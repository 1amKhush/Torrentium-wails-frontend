import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { SelectFile, AddFile } from '../../wailsjs/go/main/App';
import { useApp } from '../context/AppContext';

export function Upload() {
  const [filePath, setFilePath] = useState('');
  const [cid, setCid] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { addNotification } = useApp();

  const handleSelectFile = async () => {
    try {
      const selectedFilePath = await SelectFile();
      if (selectedFilePath) {
        setFilePath(selectedFilePath);
        setCid(''); // Clear previous CID when selecting new file
        addNotification('File selected successfully', 'success');
      }
    } catch (error) {
      addNotification(`Error selecting file: ${error}`, 'error');
    }
  };

  const handleAddFile = async () => {
    if (!filePath) {
      addNotification('Please select a file first.', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const fileCid = await AddFile(filePath);
      setCid(fileCid);
      addNotification(`File added successfully! CID: ${fileCid}`, 'success');
    } catch (error) {
      addNotification(`Error adding file: ${error}`, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = async () => {
    if (cid) {
      try {
        await navigator.clipboard.writeText(cid);
        addNotification('CID copied to clipboard', 'success');
      } catch (error) {
        addNotification('Failed to copy CID', 'error');
      }
    }
  };

  const getFileName = (path) => {
    if (!path) return '';
    return path.split('\\').pop().split('/').pop();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>
            Select a file to share on the decentralized network.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input
                type="text"
                readOnly
                value={filePath ? getFileName(filePath) : ''}
                placeholder="No file selected"
                className="flex-1"
              />
              <Button onClick={handleSelectFile} disabled={isUploading}>
                Select File
              </Button>
            </div>
            {filePath && (
              <p className="text-xs text-text-secondary">
                Full path: {filePath}
              </p>
            )}
          </div>

          <Button 
            onClick={handleAddFile} 
            disabled={!filePath || isUploading}
            className="w-full"
          >
            {isUploading ? 'Adding File...' : 'Add File to Network'}
          </Button>

          {cid && (
            <div className="mt-6 p-4 border border-primary/20 rounded-card bg-primary/5">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-primary">File Added Successfully!</p>
                  <p className="text-sm text-text-secondary mt-1">Content Identifier (CID):</p>
                  <p className="text-sm font-mono text-text break-all mt-1">{cid}</p>
                </div>
              </div>
              <div className="flex space-x-2 mt-3">
                <Button size="sm" onClick={copyToClipboard}>
                  Copy CID
                </Button>
                <Button size="sm" variant="outline" onClick={() => setCid('')}>
                  Clear
                </Button>
              </div>
              <p className="text-xs text-text-secondary mt-2">
                Share this CID with others so they can download your file.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}