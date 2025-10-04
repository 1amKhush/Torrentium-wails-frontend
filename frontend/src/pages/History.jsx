import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ListLocalFiles } from '../../wailsjs/go/main/App';
import { useApp } from '../context/AppContext';

export function History() {
  const [localFiles, setLocalFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useApp();

  const fetchLocalFiles = async () => {
    setLoading(true);
    try {
      const files = await ListLocalFiles();
      setLocalFiles(files || []);
      addNotification('Local files refreshed successfully', 'success');
    } catch (err) {
      addNotification('Failed to fetch local files', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocalFiles();
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
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
              <CardTitle>File History</CardTitle>
              <CardDescription>
                View your previously shared files and their metadata.
              </CardDescription>
            </div>
            <Button onClick={fetchLocalFiles} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {localFiles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-surface">
                    <th className="text-left py-3 px-4 font-medium text-text-secondary">File Name</th>
                    <th className="text-left py-3 px-4 font-medium text-text-secondary">CID</th>
                    <th className="text-left py-3 px-4 font-medium text-text-secondary">Size</th>
                    <th className="text-left py-3 px-4 font-medium text-text-secondary">Date Added</th>
                  </tr>
                </thead>
                <tbody>
                  {localFiles.map((file, index) => (
                    <tr key={file.cid || index} className="border-b border-surface hover:bg-surface/50">
                      <td className="py-3 px-4 font-medium">{file.filename}</td>
                      <td className="py-3 px-4 text-sm text-text-secondary font-mono">
                        {file.cid ? file.cid.substring(0, 20) + '...' : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm">{formatFileSize(file.fileSize)}</td>
                      <td className="py-3 px-4 text-sm text-text-secondary">
                        {file.createdAt || 'Unknown'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-text-secondary">No files in history.</p>
              <p className="text-sm text-text-secondary mt-2">Files you share will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}