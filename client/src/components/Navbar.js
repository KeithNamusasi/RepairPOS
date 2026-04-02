import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/products', label: 'Products' },
    { path: '/sales', label: 'Sales' },
    { path: '/purchases', label: 'Purchases' },
    { path: '/repairs', label: 'Repairs' },
    { path: '/savings', label: 'Savings' },
    { path: '/reports', label: 'Reports' },
  ];

  return (
    <div className="sidebar">
      <Link to="/" className="sidebar-brand">RepairPOS</Link>
      <nav>
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={location.pathname === item.path ? 'active' : ''}
          >
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-user">
        <div>{user?.username}</div>
        <button onClick={handleLogout} className="btn btn-small sidebar-logout">
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Navbar;