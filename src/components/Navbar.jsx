import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { User } from 'lucide-react';
import './Navbar.css';
import logo from '../assets/logo.png';
import logoNavbar from '../assets/logo_navbar.png';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isDashboard = !['/', '/login', '/register'].includes(location.pathname);

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <img src={logoNavbar} alt="MeduExp Logo" className="nav-logo-img" />
      </div>

      <div className="navbar-links">
        {isDashboard ? (
          <>
            <Link to="/shop" className={`nav-btn ${location.pathname === '/shop' ? 'active' : ''}`}>Shop</Link>
            <Link to="/scanner" className={`nav-btn ${location.pathname === '/scanner' ? 'active' : ''}`}>OCR Scan</Link>
            <Link to="/inventory" className={`nav-btn ${location.pathname === '/inventory' ? 'active' : ''}`}>Inventory</Link>
            <Link to="/alert" className={`nav-btn ${location.pathname === '/alert' ? 'active' : ''}`}>Alert</Link>
            <Link to="/" className="nav-btn">Home</Link>
            <Link to="/settings" className={`nav-btn ${location.pathname === '/settings' ? 'active' : ''}`}>Settings</Link>
            <div className={`nav-profile ${location.pathname === '/profile' ? 'active-profile' : ''}`} onClick={() => navigate('/profile')}>
              <User size={20} />
            </div>
          </>
        ) : (
          <Link to="/" className="nav-btn nav-home-only">Home</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
