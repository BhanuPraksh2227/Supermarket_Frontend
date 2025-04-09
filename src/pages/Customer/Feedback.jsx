import React, { useState, useEffect } from 'react';
import { getAllProducts, submitFeedback } from '../../utils/api';
import './Feedback.css';

const Feedback = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [feedback, setFeedback] = useState({
    productId: '',
    rating: 5,
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    'all',
    'Clothing',
    'Shoes',
    'Cooking Items',
    'Ingredients',
    'Electronics',
    'Home & Kitchen'
  ];

  // Add debug info
  useEffect(() => {
    console.log('Auth state:', {
      token: !!localStorage.getItem('token'),
      userRole: localStorage.getItem('userRole'),
      userName: localStorage.getItem('userName')
    });
  }, []);

  // Existing useEffect for fetching products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        console.log('Fetched products:', data); // Debug log
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Debug logs
      console.log('Form submission state:', {
        feedback,
        selectedProduct: products.find(p => p._id === feedback.productId),
        authToken: !!localStorage.getItem('token')
      });

      // Validation
      if (!feedback.productId) {
        throw new Error('Please select a product');
      }

      const rating = parseInt(feedback.rating, 10);
      if (!rating || rating < 1 || rating > 5) {
        throw new Error('Please select a rating between 1 and 5');
      }

      const message = feedback.message?.trim();
      if (!message) {
        throw new Error('Please enter your feedback message');
      }

      const feedbackData = {
        product: feedback.productId,
        rating: rating,
        message: message
      };

      // Debug log before submission
      console.log('Submitting feedback:', feedbackData);

      const response = await submitFeedback(feedbackData);
      console.log('Submission successful:', response);

      alert('Thank you for your feedback!');
      setFeedback({ productId: '', rating: 5, message: '' });
    } catch (error) {
      console.error('Submission error:', {
        error: error.message,
        feedback,
        validationState: {
          hasProduct: !!feedback.productId,
          rating: feedback.rating,
          messageLength: feedback.message?.length
        }
      });
      setError(error.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  // Add this debug function
  const testSubmission = async () => {
    try {
      // Get the first product from the products array
      const testProduct = products[0];
      if (!testProduct) {
        console.error('No products available for testing');
        return;
      }

      const testData = {
        product: testProduct._id,
        rating: 5,
        message: "Test feedback message"
      };

      console.log('Testing feedback submission with:', testData);
      const response = await submitFeedback(testData);
      console.log('Test submission successful:', response);
    } catch (error) {
      console.error('Test submission failed:', error);
    }
  };

  return (
    <div className="feedback-page">
      <h1>Product Feedback</h1>

      {/* Add this button right after the h1 for testing */}
      {process.env.NODE_ENV === 'development' && (
        <button 
          type="button" 
          onClick={testSubmission}
          style={{ marginBottom: '1rem' }}
        >
          Test Feedback Submission
        </button>
      )}

      <div className="category-filter">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label>Select Product:</label>
          <select
            value={feedback.productId}
            onChange={(e) => setFeedback({ ...feedback, productId: e.target.value })}
            required
          >
            <option value="">Choose a product...</option>
            {filteredProducts.map(product => (
              <option key={product._id} value={product._id}>
                {product.name} ({product.category})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Rating:</label>
          <div className="rating-input">
            {[5, 4, 3, 2, 1].map((star) => (
              <label key={star}>
                <input
                  type="radio"
                  name="rating"
                  value={star}
                  checked={feedback.rating === star}
                  onChange={(e) => setFeedback({ ...feedback, rating: Number(e.target.value) })}
                />
                <span>★</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Your Feedback:</label>
          <textarea
            value={feedback.message}
            onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
            placeholder="Share your thoughts about this product..."
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default Feedback;