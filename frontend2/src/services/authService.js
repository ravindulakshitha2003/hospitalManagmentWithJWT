import api from './api';

const authService = {
  // Login user
  login: async (username, password) => {
    try {
      const response = await api.post('/api/v1/auth/login', {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Register user
  register: async (username, password, email, mobile) => {
    try {
      const response = await api.post('/api/v1/auth/register', {
        username,
        password,
        email,
        mobile,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    try {
      const response = await api.post('/api/v1/auth/refresh', {
        refresh_token: refreshToken,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    try {
      const response = await api.get('/api/v1/admin/allUser');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add role to user (admin only)
  addRoleToUser: async (username, role) => {
    try {
      const response = await api.post('/api/v1/admin/addRole', {
        username,
        role,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout (clear tokens)
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('selected_role');
    localStorage.removeItem('user_info');
  },
};

export default authService;
