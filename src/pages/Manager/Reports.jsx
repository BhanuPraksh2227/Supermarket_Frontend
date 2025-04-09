import React, { useState, useEffect } from 'react';
import { getAllOrders, getAllFeedback } from '../../utils/api';
import './Reports.css';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orders = await getAllOrders();
        const salesData = {
          totalSales: orders.reduce((sum, order) => sum + order.totalAmount, 0),
          totalOrders: orders.length,
          recentOrders: orders.slice(0, 5)
        };

        const feedback = await getAllFeedback();

        setReportData(salesData);
        setFeedbackData(feedback);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load some data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderStars = (rating) => {
    const ratingNum = parseInt(rating) || 0;
    return '★'.repeat(ratingNum) + '☆'.repeat(5 - ratingNum);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="reports-page">
      <h1>Sales Reports & Analytics</h1>
      
      {/* Sales Summary Section */}
      <div className="report-summary">
        <div className="summary-card">
          <h3>Total Sales</h3>
          <p>${reportData?.totalSales?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="summary-card">
          <h3>Total Orders</h3>
          <p>{reportData?.totalOrders || 0}</p>
        </div>
        <div className="summary-card">
          <h3>Average Order Value</h3>
          <p>
            ${reportData?.totalOrders 
              ? (reportData.totalSales / reportData.totalOrders).toFixed(2) 
              : '0.00'}
          </p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="recent-orders-section">
        <h2>Recent Orders</h2>
        <div className="orders-list">
          {reportData?.recentOrders?.length > 0 ? (
            reportData.recentOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <h4>Order #{order._id.slice(-6)}</h4>
                  <span className={`order-status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <p className="order-amount">
                  ${order.totalAmount?.toFixed(2)}
                </p>
                <p className="order-date">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            ))
          ) : (
            <p className="no-orders">No recent orders available</p>
          )}
        </div>
      </div>

      {/* Feedback Section */}
      <div className="feedback-section">
        <h2>Customer Feedback</h2>
        <div className="feedback-list">
          {!feedbackData || feedbackData.length === 0 ? (
            <p className="no-feedback">No feedback available yet</p>
          ) : (
            feedbackData.map((feedback) => (
              <div key={feedback._id} className="feedback-card">
                <div className="feedback-header">
                  <h4>{feedback.product?.name || 'Product Unavailable'}</h4>
                  <div className="rating">{renderStars(feedback.rating)}</div>
                </div>
                <p className="feedback-message">
                  "{feedback.message || 'No message provided'}"
                </p>
                <div className="feedback-meta">
                  <span>By: {feedback.user?.name || 'Anonymous'}</span>
                  <span>
                    {feedback.createdAt ? 
                      new Date(feedback.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'
                    }
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;