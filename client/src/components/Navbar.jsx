import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          THE CATALOGUE
        </Link>
        <div className="navbar-links">
          <Link to="/create-medium" className="navbar-link">Create Medium</Link>
          <Link to="/create-item" className="navbar-link">Add Item</Link>
          <Link to="/wishlist" className="navbar-link navbar-wishlist">🎯 Wishlist</Link>
          <Link to="/about" className="navbar-link">About</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;