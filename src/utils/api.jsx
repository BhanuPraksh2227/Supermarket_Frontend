import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Debug log to see the actual token being sent
      console.log('Auth Header:', config.headers.Authorization);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear auth data
      localStorage.clear();
      
      // Redirect to login with error message
      window.location.href = `/login?error=${error.response.status === 403 ? 'forbidden' : 'unauthorized'}`;
      return Promise.reject(new Error('Authentication failed. Please login again.'));
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Auth endpoints
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    
    if (!response.data.token || !response.data.user || !response.data.user.role) {
      throw new Error('Invalid response from server');
    }

    console.log('Login successful:', {
      role: response.data.user.role,
      hasToken: !!response.data.token
    });
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const register = async (userData) => {
  try {
    console.log('Sending registration request:', {
      ...userData,
      password: '[HIDDEN]'
    });

    const response = await api.post('/auth/register', userData);

    console.log('Registration successful:', {
      role: response.data.user.role
    });

    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

// Product endpoints
export const getAllProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
};

export const addProduct = async (formData) => {
  try {
    // Log FormData contents for debugging
    for (let pair of formData.entries()) {
      console.log('FormData content:', pair[0], pair[1]);
    }

    const token = localStorage.getItem('token');
    const response = await api.post('/products', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        // Important: Don't set Content-Type when sending FormData
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Add product error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Error adding product');
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error deleting product');
  }
};

// Order endpoints
export const placeOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to place order');
  }
};

export const getCustomerOrders = async () => {
  try {
    const response = await api.get('/orders/customer');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch orders');
  }
};

export const getAllOrders = async () => {
  try {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
      throw new Error('No authentication token found');
    }

    if (userRole !== 'manager') {
      throw new Error('Manager privileges required');
    }

    const response = await api.get('/orders', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('getAllOrders error:', error);
    throw new Error(error.message || 'Failed to fetch orders');
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update order status');
  }
};

// Profile endpoints
export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching profile');
  }
};

export const getManagerProfile = async () => {
  try {
    const response = await api.get('/manager/profile');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error updating profile');
  }
};

// Dashboard endpoints
export const getDashboardStats = async () => {
    try {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');

        if (!token) {
            throw new Error('Authentication required');
        }

        if (userRole !== 'manager') {
            throw new Error('Manager privileges required');
        }

        const response = await api.get('/manager/dashboard', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('Dashboard stats response:', response.data); // Debug log
        return response.data;
    } catch (error) {
        console.error('Dashboard stats error:', error.response || error);
        throw new Error(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
};

// Feedback endpoints
export const submitFeedback = async (feedbackData) => {
  try {
    // Ensure the data is properly formatted
    const formattedData = {
      product: feedbackData.product,
      rating: parseInt(feedbackData.rating, 10),
      message: feedbackData.message?.trim()
    };

    // Debug log before making the request
    console.log('Submitting feedback with formatted data:', {
      formattedData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    const response = await api.post('/feedback', formattedData);
    console.log('Feedback submission response:', response.data);
    return response.data;
  } catch (error) {
    // Enhanced error logging
    console.error('Detailed feedback submission error:', {
      responseData: error.response?.data,
      responseStatus: error.response?.status,
      originalError: error,
      sentData: feedbackData,
      validationErrors: error.response?.data?.errors || error.response?.data?.message
    });

    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message || 
      'Failed to submit feedback'
    );
  }
};

// Add this with your other API functions
export const getAllFeedback = async () => {
  try {
    const response = await api.get('/feedback');
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback:', {
      error: error.message,
      response: error.response?.data
    });
    throw new Error(error.response?.data?.message || 'Failed to fetch feedback');
  }
};

// Add this with your other API functions
export const getSalesReport = async () => {
  try {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
      throw new Error('Authentication required');
    }

    if (userRole !== 'manager') {
      throw new Error('Manager privileges required');
    }

    // First get all orders to calculate sales data
    const orders = await getAllOrders();
    
    // Calculate total sales and other metrics
    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;

    return {
      totalSales,
      totalOrders,
      recentOrders: orders.slice(0, 5) // Get 5 most recent orders
    };
  } catch (error) {
    console.error('Sales report error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch sales report');
  }
};

// Copy and paste this in browser console
const debugAuth = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');
  const name = localStorage.getItem('userName');
  
  console.log({
    isLoggedIn: !!token,
    token: token ? `${token.substr(0, 10)}...` : null,
    role,
    name
  });
};

debugAuth();

// Copy and paste in browser console
const checkManagerAuth = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');
  const name = localStorage.getItem('userName');
  
  console.log({
    isLoggedIn: !!token,
    token: token ? `${token.substr(0, 10)}...` : null,
    role,
    name,
    isManager: role === 'manager'
  });
};

checkManagerAuth();

// Add these functions to your api.jsx
export const deleteFeedback = async (feedbackId) => {
    try {
        // Debug log
        console.log('Attempting to delete feedback:', feedbackId);

        const response = await api.delete(`/feedback/${feedbackId}`);
        
        // Debug log
        console.log('Delete feedback response:', response.data);
        
        return response.data;
    } catch (error) {
        // Enhanced error logging
        console.error('Delete feedback error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });
        
        throw new Error(
            error.response?.data?.message || 
            error.message || 
            'Failed to delete feedback'
        );
    }
};

export const deleteOrder = async (orderId) => {
  try {
    const response = await api.delete(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Delete order error:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete order');
  }
};