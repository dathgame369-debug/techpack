import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useUIStore } from '../../store/useUIStore';

export const AppShell: React.FC = () => {
  const isSidebarCollapsed = useUIStore(s => s.isSidebarCollapsed);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className={`app-main ${isSidebarCollapsed ? 'app-main--wide' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};
