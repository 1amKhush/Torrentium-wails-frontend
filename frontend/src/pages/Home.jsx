import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

export function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome to Torrentium!</h1>
        <p className="text-text-secondary mt-2">
          A decentralized file sharing application.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload a File</CardTitle>
            <CardDescription>
              Share a file with the network.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/upload">Upload</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Download a File</CardTitle>
            <CardDescription>
              Download a file from the network using its CID.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/download">Download</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}