import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Supermarket</Link>
      </div>
      <div className="navbar-links">
        {isLoggedIn && userRole === 'customer' && (
          <>
            <Link to="/products">Products</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}
        {isLoggedIn && userRole === 'manager' && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/manage-products">Products</Link>
            <Link to="/manage-orders">Orders</Link>
          </>
        )}
        {isLoggedIn ? (
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        ) : (
          <Link to="/login" className="nav-link">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;