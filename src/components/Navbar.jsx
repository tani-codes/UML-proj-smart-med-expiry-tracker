import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { User, Menu, X } from 'lucide-react';
import './Navbar.css';
import logo from '../assets/logo.png';
import logoNavbar from '../assets/logo_navbar.png';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isDashboard = !['/', '/login', '/register'].includes(location.pathname);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <img src={logoNavbar} alt="MeduExp Logo" className="nav-logo-img" />
        <span className="nav-brand-text">MeduExp</span>
      </div>

      <div className="mobile-menu-btn" onClick={toggleMenu}>
        {isMobileMenuOpen ? <X size={24} color="#1a4252" /> : <Menu size={24} color="#1a4252" />}
      </div>

      <div className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
        {isDashboard ? (
          <>
            <Link to="/shop" className={`nav-btn ${location.pathname === '/shop' ? 'active' : ''}`} onClick={closeMenu}>Shop</Link>
            <Link to="/scanner" className={`nav-btn ${location.pathname === '/scanner' ? 'active' : ''}`} onClick={closeMenu}>OCR Scan</Link>
            <Link to="/inventory" className={`nav-btn ${location.pathname === '/inventory' ? 'active' : ''}`} onClick={closeMenu}>Inventory</Link>
            <Link to="/alert" className={`nav-btn ${location.pathname === '/alert' ? 'active' : ''}`} onClick={closeMenu}>Alert</Link>
            <Link to="/" className="nav-btn" onClick={closeMenu}>Home</Link>
            <Link to="/settings" className={`nav-btn ${location.pathname === '/settings' ? 'active' : ''}`} onClick={closeMenu}>Settings</Link>
            <div className={`nav-profile ${location.pathname === '/profile' ? 'active-profile' : ''}`} onClick={() => { navigate('/profile'); closeMenu(); }}>
              <User size={20} />
            </div>
          </>
        ) : (
          <Link to="/" className="nav-btn nav-home-only" onClick={closeMenu}>Home</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
