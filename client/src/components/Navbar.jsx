import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">📚</span>
          <span className="logo-text">THE CATALOGUE</span>
        </Link>
        
        {/* Mobile menu toggle */}
        <button 
          className={`mobile-menu-toggle ${menuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Desktop navigation */}
        <div className="navbar-links-desktop">
          <Link to="/create-medium" className="navbar-link">Create Medium</Link>
          <Link to="/create-item" className="navbar-link">Add Item</Link>
          <Link to="/wishlist" className="navbar-link navbar-wishlist">🎯 Wishlist</Link>
          <Link to="/inprogress" className="navbar-link navbar-inprogress">⏳ In Progress</Link>
          <Link to="/consumed" className="navbar-link navbar-consumed">✨ Consumed</Link>
          <Link to="/about" className="navbar-link">About</Link>
        </div>

        {/* Mobile navigation */}
        <div className={`navbar-links-mobile ${menuOpen ? 'active' : ''}`}>
          <Link to="/create-medium" className="navbar-link" onClick={closeMenu}>Create Medium</Link>
          <Link to="/create-item" className="navbar-link" onClick={closeMenu}>Add Item</Link>
          <Link to="/wishlist" className="navbar-link navbar-wishlist" onClick={closeMenu}>🎯 Wishlist</Link>
          <Link to="/inprogress" className="navbar-link navbar-inprogress" onClick={closeMenu}>⏳ In Progress</Link>
          <Link to="/consumed" className="navbar-link navbar-consumed" onClick={closeMenu}>✨ Consumed</Link>
          <Link to="/about" className="navbar-link" onClick={closeMenu}>About</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;