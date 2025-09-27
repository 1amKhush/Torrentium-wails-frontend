import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ToastContainer } from './Toast';

export function Layout() {
  return (
    <div className="min-h-screen bg-background text-text">
      <Sidebar />
      <main className="p-4 md:p-8 pt-20 md:ml-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="bg-background/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl shadow-black/20 p-6 md:p-8 min-h-[calc(100vh-8rem)]">
            <Outlet />
          </div>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}