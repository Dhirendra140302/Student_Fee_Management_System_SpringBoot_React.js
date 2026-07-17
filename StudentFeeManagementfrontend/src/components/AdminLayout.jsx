import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useState } from 'react';

const navItems = [
  { to: '/admin',          label: 'Dashboard',   icon: '📊', end: true },
  { to: '/admin/students', label: 'Students',    icon: '👥' },
  { to: '/admin/courses',  label: 'Courses',     icon: '📚' },
  { to: '/admin/fees',     label: 'Fee Records', icon: '💰' },
];

export default function AdminLayout() {
  const { admin, adminLogout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await adminLogout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="layout-shell">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="layout-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? ' sidebar--open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-logo">🎓</span>
          <div>
            <div className="sidebar-title">Fee Manager</div>
            <div className="sidebar-role">Admin Portal</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">
              {admin?.name?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="admin-meta">
              <div className="admin-name">{admin?.name ?? 'Admin'}</div>
              <div className="admin-email">{admin?.email ?? ''}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="layout-main">
        {/* Topbar */}
        <header className="topbar">
          <button
            className="menu-btn"
            onClick={() => setSidebarOpen(o => !o)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div className="topbar-right">
            <span className="topbar-admin-badge">
              👤 {admin?.name ?? 'Admin'}
            </span>
          </div>
        </header>

        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
