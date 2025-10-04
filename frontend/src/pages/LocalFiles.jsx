import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ListLocalFiles } from '../../wailsjs/go/main/App';
import { useApp } from '../context/AppContext';

export function LocalFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useApp();

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const localFiles = await ListLocalFiles();
      setFiles(localFiles || []);
    } catch (error) {
      addNotification(`Error fetching local files: ${error}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Local Files</CardTitle>
              <CardDescription>
                These are the files you are currently sharing on the network.
              </CardDescription>
            </div>
            <Button onClick={fetchFiles} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {files.length > 0 ? (
            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={file.cid || index} className="p-4 border border-surface rounded-card bg-surface/30">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-text truncate">{file.filename}</h3>
                      <p className="text-sm text-text-secondary mt-1">
                        Size: {formatFileSize(file.fileSize)}
                      </p>
                      {file.createdAt && (
                        <p className="text-xs text-text-secondary mt-1">
                          Added: {new Date(file.createdAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-text-secondary">CID:</p>
                    <p className="text-sm font-mono text-primary break-all">{file.cid}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-text-secondary">You are not sharing any files.</p>
              <p className="text-sm text-text-secondary mt-2">
                Go to the Upload page to share your first file.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}