# 🔗 Frontend-Backend Connection & API Flow Guide

**Date**: October 6, 2025  
**Project**: Budget Tracker Application

---

## 📋 Table of Contents

1. [How Frontend Connects to Backend](#how-frontend-connects-to-backend)
2. [API Service Architecture](#api-service-architecture)
3. [SignUp Flow - Step by Step](#signup-flow---step-by-step)
4. [How APIs are Fetched](#how-apis-are-fetched)
5. [Authentication Flow](#authentication-flow)
6. [Complete Code Walkthrough](#complete-code-walkthrough)

---

## 🌐 How Frontend Connects to Backend

### **Connection Overview**

```
┌──────────────────────────────────────────────────────────────────────┐
│                     FRONTEND-BACKEND CONNECTION                       │
└──────────────────────────────────────────────────────────────────────┘

Frontend (React)                              Backend (Spring Boot)
Port: 5173                                    Port: 8080
──────────────────────                        ──────────────────────

http://localhost:5173  ───────────────────►  http://localhost:8080
                          HTTP Requests
                       (GET, POST, PUT, DELETE)
                       
                       
User Interface (React Components)
        │
        ├─► SignUp.jsx
        ├─► SignIn.jsx              
        ├─► Dashboard.jsx
        └─► Transactions.jsx
              │
              │ Uses
              ▼
        AuthContext.jsx ─────────────► Manages: user state, token, auth
              │                                   functions
              │ Calls
              ▼
        api.js (ApiService) ─────────► Central API communication layer
              │
              │ Sends HTTP Requests
              ▼
        fetch API ──────────────────────────────────────────────►
                                                                  │
                                                                  │
                                                                  ▼
                                      Spring Boot REST API Controllers
                                                │
                                                ├─► AuthController.java
                                                ├─► UserController.java
                                                ├─► TransactionController.java
                                                └─► CategoryController.java
                                                          │
                                                          ▼
                                                    Service Layer
                                                          │
                                                          ▼
                                                    MySQL Database
```

### **Key Configuration**

#### 1. **Backend URL Configuration** (Frontend)
```javascript
// frontend/src/services/api.js
const API_BASE_URL = 'http://localhost:8080';  // ← Backend server address

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;  // All API calls use this base URL
  }
}
```

#### 2. **CORS Configuration** (Backend)
```java
// backend/src/main/java/com/budgettracker/config/SecurityConfig.java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    
    // Allow frontend to make requests
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
    
    // Allow HTTP methods
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
    
    // Allow all headers
    configuration.setAllowedHeaders(Arrays.asList("*"));
    
    // Allow Authorization header
    configuration.setExposedHeaders(Arrays.asList("Authorization"));
    
    // Allow credentials (cookies, auth headers)
    configuration.setAllowCredentials(true);
    
    return source;
}
```

#### 3. **Server Port Configuration** (Backend)
```properties
# backend/src/main/resources/application.properties
server.port=8080  # ← Backend runs on this port
```

#### 4. **Dev Server Configuration** (Frontend)
```json
// frontend/package.json
{
  "scripts": {
    "dev": "vite",  // ← Starts frontend on port 5173
  }
}
```

---

## 🏗️ API Service Architecture

### **Centralized API Service**

The entire frontend uses a **single ApiService class** located in `api.js` to communicate with the backend.

```
┌────────────────────────────────────────────────────────────────┐
│                    ApiService Class Structure                   │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Properties:                                                    │
│  ├─ baseUrl: 'http://localhost:8080'                           │
│  │                                                              │
│  Core Methods:                                                  │
│  ├─ getToken()           → Get JWT from localStorage           │
│  ├─ getHeaders(method)   → Build request headers               │
│  └─ makeRequest()        → Generic HTTP request handler        │
│                                                                 │
│  Authentication APIs:                                           │
│  ├─ login(credentials)   → POST /api/auth/login                │
│  ├─ register(userData)   → POST /api/auth/register             │
│  └─ logout()             → POST /api/auth/logout               │
│                                                                 │
│  Profile APIs:                                                  │
│  ├─ getUserProfile()     → GET /api/user/profile               │
│  └─ updateUserProfile()  → PUT /api/user/profile               │
│                                                                 │
│  Transaction APIs:                                              │
│  ├─ createTransaction()  → POST /api/transactions              │
│  ├─ getUserTransactions()→ GET /api/transactions               │
│  ├─ updateTransaction()  → PUT /api/transactions/{id}          │
│  └─ deleteTransaction()  → DELETE /api/transactions/{id}       │
│                                                                 │
│  Category APIs:                                                 │
│  ├─ getExpenseCategories()→ GET /api/categories/expense        │
│  └─ getIncomeCategories() → GET /api/categories/income         │
│                                                                 │
│  Admin APIs:                                                    │
│  ├─ getAllUsers()        → GET /api/admin/users                │
│  └─ getAdminDashboardStats() → GET /api/admin/dashboard/stats  │
└────────────────────────────────────────────────────────────────┘
```

### **How It Works**

```javascript
// 1. Create singleton instance
export const apiService = new ApiService();

// 2. Import in any component
import { apiService } from '../services/api';

// 3. Use the methods
const users = await apiService.getAllUsers();
const profile = await apiService.getUserProfile();
const transactions = await apiService.getUserTransactions();
```

---

## 🔐 SignUp Flow - Step by Step

### **Visual Flow Diagram**

```
┌──────────────────────────────────────────────────────────────────────┐
│                         SIGNUP COMPLETE FLOW                          │
└──────────────────────────────────────────────────────────────────────┘

Step 1: User visits signup page
─────────────────────────────────
Browser: http://localhost:5173/signup
    │
    ▼
SignUp.jsx component renders


Step 2: User fills registration form
──────────────────────────────────────
┌─────────────────────────────────┐
│  Create Account                 │
│  ─────────────────────────      │
│  Username: [john_doe]           │
│  Email:    [john@example.com]   │
│  Password: [••••••••]           │
│  Role:     [USER ▼]             │
│                                 │
│  [Create Account] ← Click       │
└─────────────────────────────────┘
    │
    │ onChange events
    ▼
formData state updates:
{
  username: 'john_doe',
  email: 'john@example.com',
  password: 'password123',
  role: 'USER'
}


Step 3: Form submission
────────────────────────
SignUp.jsx - handleSubmit() triggered
    │
    │ e.preventDefault()  (Prevent page reload)
    │ setLoading(true)    (Show loading state)
    │
    ▼
Call register() from AuthContext
    │
    │ const response = await register(formData)
    │
    ▼


Step 4: AuthContext processes registration
────────────────────────────────────────────
AuthContext.jsx - register() function
    │
    │ const response = await apiService.register(userData)
    │
    ▼


Step 5: API Service sends HTTP request
────────────────────────────────────────
api.js - register() method
    │
    │ return this.makeRequest('/api/auth/register', 'POST', userData)
    │
    ▼
makeRequest() function:
    │
    ├─ Build headers:
    │   {
    │     'Content-Type': 'application/json'
    │   }
    │
    ├─ Build config:
    │   {
    │     method: 'POST',
    │     headers: { 'Content-Type': 'application/json' },
    │     body: JSON.stringify({
    │       username: 'john_doe',
    │       email: 'john@example.com',
    │       password: 'password123',
    │       role: 'USER'
    │     })
    │   }
    │
    └─ Send request:
        │
        │ fetch('http://localhost:8080/api/auth/register', config)
        │
        ▼


Step 6: Request travels over HTTP
──────────────────────────────────
HTTP POST Request:
─────────────────
URL: http://localhost:8080/api/auth/register
Method: POST
Headers:
  Content-Type: application/json
Body:
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "USER"
  }

Frontend (5173) ──────────────────► Backend (8080)


Step 7: Backend receives request
──────────────────────────────────
Spring Boot Application
    │
    ├─ CORS Filter checks origin (Allow from localhost:5173)
    │
    ├─ SecurityConfig checks endpoint (Allow public access to /api/auth/*)
    │
    └─ Route to AuthController
        │
        ▼


Step 8: AuthController processes registration
───────────────────────────────────────────────
AuthController.java - register() method
    │
    ├─ @PostMapping("/register")
    │
    ├─ Validate @RequestBody AuthRequest
    │   ├─ username: "john_doe"
    │   ├─ email: "john@example.com"
    │   ├─ password: "password123"
    │   └─ role: "USER"
    │
    ├─ Check if username exists:
    │   │ userService.existsByUsername("john_doe")
    │   │ SQL: SELECT COUNT(*) FROM users WHERE username='john_doe'
    │   └─ Result: false (username available)
    │
    ├─ Check if email exists:
    │   │ userService.existsByEmail("john@example.com")
    │   │ SQL: SELECT COUNT(*) FROM users WHERE email='john@example.com'
    │   └─ Result: false (email available)
    │
    ├─ Create User entity:
    │   │ User user = new User("john_doe", "john@example.com", "password123")
    │   └─ user.setRole(Role.USER)
    │
    ├─ Encrypt password (BCrypt):
    │   │ password: "password123"
    │   └─ hashed: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p..."
    │
    ├─ Save to database:
    │   │ User savedUser = userService.saveUser(user)
    │   │ SQL: INSERT INTO users (username, email, password, role, ...)
    │   │       VALUES ('john_doe', 'john@example.com', '$2a$10$...', 'USER', ...)
    │   └─ Result: User with ID=1 created
    │
    ├─ Generate JWT token:
    │   │ String token = jwtUtil.generateToken(savedUser)
    │   │
    │   │ Token payload:
    │   │ {
    │   │   "sub": "john_doe",
    │   │   "iat": 1696550400,  (issued at)
    │   │   "exp": 1696636800   (expires in 24h)
    │   │ }
    │   │
    │   └─ Token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOi..."
    │
    └─ Create response:
        │ AuthResponse response = new AuthResponse(
        │   token,
        │   savedUser.getId(),        // 1
        │   savedUser.getUsername(),  // "john_doe"
        │   savedUser.getEmail(),     // "john@example.com"
        │   savedUser.getRole()       // "USER"
        │ )
        └─ return ResponseEntity.ok(response)


Step 9: Response sent back to frontend
────────────────────────────────────────
HTTP Response:
──────────────
Status: 200 OK
Headers:
  Content-Type: application/json
Body:
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "USER",
    "monthlyIncome": null,
    "currentSavings": null,
    "targetExpenses": null
  }

Backend (8080) ──────────────────► Frontend (5173)


Step 10: API Service receives response
────────────────────────────────────────
api.js - makeRequest() continues:
    │
    ├─ const response = await fetch(...)
    │
    ├─ const responseText = await response.text()
    │
    ├─ Check response.ok (status 200-299)
    │   └─ ✅ OK
    │
    ├─ Parse JSON:
    │   │ return JSON.parse(responseText)
    │   │
    │   └─ Returns: { token: "...", id: 1, username: "john_doe", ... }
    │
    └─ Return to AuthContext


Step 11: AuthContext stores authentication
────────────────────────────────────────────
AuthContext.jsx - register() continues:
    │
    ├─ const response = await apiService.register(userData)
    │   Result: { token: "...", id: 1, username: "john_doe", ... }
    │
    ├─ if (response.token && response.id) {
    │   │
    │   ├─ Store token in localStorage:
    │   │   │ localStorage.setItem('authToken', response.token)
    │   │   └─ Token persisted in browser storage
    │   │
    │   ├─ Update token state:
    │   │   │ setToken(response.token)
    │   │   └─ Token now available in React state
    │   │
    │   └─ Update user state:
    │       │ setUser(response)
    │       └─ User data now available in React state
    │   }
    │
    └─ return response


Step 12: SignUp component handles success
───────────────────────────────────────────
SignUp.jsx - handleSubmit() continues:
    │
    ├─ const response = await register(formData)
    │   Result: { token: "...", id: 1, username: "john_doe", ... }
    │
    ├─ if (response.token && response.id) {
    │   │
    │   ├─ Show success alert:
    │   │   │ showAlert('Registration successful! You are now logged in.', 'success')
    │   │   └─ User sees green success message
    │   │
    │   └─ Navigate to dashboard:
    │       │ navigate('/dashboard')
    │       └─ Redirect to /dashboard page
    │   }
    │
    └─ setLoading(false)


Step 13: User redirected to dashboard
───────────────────────────────────────
Browser: http://localhost:5173/dashboard
    │
    ▼
Dashboard.jsx component renders
    │
    ├─ useAuth() hook provides:
    │   ├─ user: { id: 1, username: "john_doe", ... }
    │   ├─ token: "eyJhbGciOiJIUzI1..."
    │   └─ isAuthenticated: true
    │
    └─ User is now logged in! ✅


┌──────────────────────────────────┐
│   🎉 Registration Complete!      │
│   User is authenticated and      │
│   can now access protected       │
│   features of the application.   │
└──────────────────────────────────┘
```

---

## 🔄 How APIs are Fetched

### **Generic API Fetch Process**

Every API call in the application follows this pattern:

```
┌──────────────────────────────────────────────────────────────────┐
│                    GENERIC API FETCH FLOW                         │
└──────────────────────────────────────────────────────────────────┘

1. Component needs data
   ────────────────────
   Example: Transactions.jsx wants to load transactions
   
   const loadTransactions = async () => {
     const data = await apiService.getUserTransactions();
   }


2. Call ApiService method
   ────────────────────────
   apiService.getUserTransactions()
       │
       │ Internally calls:
       └─► this.makeRequest('/api/transactions', 'GET')


3. makeRequest() builds the request
   ─────────────────────────────────
   const config = {
     method: 'GET',
     headers: this.getHeaders('GET')
   };
   
   getHeaders() returns:
   {
     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR...'
   }
   
   Note: Token automatically added from localStorage!


4. Send HTTP request
   ──────────────────
   const response = await fetch(
     'http://localhost:8080/api/transactions',
     config
   );


5. Backend processes request
   ──────────────────────────
   ┌─► SecurityConfig checks authentication
   │
   ├─► JwtAuthenticationFilter validates token
   │   ├─ Extract token from Authorization header
   │   ├─ Validate token signature
   │   ├─ Check token expiration
   │   └─ Load user from database
   │
   ├─► Route to TransactionController
   │   └─ @GetMapping("/transactions")
   │
   └─► TransactionController processes:
       ├─ Get authenticated user from SecurityContext
       ├─ Query database for user's transactions
       └─ Return JSON response


6. Response received in frontend
   ──────────────────────────────
   const responseText = await response.text();
   
   Check if response is ok (status 200-299):
   ├─ ✅ OK: Parse JSON and return data
   └─ ❌ Error: Throw error with message


7. Component receives data
   ────────────────────────
   const data = await apiService.getUserTransactions();
   
   data = [
     { id: 1, title: "Salary", amount: 5000, type: "INCOME", ... },
     { id: 2, title: "Groceries", amount: 150, type: "EXPENSE", ... },
     ...
   ]


8. Component updates state
   ────────────────────────
   setTransactions(data);
   
   UI re-renders with new data! ✅
```

---

## 🔐 Authentication Flow

### **How JWT Token Works**

```
┌────────────────────────────────────────────────────────────────┐
│              JWT TOKEN AUTHENTICATION FLOW                      │
└────────────────────────────────────────────────────────────────┘

After Login/Register:
────────────────────
1. Backend generates JWT token
2. Frontend receives token in response
3. Frontend stores token in localStorage
4. Frontend sets token in AuthContext state

Future API Requests:
───────────────────
Every request automatically includes the token:

┌─────────────────────────────────────────────────────────────┐
│ Component makes API call                                     │
│    │                                                         │
│    ├─► apiService.getUserTransactions()                     │
│    │                                                         │
│    └─► makeRequest('/api/transactions', 'GET')              │
│           │                                                  │
│           ├─► getHeaders('GET')                             │
│           │      │                                           │
│           │      ├─► getToken() from localStorage           │
│           │      │      │                                    │
│           │      │      └─► Returns: "eyJhbGciOiJIUzI1..."  │
│           │      │                                           │
│           │      └─► Returns: {                             │
│           │             'Authorization': 'Bearer eyJhbGc...' │
│           │          }                                       │
│           │                                                  │
│           └─► fetch(url, {                                  │
│                  headers: {                                  │
│                    'Authorization': 'Bearer eyJhbGc...'     │
│                  }                                           │
│               })                                             │
│                                                              │
│ HTTP Request sent with token in header ──────────►          │
│                                                              │
│                                         Backend receives:    │
│                                         Authorization header │
│                                         with JWT token       │
│                                                  │           │
│                                         JwtAuthenticationFilter│
│                                                  │           │
│                                         Validates token      │
│                                                  │           │
│                                         ✅ Valid → Proceed   │
│                                         ❌ Invalid → 401     │
└─────────────────────────────────────────────────────────────┘
```

### **Token Storage**

```
┌────────────────────────────────────────────────────────────────┐
│                    TOKEN STORAGE FLOW                           │
└────────────────────────────────────────────────────────────────┘

Login/Register Success:
──────────────────────
AuthContext.jsx:
  │
  ├─ localStorage.setItem('authToken', response.token)
  │   └─► Persists in browser storage (survives page refresh)
  │
  └─ setToken(response.token)
      └─► Available in React state (for immediate use)


Subsequent Requests:
───────────────────
api.js:
  │
  └─ getToken() {
       return localStorage.getItem('authToken');
     }
     └─► Retrieved from browser storage


Token Expiration (401 error):
─────────────────────────────
api.js - makeRequest():
  │
  ├─ if (response.status === 401) {
  │   │
  │   ├─ localStorage.removeItem('authToken')  // Clear token
  │   │
  │   ├─ window.location.href = '/signin'      // Redirect to login
  │   │
  │   └─ throw new Error('Authentication failed. Please login again.')
  │ }


Logout:
──────
AuthContext.jsx:
  │
  ├─ setToken(null)                          // Clear state
  ├─ setUser(null)                           // Clear user data
  └─ localStorage.removeItem('authToken')    // Clear storage
```

---

## 📝 Complete Code Walkthrough

### **1. API Service (`api.js`)**

```javascript
// frontend/src/services/api.js

// Backend server URL
const API_BASE_URL = 'http://localhost:8080';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Get JWT token from browser storage
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Build request headers
  getHeaders(method = 'GET') {
    const headers = {};

    // Add Content-Type for requests with body
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      headers['Content-Type'] = 'application/json';
    }

    // Add Authorization header if token exists
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Generic HTTP request handler
  async makeRequest(endpoint, method = 'GET', data = null) {
    // Build request configuration
    const config = {
      method,
      headers: this.getHeaders(method)
    };

    // Add body for POST/PUT requests
    if (data && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(data);
    }

    try {
      // Send request
      const response = await fetch(this.baseUrl + endpoint, config);
      const responseText = await response.text();
      
      // Handle errors
      if (!response.ok) {
        // Token expired or invalid
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/signin';
          throw new Error('Authentication failed. Please login again.');
        }
        
        // Parse error message
        let errorMessage = responseText;
        try {
          const errorObj = JSON.parse(responseText);
          if (errorObj.message) {
            errorMessage = errorObj.message;
          }
        } catch {
          errorMessage = responseText || `HTTP ${response.status} error`;
        }
        
        throw new Error(errorMessage);
      }

      // Parse and return JSON response
      if (!responseText) {
        return {};
      }
      return JSON.parse(responseText);
      
    } catch (error) {
      throw error;
    }
  }

  // Authentication endpoints
  async register(userData) {
    return this.makeRequest('/api/auth/register', 'POST', userData);
  }

  async login(credentials) {
    return this.makeRequest('/api/auth/login', 'POST', credentials);
  }

  async logout() {
    return this.makeRequest('/api/auth/logout', 'POST');
  }

  // Transaction endpoints
  async getUserTransactions() {
    return this.makeRequest('/api/transactions', 'GET');
  }

  async createTransaction(transactionData) {
    return this.makeRequest('/api/transactions', 'POST', transactionData);
  }

  // ... more methods
}

// Export singleton instance
export const apiService = new ApiService();
```

**Key Points:**
- ✅ Centralized API communication
- ✅ Automatic JWT token injection
- ✅ Consistent error handling
- ✅ Single source of truth for backend URL
- ✅ Reusable across all components

---

### **2. Auth Context (`AuthContext.jsx`)**

```javascript
// frontend/src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // State management
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  // Load user profile on page refresh
  useEffect(() => {
    if (token && !user) {
      loadUserProfile();
    } else if (!token) {
      setLoading(false);
    } else if (token && user) {
      setLoading(false);
    }
  }, [token, user]);

  const loadUserProfile = async () => {
    try {
      const profile = await apiService.getUserProfile();
      setUser(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Register new user
  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);
      
      if (response.token && response.id) {
        // Store token
        localStorage.setItem('authToken', response.token);
        setToken(response.token);
        
        // Store user data
        setUser(response);
        
        return response;
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Login existing user
  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      
      if (response.token) {
        // Store token
        localStorage.setItem('authToken', response.token);
        setToken(response.token);
        
        // Store user data
        setUser(response);
        setLoading(false);
        
        return response;
      }
      throw new Error('Invalid credentials - no token in response');
    } catch (error) {
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  // Provide context value to children
  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    loadUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Key Points:**
- ✅ Centralized authentication state
- ✅ Automatic token persistence
- ✅ User profile management
- ✅ Available to all components via useAuth() hook
- ✅ Handles login, register, logout

---

### **3. SignUp Component (`SignUp.jsx`)**

```javascript
// frontend/src/components/Auth/SignUp.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../hooks/useAlert';

const SignUp = () => {
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'USER'
  });
  const [loading, setLoading] = useState(false);
  
  // Hooks
  const { register } = useAuth();      // Get register function from context
  const { showAlert } = useAlert();     // For showing notifications
  const navigate = useNavigate();       // For navigation

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page reload
    setLoading(true);    // Show loading state

    try {
      // Call register function from AuthContext
      const response = await register(formData);
      
      // Check if registration successful
      if (response.token && response.id) {
        showAlert('Registration successful! You are now logged in.', 'success');
        navigate('/dashboard');  // Redirect to dashboard
      } else {
        showAlert('Registration successful! Please login.', 'success');
        navigate('/signin');     // Redirect to login
      }
    } catch (error) {
      // Show error message
      showAlert(`Registration failed: ${error.message}`, 'error');
    } finally {
      setLoading(false);  // Hide loading state
    }
  };

  return (
    <section className="form-section">
      <div className="auth-container">
        <div className="auth-right">
          <div className="auth-form">
            <h2>Create Account</h2>
            <p>Fill in the details below to get started</p>
            
            <form onSubmit={handleSubmit}>
              {/* Username field */}
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Choose a username"
                />
              </div>
              
              {/* Email field */}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                />
              </div>
              
              {/* Password field */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a strong password"
                />
              </div>
              
              {/* Submit button */}
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
            
            <div className="auth-links">
              Already have an account? <Link to="/signin">Sign in here</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
```

**Key Points:**
- ✅ Uses useAuth() hook for register function
- ✅ Manages form state with useState
- ✅ Handles form submission
- ✅ Shows loading state during registration
- ✅ Displays success/error messages
- ✅ Redirects after successful registration

---

## 🎯 Summary

### **How Frontend Connects to Backend:**
1. **Base URL**: `http://localhost:8080` configured in `api.js`
2. **CORS**: Backend allows requests from `http://localhost:5173`
3. **API Service**: Centralized communication layer
4. **JWT Tokens**: Automatic authentication on every request

### **How SignUp Works:**
1. User fills form → `formData` state updates
2. User clicks submit → `handleSubmit()` called
3. Calls `register()` from `AuthContext`
4. `AuthContext` calls `apiService.register()`
5. `apiService` sends POST to `/api/auth/register`
6. Backend processes, creates user, returns JWT
7. Frontend stores token in `localStorage`
8. User redirected to dashboard

### **How APIs are Fetched:**
1. Component calls `apiService.method()`
2. `ApiService` builds request with headers
3. JWT token automatically added from `localStorage`
4. `fetch()` sends HTTP request to backend
5. Backend validates JWT, processes request
6. Response returned to frontend
7. Component updates state with data
8. UI re-renders

### **Key Technologies:**
- **Frontend**: React 18, Vite, React Router, Fetch API
- **Backend**: Spring Boot 3.5.3, Spring Security, JWT
- **Communication**: RESTful HTTP with JSON
- **Authentication**: JWT tokens in Authorization header
- **State Management**: React Context API

---

**All API communication flows through the `ApiService` class, ensuring consistent authentication, error handling, and request formatting across the entire application!** ✅
