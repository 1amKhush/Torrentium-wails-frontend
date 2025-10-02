// frontend/src/pages/Upload.jsx
import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { selectFile, addFile } from '../api';

export function Upload() {
  const [selectedFilePath, setSelectedFilePath] = useState('');
  const [cid, setCid] = useState('');
  const [error, setError] = useState('');

  const handleSelectFile = async () => {
    try {
      const filePath = await selectFile();
      setSelectedFilePath(filePath);
      setError('');
    } catch (err) {
      setError('Failed to select file');
      console.error(err);
    }
  };

  const handleAddFile = async () => {
    if (!selectedFilePath) {
      setError('Please select a file first');
      return;
    }
    try {
      const resultCid = await addFile(selectedFilePath);
      setCid(resultCid);
      setError('');
    } catch (err) {
      setError('Failed to add file');
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Upload a File</h1>
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          readOnly
          value={selectedFilePath}
          placeholder="Click 'Select File' to choose a file"
          className="flex-grow"
        />
        <Button onClick={handleSelectFile}>Select File</Button>
      </div>
      <Button onClick={handleAddFile} className="mt-2">
        Add File
      </Button>
      {cid && (
        <div className="mt-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
          Successfully added file with CID: {cid}
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