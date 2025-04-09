import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../utils/api';
import './Auth.css';

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(formData);
      
      // Store auth data
      localStorage.setItem('token', response.token);
      localStorage.setItem('userRole', response.user.role);
      localStorage.setItem('userName', response.user.name);
      
      // Call onLoginSuccess to update auth state
      onLoginSuccess();

      console.log('Login successful:', {
        role: response.user.role,
        redirectTo: response.user.role === 'manager' ? '/manager' : '/'
      });

      // Redirect based on role
      if (response.user.role === 'manager') {
        window.location.replace('/manager');
      } else {
        window.location.replace('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Debug auth state
  const debugAuth = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    
    console.log({
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : null,
      role: role,
      isManager: role === 'manager',
      headers: {
        Authorization: token ? `Bearer ${token}` : null
      }
    });
  };

  debugAuth();

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>

        <button 
          type="submit" 
          className="auth-button"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        <p className="auth-link">
          Don't have an account? <span onClick={() => navigate('/register')}>Register</span>
        </p>
      </form>
    </div>
  );
};

export default Login;