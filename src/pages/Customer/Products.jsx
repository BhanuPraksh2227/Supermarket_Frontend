import React, { useState, useEffect, useCallback } from 'react';
import { getAllProducts, placeOrder } from '../../utils/api';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderStatus, setOrderStatus] = useState('');

  const categories = [
    'Clothing',
    'Shoes',
    'Cooking Items',
    'Ingredients',
    'Electronics',
    'Home & Kitchen'
  ];

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:5000${imageUrl}`;
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      
      const processedData = data.map(product => ({
        ...product,
        imageUrl: getImageUrl(product.imageUrl)
      }));

      setProducts(processedData);
      setError(null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOrder = async (product) => {
    try {
      setLoading(true);
      const orderData = {
        products: [{
          product: product._id,
          quantity: 1
        }],
        totalAmount: product.price,
        paymentMethod: 'Cash on Delivery'
      };

      await placeOrder(orderData);
      setOrderStatus('Order placed successfully! (Cash on Delivery)');
      setTimeout(() => setOrderStatus(''), 3000);
    } catch (error) {
      setError('Failed to place order: ' + error.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products
    .filter(product => 
      selectedCategory === 'all' || product.category === selectedCategory)
    .filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="products-page">
      {orderStatus && <div className="success-message">{orderStatus}</div>}
      {error && <div className="error-message">{error}</div>}
      <div className="products-header">
        <h1>Our Products</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="category-filter">
        <button
          className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All Products
        </button>
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product._id} className="product-card">
            <div className="product-image">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  onError={(e) => {
                    console.error('Image load error:', {
                      product: product.name,
                      url: e.target.src
                    });
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                  }}
                />
              ) : (
                <div className="product-image-placeholder">
                  <i className="fas fa-image"></i>
                  <p>No image available</p>
                </div>
              )}
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="category">{product.category}</p>
              <p className="price">₹{product.price.toFixed(2)}</p>
              <p className="stock">In Stock: {product.stock}</p>
              <p className="payment-note">Cash on Delivery Available</p>
              <button 
                className="order-button"
                onClick={() => handleOrder(product)}
                disabled={product.stock <= 0 || loading}
              >
                {product.stock > 0 ? 'Order Now (COD)' : 'Out of Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;