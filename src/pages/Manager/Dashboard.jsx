import React, { useState, useEffect } from 'react';
import { getAllOrders, getAllProducts } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Unauthorized: No token found');
        }

        const [orders, products] = await Promise.all([
          getAllOrders(),
          getAllProducts()
        ]);
        
        const revenue = orders.reduce((total, order) => total + order.totalAmount, 0);
        
        setStats({
          totalOrders: orders.length,
          totalProducts: products.length,
          totalRevenue: revenue
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        alert(error.message);
        navigate('/login');  // Redirect to login page if unauthorized
      }
    };

    fetchStats();
  }, [navigate]);

  return (
    <div className="dashboard">
      <h1>Manager Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Total Products</h3>
          <p>{stats.totalProducts}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>${stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
