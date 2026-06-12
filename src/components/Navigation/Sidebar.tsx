import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Settings, LogOut, ChevronLeft, ChevronRight, Shirt, Star
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/templates', label: 'Templates', icon: Star },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={`sidebar ${isSidebarCollapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">
          <Shirt size={22} />
        </div>
        {!isSidebarCollapsed && (
          <div>
            <div className="sidebar__logo-name gradient-text">TechPac</div>
            <div className="text-xs text-muted">Pro Designer</div>
          </div>
        )}
      </div>

      <div className="divider" />

      {/* Nav */}
      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`}
            data-tooltip={isSidebarCollapsed ? label : undefined}
          >
            <Icon size={18} />
            {!isSidebarCollapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      {/* User */}
      {user && (
        <div className="sidebar__user">
          <div className="sidebar__avatar">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          {!isSidebarCollapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="text-sm" style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.firstName} {user.lastName}
              </div>
              <div className="text-xs text-muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
            </div>
          )}
          <button
            className="btn btn-ghost btn-icon"
            onClick={handleLogout}
            data-tooltip={isSidebarCollapsed ? 'Logout' : undefined}
          >
            <LogOut size={16} />
          </button>
        </div>
      )}

      {/* Collapse toggle */}
      <button className="sidebar__collapse-btn" onClick={toggleSidebar}>
        {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
};
