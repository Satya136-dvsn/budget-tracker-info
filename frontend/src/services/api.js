const API_BASE_URL = 'http://localhost:8080';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  // Only include Content-Type for requests that send a body to avoid
  // unnecessary CORS preflight on simple GETs which can cause 403s if
  // the backend CORS isn't configured for the header.
  getHeaders(method = 'GET') {
    const headers = {};

    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      headers['Content-Type'] = 'application/json';
    }

    const token = this.getToken();
    console.log('API: Getting headers, token exists?', !!token);
    console.log('API: Token (first 20 chars):', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('API: Added Authorization header');
    } else {
      console.warn('API: NO TOKEN - Request will be unauthenticated!');
    }

    console.log('API: Final headers:', headers);
    return headers;
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    const config = {
      method,
      headers: this.getHeaders(method)
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
        } catch {
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

  // Transactions / Reports endpoints
  async getFinancialSummary() {
    return this.makeRequest('/api/transactions/summary', 'GET');
  }

  // Get monthly breakdown - returns array of monthly summaries
  async getMonthlyFinancialSummary(period = '6months') {
    // For now, return the overall summary as we need to implement proper monthly aggregation
    // TODO: Implement backend endpoint that aggregates by month for the given period
    return this.makeRequest('/api/transactions/summary', 'GET');
  }

  async getExpenseBreakdown() {
    return this.makeRequest('/api/transactions/breakdown/expenses', 'GET');
  }

  async getIncomeBreakdown() {
    return this.makeRequest('/api/transactions/breakdown/income', 'GET');
  }

  async getCategoryBreakdown() {
    // Use expense breakdown for now
    return this.makeRequest('/api/transactions/breakdown/expenses', 'GET');
  }
}

export const apiService = new ApiService();