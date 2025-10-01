const API_BASE_URL = 'http://localhost:8080';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    const config = {
      method,
      headers: this.getHeaders()
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(this.baseUrl + endpoint, config);
      const responseText = await response.text();
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/signin';
          throw new Error('Authentication failed. Please login again.');
        }
        
        // Try to parse error response to get meaningful error message
        let errorMessage = responseText;
        try {
          const errorObj = JSON.parse(responseText);
          if (errorObj.message) {
            errorMessage = errorObj.message;
          } else if (typeof errorObj === 'string') {
            errorMessage = errorObj;
          }
        } catch (e) {
          errorMessage = responseText || `HTTP ${response.status} error`;
        }
        
        throw new Error(errorMessage);
      }

      if (!responseText) {
        return {};
      }

      return JSON.parse(responseText);
    } catch (error) {
      if (error.name === 'SyntaxError') {
        throw new Error('Invalid response from server');
      }
      throw error;
    }
  }

  // Authentication endpoints
  async login(credentials) {
    return this.makeRequest('/api/auth/login', 'POST', credentials);
  }

  async register(userData) {
    return this.makeRequest('/api/auth/register', 'POST', userData);
  }

  async logout() {
    return this.makeRequest('/api/auth/logout', 'POST');
  }

  // User profile endpoints
  async getUserProfile() {
    return this.makeRequest('/api/user/profile', 'GET');
  }

  async updateUserProfile(profileData) {
    return this.makeRequest('/api/user/profile', 'PUT', profileData);
  }

  async getUserProfileById(userId) {
    return this.makeRequest(`/api/user/profile/${userId}`, 'GET');
  }

  async updateUserProfileById(userId, profileData) {
    return this.makeRequest(`/api/user/profile/${userId}`, 'PUT', profileData);
  }

  // Admin endpoints
  async getAllUsers() {
    return this.makeRequest('/api/admin/users', 'GET');
  }

  async getAdminDashboardStats() {
    return this.makeRequest('/api/admin/dashboard/stats', 'GET');
  }

  async getUserByIdAdmin(userId) {
    return this.makeRequest(`/api/admin/users/${userId}`, 'GET');
  }

  // Health check
  async healthCheck() {
    return this.makeRequest('/health', 'GET');
  }
}

export const apiService = new ApiService();