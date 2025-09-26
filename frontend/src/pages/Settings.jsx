import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="flex space-x-4 border-b">
        <Button variant={activeTab === 'account' ? 'solid' : 'ghost'} onClick={() => setActiveTab('account')}>Account</Button>
        <Button variant={activeTab === 'backend' ? 'solid' : 'ghost'} onClick={() => setActiveTab('backend')}>Backend</Button>
        <Button variant={activeTab === 'appearance' ? 'solid' : 'ghost'} onClick={() => setActiveTab('appearance')}>Appearance</Button>
      </div>

      <div>
        {activeTab === 'account' && (
          <Card>
            <CardHeader><CardTitle>Account Settings</CardTitle></CardHeader>
            <CardContent>
              {/* Account settings form fields */}
              <p>User account settings will go here.</p>
            </CardContent>
          </Card>
        )}
        {activeTab === 'backend' && (
          <Card>
            <CardHeader><CardTitle>Backend Settings</CardTitle></CardHeader>
            <CardContent>
               {/* Backend settings form fields */}
               <p>Backend and connection settings will go here.</p>
            </CardContent>
          </Card>
        )}
        {activeTab === 'appearance' && (
            <Card>
                <CardHeader><CardTitle>Appearance Settings</CardTitle></CardHeader>
                <CardContent>
                    {/* Appearance settings form fields */}
                    <p>Theme and appearance settings will go here.</p>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}