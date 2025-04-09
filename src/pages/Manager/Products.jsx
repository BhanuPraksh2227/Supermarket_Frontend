import React, { useState, useEffect, useCallback } from 'react';
import { getAllProducts, addProduct, deleteProduct } from '../../utils/api';
import './Products.css';
import '../../styles/card.css';
import { getCorrectImageUrl } from '../../utils/imageUtils';

const ProductCard = ({ product, onDelete }) => {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(product.imageUrl);

  useEffect(() => {
    // Update image URL if it's using the wrong port
    if (product.imageUrl && product.imageUrl.includes('localhost:3000')) {
      const newUrl = product.imageUrl.replace('localhost:3000', 'localhost:5000');
      setImageUrl(newUrl);
    }
  }, [product.imageUrl]);

  return (
    <div className="product-card">
      <div className="product-image">
        {imageUrl && !imageError ? (
          <img 
            src={imageUrl}
            alt={product.name}
            onError={(e) => {
              console.error('Image load error:', e.target.src);
              setImageError(true);
              e.target.src = '/placeholder-image.jpg';
            }}
            onLoad={() => console.log('Image loaded successfully:', imageUrl)}
          />
        ) : (
          <div className="product-image-placeholder">
            <i className="fas fa-image"></i>
          </div>
        )}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="category-tag">{product.category}</p>
        <p className="price">₹{product.price.toFixed(2)}</p>
        <p className="stock">Stock: {product.stock}</p>
        <button 
          onClick={() => onDelete(product._id)}
          className="delete-btn"
        >
          Delete Product
        </button>
      </div>
    </div>
  );
};

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    image: null
  });

  const categories = [
    'Clothing',
    'Shoes',
    'Cooking Items',
    'Ingredients',
    'Electronics',
    'Home & Kitchen'
  ];

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      const correctedData = data.map(product => ({
        ...product,
        imageUrl: product.imageUrl ? getCorrectImageUrl(product.imageUrl) : null
      }));
      setProducts(correctedData);
      setError(null);
    } catch (error) {
      setError('Failed to load products');
      console.error('Fetch products error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', String(newProduct.name).trim());
      formData.append('price', String(Number(newProduct.price)));
      formData.append('stock', String(Number(newProduct.stock)));
      formData.append('category', String(newProduct.category));
      
      if (newProduct.image) {
        formData.append('image', newProduct.image);
      }

      const addedProduct = await addProduct(formData);
      
      // Ensure the image URL is using the correct port
      if (addedProduct.imageUrl) {
        addedProduct.imageUrl = getCorrectImageUrl(addedProduct.imageUrl);
      }

      setProducts(prevProducts => [...prevProducts, addedProduct]);
      
      // Reset form
      setNewProduct({
        name: '',
        price: '',
        stock: '',
        category: '',
        image: null
      });
      setPreview(null);
      
      // Show success message
      const successMessage = document.getElementById('success-message');
      if (successMessage) {
        successMessage.style.opacity = '1';
        setTimeout(() => {
          successMessage.style.opacity = '0';
        }, 3000);
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError(error.message || 'Error adding product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        await fetchProducts();
      } catch (error) {
        setError('Failed to delete product');
        console.error('Delete error:', error);
      }
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Only JPEG, PNG and WebP images are allowed');
        return;
      }

      try {
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        
        // Update form state with just the file
        setNewProduct(prev => ({
          ...prev,
          image: file
        }));
        
        // Clear any existing error
        setError(null);
      } catch (error) {
        console.error('Error handling image:', error);
        setError('Error processing image');
      }
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="manager-products">
      <h1>Product Management</h1>
      
      <div id="success-message" className="success-message">
        Product added successfully!
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <h2>Add New Product</h2>
        
        <div className="form-group">
          <label>Category:</label>
          <select
            value={newProduct.category}
            onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
            required
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Product Name:</label>
          <input
            type="text"
            value={newProduct.name}
            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label>Stock:</label>
          <input
            type="number"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Preview" />
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>

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
          <ProductCard 
            key={product._id} 
            product={product} 
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageProducts;