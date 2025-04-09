export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const logout = () => {
  localStorage.clear();
  window.location.replace('/');
};

export const setAuthData = async (data) => {
  if (!data.token || !data.user) {
    throw new Error('Invalid authentication data');
  }
  
  try {
    localStorage.setItem('token', data.token);
    localStorage.setItem('userRole', data.user.role);
    localStorage.setItem('userName', data.user.name);
    localStorage.setItem('userId', data.user._id);
    
    return Promise.resolve(data);
  } catch (error) {
    localStorage.clear();
    throw new Error('Failed to set authentication data');
  }
};

export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

export const getUserName = () => {
  return localStorage.getItem('userName');
};

export const getUserId = () => {
  return localStorage.getItem('userId');
};

export const isManager = () => {
  return getUserRole() === 'manager';
};

export const hasRole = (role) => {
  return getUserRole() === role;
};