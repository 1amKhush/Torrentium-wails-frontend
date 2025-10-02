// frontend/src/pages/History.jsx
import React, { useState, useEffect } from 'react';
import { listLocalFiles } from '../api';
import { Button } from '../components/ui/Button';

export function History() {
  const [localFiles, setLocalFiles] = useState([]);
  const [error, setError] = useState('');

  const fetchLocalFiles = async () => {
    try {
      const files = await listLocalFiles();
      setLocalFiles(files || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch local files');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLocalFiles();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Local Files</h1>
        <Button onClick={fetchLocalFiles}>Refresh</Button>
      </div>
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">File Name</th>
              <th className="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">CID</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Size</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {localFiles.map((file, index) => (
              <tr key={index} className="border-b">
                <td className="py-3 px-4">{file.FileName}</td>
                <td className="py-3 px-4">{file.CID}</td>
                <td className="py-3 px-4">{file.Size} bytes</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}