import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const isAuthenticated = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role && role !== userRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;