import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import CustomerHome from './pages/Customer/Home';
import Products from './pages/Customer/Products';
import Orders from './pages/Customer/Orders';
import CustomerProfile from './pages/Customer/Profile';
import Feedback from './pages/Customer/Feedback';
import ManagerHome from './pages/Manager/Home';
import ManageProducts from './pages/Manager/Products';
import ManageOrders from './pages/Manager/Orders';
import ManagerProfile from './pages/Manager/Profile';
import Reports from './pages/Manager/Reports';
import './styles/global.css';

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  console.log('Route protection check:', { token, userRole, requiredRole: role });

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // For manager routes
  if (role === 'manager') {
    if (userRole !== 'manager') {
      console.log('Non-manager attempting to access manager route');
      return <Navigate to="/" replace />;
    }
  }

  // For customer routes
  if (role === 'customer') {
    if (userRole !== 'customer') {
      console.log('Non-customer attempting to access customer route');
      return <Navigate to="/manager" replace />;
    }
  }

  return children;
};

function App() {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('userRole')
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setAuthState({
        token: localStorage.getItem('token'),
        role: localStorage.getItem('userRole')
      });
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    console.log('Auth state updated:', authState);
  }, [authState]);

  const handleLogout = () => {
    localStorage.clear();
    setAuthState({ token: null, role: null });
  };

  return (
    <>
      {authState.token && <Navigation onLogout={handleLogout} />}
      <div className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              !authState.token ? (
                <Login onLoginSuccess={() => {
                  const newAuthState = {
                    token: localStorage.getItem('token'),
                    role: localStorage.getItem('userRole')
                  };
                  console.log('Login success:', newAuthState);
                  setAuthState(newAuthState);
                }} />
              ) : (
                <Navigate to={authState.role === 'manager' ? '/manager' : '/'} />
              )
            } 
          />
          
          <Route 
            path="/register" 
            element={
              !authState.token ? (
                <Register />
              ) : (
                <Navigate to={authState.role === 'manager' ? '/manager' : '/'} />
              )
            } 
          />

          {/* Root route with role-based redirect */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute role="customer">
                <CustomerHome />
              </ProtectedRoute>
            } 
          />

          {/* Customer Routes */}
          <Route path="/products" element={
            <ProtectedRoute role="customer">
              <Products />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute role="customer">
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute role="customer">
              <CustomerProfile />
            </ProtectedRoute>
          } />
          <Route path="/feedback" element={
            <ProtectedRoute role="customer">
              <Feedback />
            </ProtectedRoute>
          } />

          {/* Manager Routes */}
          <Route path="/manager" element={
            <ProtectedRoute role="manager">
              <ManagerHome />
            </ProtectedRoute>
          } />
          <Route path="/manager/products" element={
            <ProtectedRoute role="manager">
              <ManageProducts />
            </ProtectedRoute>
          } />
          <Route path="/manager/orders" element={
            <ProtectedRoute role="manager">
              <ManageOrders />
            </ProtectedRoute>
          } />
          <Route path="/manager/profile" element={
            <ProtectedRoute role="manager">
              <ManagerProfile />
            </ProtectedRoute>
          } />
          <Route path="/manager/reports" element={
            <ProtectedRoute role="manager">
              <Reports />
            </ProtectedRoute>
          } />

          {/* Catch-all route */}
          <Route path="*" element={
            <Navigate to={
              !authState.token 
                ? '/login' 
                : authState.role === 'manager'
                  ? '/manager'
                  : '/'
            } />
          } />
        </Routes>
      </div>
    </>
  );
}

export default App;
