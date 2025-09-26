import React, { useState } from 'react';
import { Upload, Download } from 'lucide-react';
import { Upload as UploadPage } from './Upload';
import { Download as DownloadPage } from './Download';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Transfers() {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Transfers</h1>
        <div className="flex space-x-2">
          <Button
            onClick={() => setActiveTab('upload')}
            variant={activeTab === 'upload' ? 'solid' : 'outline'}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button
            onClick={() => setActiveTab('download')}
            variant={activeTab === 'download' ? 'solid' : 'outline'}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-6">
          {activeTab === 'upload' ? <UploadPage /> : <DownloadPage />}
        </CardContent>
      </Card>
    </div>
  );
}