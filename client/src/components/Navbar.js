import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/products', label: 'Products', icon: '📦' },
    { path: '/sales', label: 'Sales', icon: '💰' },
    { path: '/purchases', label: 'Purchases', icon: '🛒' },
    { path: '/repairs', label: 'Repairs', icon: '🔧' },
    { path: '/savings', label: 'Savings', icon: '💎' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const mobileNavItems = [
    { path: '/dashboard', icon: '🏠', label: 'Home' },
    { path: '/sales', icon: '💰', label: 'Sales' },
    { path: '/products', icon: '📦', label: 'Products' },
    { path: '/repairs', icon: '🔧', label: 'Repairs' },
    { path: '/settings', icon: '👤', label: 'Profile' },
  ];

  return (
    <>
      <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '☰'}
      </button>
      <div className="mobile-user-btn">
        <Link to="/settings">
          {user?.username?.charAt(0).toUpperCase()}
        </Link>
      </div>
      <div className={`overlay ${isOpen ? 'show' : ''}`} onClick={() => setIsOpen(false)} />
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <Link to="/" className="sidebar-brand">
          <span>⚡</span>
          <span className="brand-text">RepairPOS</span>
        </Link>
        <nav>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
              onClick={() => setIsOpen(false)}
            >
              <span>{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-user-info">
            <div className="sidebar-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="sidebar-user-name">{user?.username}</div>
              <div className="sidebar-user-role">{user?.role || 'Staff'}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-logout">
            Sign Out
          </button>
        </div>
      </div>

      <div className="bottom-nav">
        {mobileNavItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Navbar;