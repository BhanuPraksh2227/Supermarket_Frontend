import React, { useState, useEffect, useCallback } from 'react';
import { getAllOrders, updateOrderStatus } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const verifyAuth = useCallback(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token || userRole !== 'manager') {
      navigate('/login');
      return false;
    }
    return true;
  }, [navigate]);

  const fetchOrders = useCallback(async () => {
    if (!verifyAuth()) return;

    try {
      setLoading(true);
      setError(null);

      const data = await getAllOrders();
      console.log('Fetched orders:', data);
      
      // Validate and sanitize the orders data
      const validOrders = (Array.isArray(data) ? data : []).map(order => ({
        ...order,
        products: (order.products || []).filter(item => 
          item && item.product && typeof item.product === 'object'
        ).map(item => ({
          ...item,
          product: {
            _id: item.product._id || 'unknown',
            name: item.product.name || 'Unknown Product',
            price: Number(item.product.price) || 0
          },
          quantity: Number(item.quantity) || 0
        }))
      }));

      setOrders(validOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message);
      
      if (error.message.includes('authentication') || error.message.includes('privileges')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, verifyAuth]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleDeliveryStatus = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'Delivered');
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date unavailable';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loader"></div>
      <p>Loading orders...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <div className="error">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
        <div className="error-actions">
          <button onClick={() => navigate('/login')}>
            Login Again
          </button>
          <button onClick={fetchOrders}>
            Retry
          </button>
        </div>
      </div>
    </div>
  );

  if (!orders || orders.length === 0) return <div className="no-orders">No orders found</div>;

  return (
    <div className="manager-orders">
      <h1>Order Management</h1>
      <div className="orders-container">
        {orders.map(order => (
          <div key={order._id || 'unknown'} className="order-card">
            <div className="order-header">
              <span>Order ID: {order._id || 'N/A'}</span>
              <span className={`status ${(order.status || 'pending').toLowerCase()}`}>
                Status: {order.status || 'Pending'}
              </span>
            </div>
            
            <div className="order-items">
              {order.products?.map(item => {
                // Skip invalid items
                if (!item?.product) return null;
                
                return (
                  <div key={item.product._id || 'unknown'} className="order-item">
                    <div className="item-details">
                      <span className="item-name">
                        {item.product.name || 'Product Name Unavailable'}
                      </span>
                      <span className="item-price">
                        ₹{(Number(item.product.price) || 0).toFixed(2)}
                      </span>
                    </div>
                    <span className="item-quantity">
                      Quantity: {Number(item.quantity) || 0}
                    </span>
                  </div>
                );
              })}
            </div>
            
            <div className="order-footer">
              <span className="total-amount">
                Total: ₹{(Number(order.totalAmount) || 0).toFixed(2)}
              </span>
              <span className="order-date">
                Ordered on: {formatDate(order.createdAt)}
              </span>
              {userRole === 'manager' && order.status === 'Pending' && (
                <button 
                  className="deliver-button"
                  onClick={() => handleDeliveryStatus(order._id)}
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;