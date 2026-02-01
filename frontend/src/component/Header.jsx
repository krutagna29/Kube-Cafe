import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Coffee, Menu, ShoppingCart, User, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Cart from './Cart';
import './Header.css';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
   // Anchor scroll
];

export default function Header() {
  const { user, logoutUser } = useContext(AuthContext);
  const { getCartItemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const closeOffcanvas = () => {
    document.querySelector('#mobileNav .btn-close')?.click();
  };

  return (
    <header className="main-header sticky-top shadow-sm">
      <div className="container-fluid d-flex justify-content-between align-items-center px-3 py-2">
        
        {/* Logo */}
        <Link to="/" className="brand-logo ">
          K<Coffee size={20} />BE Cafe
        </Link>

        {/* Desktop Navigation */}
        <nav className="d-none d-md-flex align-items-center gap-3">
          {navLinks.map(link =>
            link.to.startsWith('/') ? (
              <Link
                key={link.to}
                to={link.to}
                className={`header-btn ${isActive(link.to)}`}
              >
                {link.label}
              </Link>
            ) : (
              <a key={link.to} href={link.to} className="header-btn">
                {link.label}
              </a>
            )
          )}

          {/* Cart */}
          <button
            type="button"
            className="header-btn position-relative"
            onClick={() => setIsCartOpen(true)}
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            {getCartItemCount() > 0 && (
              <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                {getCartItemCount()}
              </span>
            )}
          </button>

          {/* Auth */}
          {user ? (
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                <User size={16} className="me-1" />
                {user.name}
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button className="dropdown-item" onClick={logoutUser}>
                    <LogOut size={16} className="me-2" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/login" className="header-btn">Login</Link>
              <Link to="/register" className="header-btn">Register</Link>
            </div>
          )}
        </nav>

        {/* Mobile Controls */}
        <div className="d-md-none d-flex align-items-center gap-2">
          <button
            className="header-btn position-relative"
            onClick={() => setIsCartOpen(true)}
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            {getCartItemCount() > 0 && (
              <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                {getCartItemCount()}
              </span>
            )}
          </button>

          <button
            className="btn btn-outline-secondary"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileNav"
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Offcanvas (Mobile Nav) */}
      <div className="offcanvas offcanvas-end" id="mobileNav">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title brand-logo">
            K<Coffee size={20} />BE Cafe
          </h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" />
        </div>
        <div className="offcanvas-body">
          <nav className="nav flex-column">
            {navLinks.map(link =>
              link.to.startsWith('/') ? (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link ${isActive(link.to)}`}
                  data-bs-dismiss="offcanvas"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.to}
                  href={link.to}
                  className="nav-link"
                  data-bs-dismiss="offcanvas"
                >
                  {link.label}
                </a>
              )
            )}

            <hr className="my-3" />

            {user ? (
              <>
                <div className="nav-link"><User size={16} className="me-1" /> {user.name}</div>
                <button
                  className="nav-link border-0 bg-transparent text-start"
                  onClick={() => {
                    logoutUser();
                    closeOffcanvas();
                  }}
                >
                  <LogOut size={16} className="me-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" data-bs-dismiss="offcanvas">Login</Link>
                <Link to="/register" className="nav-link" data-bs-dismiss="offcanvas">Register</Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Cart */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
