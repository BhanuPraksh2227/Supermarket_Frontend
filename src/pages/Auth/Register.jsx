import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../utils/api';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const registrationData = {
        ...formData,
        role: formData.role
      };

      console.log('Registering with role:', registrationData.role);

      await register(registrationData);

      // Show success message
      alert(`Registration successful! Please login with your credentials.`);
      
      // Navigate to login page
      navigate('/login');

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

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

        <div className="form-group">
          <label>Role:</label>
          <select
            value={formData.role}
            onChange={(e) => {
              console.log('Selected role:', e.target.value);
              setFormData({...formData, role: e.target.value});
            }}
            required
          >
            <option value="customer">Customer</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="auth-button"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        
        <p className="auth-link">
          Already have an account? <span onClick={() => navigate('/login')}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default Register;