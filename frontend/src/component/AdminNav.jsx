import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, UtensilsCrossed, ClipboardList, Users, LogOut, Coffee } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './AdminNav.css';

export default function AdminNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    closeMobile();
  };

  const navLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/menu', label: 'Menu', icon: UtensilsCrossed },
    { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
    { to: '/admin/users', label: 'Users', icon: Users },
  ];

  return (
    <>
      {/* Mobile top bar */}
      <header className="admin-nav-header">
        <button
          type="button"
          className="admin-nav-toggle"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <div className="admin-nav-brand">
          <Coffee size={22} className="admin-nav-brand-icon" />
          <span>Kube Café Admin</span>
        </div>
        <span className="admin-nav-header-spacer" />
      </header>

      {/* Overlay when drawer is open (mobile) */}
      <div
        className={`admin-nav-overlay ${mobileOpen ? 'admin-nav-overlay--open' : ''}`}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* Sidebar / Drawer */}
      <nav className={`admin-nav ${mobileOpen ? 'admin-nav--open' : ''}`}>
        <div className="admin-nav-inner">
          <div className="admin-nav-head">
            <div className="admin-nav-brand admin-nav-brand--sidebar">
              <Coffee size={24} className="admin-nav-brand-icon" />
              <span>Kube Café Admin</span>
            </div>
            <button
              type="button"
              className="admin-nav-close"
              onClick={closeMobile}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          <ul className="admin-nav-links">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `admin-link ${isActive ? 'admin-link--active' : ''}`
                  }
                  onClick={closeMobile}
                >
                  <Icon size={20} className="admin-link-icon" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="admin-nav-footer">
            <button
              type="button"
              className="admin-logout"
              onClick={handleLogout}
            >
              <LogOut size={20} className="admin-link-icon" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
