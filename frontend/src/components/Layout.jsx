import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ToastContainer } from './Toast';

export function Layout() {
  return (
    <div className="min-h-screen bg-background text-text">
      <Sidebar />
      <main className="p-6 pt-16 md:ml-16 transition-all duration-300">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
}