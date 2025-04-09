import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const CustomerHome = () => {
  const userName = localStorage.getItem('userName');

  return (
    <div className="customer-home">
      <div className="hero-section">
        <h1>Welcome, {userName}!</h1>
        <p>Discover our fresh products and great deals</p>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <i className="fas fa-shopping-cart"></i>
          <h3>Browse Products</h3>
          <p>Explore our wide range of products</p>
          <Link to="/products" className="feature-link">Shop Now</Link>
        </div>

        <div className="feature-card">
          <i className="fas fa-history"></i>
          <h3>Order History</h3>
          <p>View your past orders and track deliveries</p>
          <Link to="/orders" className="feature-link">View Orders</Link>
        </div>

        <div className="feature-card">
          <i className="fas fa-user"></i>
          <h3>Your Profile</h3>
          <p>Manage your account settings</p>
          <Link to="/profile" className="feature-link">Update Profile</Link>
        </div>

        <div className="feature-card">
          <i className="fas fa-star"></i>
          <h3>Feedback</h3>
          <p>Share your experience with us</p>
          <Link to="/feedback" className="feature-link">Give Feedback</Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;