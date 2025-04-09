import React, { useState, useEffect } from 'react';
import { getFeedbackByProduct } from '../../utils/api';
import './ProductFeedback.css';

const ProductFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const data = await getFeedbackByProduct();
        setFeedbacks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  if (loading) return <div className="loading">Loading feedback...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-feedback-page">
      <h1>Product Feedback Overview</h1>
      {feedbacks.map(item => (
        <div key={item.product._id} className="product-feedback-card">
          <h2>{item.product.name}</h2>
          <div className="average-rating">
            Average Rating: {item.averageRating.toFixed(1)} ★
          </div>
          <div className="feedback-list">
            {item.feedback.map(feedback => (
              <div key={feedback._id} className="feedback-item">
                <div className="rating">{'★'.repeat(feedback.rating)}</div>
                <div className="message">{feedback.message}</div>
                <div className="feedback-meta">
                  By {feedback.user.name} on {new Date(feedback.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductFeedback;