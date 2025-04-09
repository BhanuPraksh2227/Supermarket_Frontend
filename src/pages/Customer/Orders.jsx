import React, { useState, useEffect } from 'react';
import { getCustomerOrders } from '../../utils/api';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getCustomerOrders();
      // Validate and sanitize the data
      const validOrders = data?.map(order => ({
        ...order,
        products: order.products?.filter(item => item && item.product) || []
      })) || [];
      
      setOrders(validOrders);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again later.');
    } finally {
      setLoading(false);
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

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!orders || orders.length === 0) return <div className="no-orders">No orders found</div>;

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
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
                <div key={item._id || 'unknown'} className="order-item">
                  <div className="item-details">
                    <span className="item-name">
                      {item.product.name || 'Product Name Unavailable'}
                    </span>
                    <span className="item-price">
                      ₹{(item.product.price || 0).toFixed(2)}
                    </span>
                  </div>
                  <span className="item-quantity">
                    Quantity: {item.quantity || 0}
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="order-footer">
            <div className="order-info">
              <span className="total-amount">
                Total: ₹{(order.totalAmount || 0).toFixed(2)}
              </span>
              <span className="payment-method">
                Payment: {order.paymentMethod || 'Cash on Delivery'}
              </span>
            </div>
            <span className="order-date">
              Ordered on: {formatDate(order.createdAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;