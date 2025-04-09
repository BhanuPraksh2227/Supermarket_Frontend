import React from 'react';
import { Link } from 'react-router-dom';
import './styles/sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/admin/dashboard">Dashboard</Link></li>
        <li><Link to="/admin/users">Users</Link></li>
        <li><Link to="/admin/products">Products</Link></li>
        <li><Link to="/admin/orders">Orders</Link></li>
        <li><Link to="/admin/feedback">Feedback</Link></li>
        <li><Link to="/admin/reports">Reports</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;