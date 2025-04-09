import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ onLogout }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName');

  // Debug log
  console.log('Navigation rendering with role:', role);

  const handleLogout = () => {
    try {
      onLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="nav-brand">
          <Link to={role === 'manager' ? '/manager' : '/'}>Supermarket</Link>
        </div>
        <Link to={role === 'manager' ? '/manager/profile' : '/profile'} className="profile-link">
          <i className="fas fa-user"></i> Profile
        </Link>
      </div>
      <div className="nav-links">
        {role === 'customer' && (
          <>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/feedback">Feedback</Link>
          </>
        )}
        {role === 'manager' && (
          <>
            <Link to="/manager">Dashboard</Link>
            <Link to="/manager/products">Products</Link>
            <Link to="/manager/orders">Orders</Link>
            <Link to="/manager/reports">Reports</Link>
          </>
        )}
        <div className="user-info">
          <span>Welcome, {userName || 'Guest'} ({role})</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;