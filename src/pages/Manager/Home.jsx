import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../../utils/api';
import './Home.css';

const ManagerHome = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
    totalCustomers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');

      if (!token || userRole !== 'manager') {
        navigate('/login');
        return;
      }

      const data = await getDashboardStats();
      console.log('Fetched stats:', data);
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error.message);
      
      if (error.message.includes('authentication') || 
        error.message.includes('privileges')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) return (
    <div className="loading-container">
      <div className="loader"></div>
      <p>Loading dashboard...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <i className="fas fa-exclamation-circle"></i>
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  return (
    <div className="manager-home">
      <div className="welcome-section">
        <h1>Welcome, <span className="user-name">{userName}</span>!</h1>
        <p className="subtitle">Manage your supermarket operations efficiently</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card products">
          <div className="stat-icon">
            <i className="fas fa-box"></i>
          </div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p className="stat-value">{stats.totalProducts}</p>
          </div>
        </div>
        <div className="stat-card orders">
          <div className="stat-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.totalOrders}</p>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>Pending Orders</h3>
            <p className="stat-value">{stats.pendingOrders}</p>
          </div>
        </div>
        <div className="stat-card revenue">
          <div className="stat-icon">
            <i className="fas fa-rupee-sign"></i>
          </div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">₹{stats.revenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="actions-grid">
        <Link to="/manager/products" className="action-card">
          <div className="action-icon">
            <i className="fas fa-box"></i>
          </div>
          <div className="action-content">
            <h2>Manage Products</h2>
            <p>Add, edit, or remove products from inventory</p>
          </div>
          <div className="action-arrow">
            <i className="fas fa-arrow-right"></i>
          </div>
        </Link>

        <Link to="/manager/orders" className="action-card">
          <div className="action-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="action-content">
            <h2>Manage Orders</h2>
            <p>View and process customer orders</p>
          </div>
          <div className="action-arrow">
            <i className="fas fa-arrow-right"></i>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ManagerHome;