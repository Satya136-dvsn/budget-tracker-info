# 🎯 Milestone 1: User Authentication & Profile Management - Complete Flow Explanation

**Date**: October 6, 2025  
**Status**: ✅ FULLY IMPLEMENTED

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Technology Stack](#technology-stack)
4. [User Registration Flow](#user-registration-flow)
5. [User Login Flow](#user-login-flow)
6. [Profile Management Flow](#profile-management-flow)
7. [JWT Authentication Flow](#jwt-authentication-flow)
8. [Security Implementation](#security-implementation)
9. [Code Walkthrough](#code-walkthrough)
10. [Data Flow Diagrams](#data-flow-diagrams)

---

## 📖 Overview

Milestone 1 implements a complete, secure authentication system with:
- **JWT-based authentication** (JSON Web Tokens)
- **Role-based access control** (USER and ADMIN roles)
- **User profile management** (Financial data tracking)
- **Password encryption** (BCrypt hashing)
- **Session management** (Stateless authentication)

### Key Features:
✅ User registration with email and password  
✅ Secure login with JWT token generation  
✅ Role-based authorization (USER/ADMIN)  
✅ Profile creation with financial data (income, savings, target expenses)  
✅ Automatic token validation on every request  
✅ Protected routes and API endpoints  

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            FRONTEND (React)                              │
│  ┌────────────┐  ┌────────────┐  ┌─────────────┐  ┌────────────────┐  │
│  │ SignUp.jsx │  │ SignIn.jsx │  │ Profile.jsx │  │ Dashboard.jsx  │  │
│  └─────┬──────┘  └─────┬──────┘  └──────┬──────┘  └────────┬───────┘  │
│        │               │                 │                   │           │
│        └───────────────┴─────────────────┴───────────────────┘           │
│                              │                                            │
│                    ┌─────────▼──────────┐                                │
│                    │  AuthContext.jsx   │  (State Management)            │
│                    │  - user            │                                │
│                    │  - token           │                                │
│                    │  - login()         │                                │
│                    │  - register()      │                                │
│                    │  - logout()        │                                │
│                    └─────────┬──────────┘                                │
│                              │                                            │
│                    ┌─────────▼──────────┐                                │
│                    │   api.js Service   │  (API Communication)           │
│                    │  - getHeaders()    │                                │
│                    │  - makeRequest()   │                                │
│                    │  - login()         │                                │
│                    │  - register()      │                                │
│                    └─────────┬──────────┘                                │
└──────────────────────────────┼────────────────────────────────────────────┘
                               │
                    HTTP + JWT Token
                               │
┌──────────────────────────────▼────────────────────────────────────────────┐
│                         BACKEND (Spring Boot)                             │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │                    SecurityConfig.java                            │    │
│  │  - CORS configuration                                             │    │
│  │  - Endpoint protection rules                                      │    │
│  │  - JWT filter registration                                        │    │
│  │  - Session: STATELESS                                             │    │
│  └─────────────────────────┬────────────────────────────────────────┘    │
│                            │                                              │
│  ┌─────────────────────────▼────────────────────────────────────────┐    │
│  │            JwtAuthenticationFilter.java                           │    │
│  │  1. Extract JWT from Authorization header                         │    │
│  │  2. Validate token with JwtUtil                                   │    │
│  │  3. Load user details                                             │    │
│  │  4. Set SecurityContext                                           │    │
│  │  5. Continue filter chain                                         │    │
│  └─────────────────────────┬────────────────────────────────────────┘    │
│                            │                                              │
│  ┌─────────────────────────▼────────────────────────────────────────┐    │
│  │                  AuthController.java                              │    │
│  │  POST /api/auth/register  - User registration                     │    │
│  │  POST /api/auth/login     - User login                            │    │
│  │  POST /api/auth/logout    - User logout                           │    │
│  └─────────────────────────┬────────────────────────────────────────┘    │
│                            │                                              │
│  ┌─────────────────────────▼────────────────────────────────────────┐    │
│  │                    UserService.java                               │    │
│  │  - saveUser()           - Save new user with encrypted password   │    │
│  │  - loadUserByUsername() - Load user for authentication            │    │
│  │  - existsByUsername()   - Check username availability             │    │
│  │  - existsByEmail()      - Check email availability                │    │
│  │  - updateProfile()      - Update user financial profile           │    │
│  └─────────────────────────┬────────────────────────────────────────┘    │
│                            │                                              │
│  ┌─────────────────────────▼────────────────────────────────────────┐    │
│  │                     JwtUtil.java                                  │    │
│  │  - generateToken()     - Create JWT token                         │    │
│  │  - validateToken()     - Verify token validity                    │    │
│  │  - extractUsername()   - Get username from token                  │    │
│  │  - extractExpiration() - Get token expiry time                    │    │
│  └─────────────────────────┬────────────────────────────────────────┘    │
│                            │                                              │
│  ┌─────────────────────────▼────────────────────────────────────────┐    │
│  │                    User.java (Entity)                             │    │
│  │  @Entity - JPA entity mapped to "users" table                     │    │
│  │  Fields:                                                           │    │
│  │    - id (Primary Key)                                             │    │
│  │    - username (unique)                                            │    │
│  │    - email (unique)                                               │    │
│  │    - password (BCrypt encrypted)                                  │    │
│  │    - role (USER/ADMIN enum)                                       │    │
│  │    - monthlyIncome                                                │    │
│  │    - currentSavings                                               │    │
│  │    - targetExpenses                                               │    │
│  │  Implements: UserDetails (Spring Security)                        │    │
│  └─────────────────────────┬────────────────────────────────────────┘    │
│                            │                                              │
│  ┌─────────────────────────▼────────────────────────────────────────┐    │
│  │                    MySQL Database                                 │    │
│  │  users table:                                                      │    │
│  │    - id, username, email, password, role                          │    │
│  │    - monthly_income, current_savings, target_expenses             │    │
│  │    - created_at, updated_at                                       │    │
│  └────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend:
- **React 18** - UI library
- **React Router** - Navigation
- **Context API** - State management
- **Axios/Fetch** - HTTP requests
- **localStorage** - Token storage

### Backend:
- **Spring Boot 3.5.3** - Application framework
- **Spring Security** - Authentication & authorization
- **JWT (io.jsonwebtoken)** - Token generation & validation
- **BCrypt** - Password encryption
- **JPA/Hibernate** - ORM
- **MySQL 8.0** - Database

---

## 🔐 User Registration Flow

### Step-by-Step Process:

```
User                Frontend                    Backend                    Database
 │                     │                          │                          │
 ├─1. Fill form───────►│                          │                          │
 │   (username,        │                          │                          │
 │    email,           │                          │                          │
 │    password,        │                          │                          │
 │    role)            │                          │                          │
 │                     │                          │                          │
 ├─2. Click Register──►│                          │                          │
 │                     │                          │                          │
 │                     ├─3. Call register()──────►│                          │
 │                     │   from AuthContext       │                          │
 │                     │                          │                          │
 │                     │   POST /api/auth/register│                          │
 │                     │   Body: {username,       │                          │
 │                     │          email,          │                          │
 │                     │          password,       │                          │
 │                     │          role}           │                          │
 │                     │                          │                          │
 │                     │                          ├─4. AuthController       │
 │                     │                          │    .register()           │
 │                     │                          │                          │
 │                     │                          ├─5. Check username────────►│
 │                     │                          │    exists?              │
 │                     │                          │◄─────────────────────────┤
 │                     │                          │    (SELECT * FROM users  │
 │                     │                          │     WHERE username=?)    │
 │                     │                          │                          │
 │                     │                          ├─6. Check email───────────►│
 │                     │                          │    exists?              │
 │                     │                          │◄─────────────────────────┤
 │                     │                          │    (SELECT * FROM users  │
 │                     │                          │     WHERE email=?)       │
 │                     │                          │                          │
 │                     │                          ├─7. Create User entity    │
 │                     │                          │    new User(username,    │
 │                     │                          │            email,        │
 │                     │                          │            password)     │
 │                     │                          │                          │
 │                     │                          ├─8. Set role              │
 │                     │                          │    user.setRole(role)    │
 │                     │                          │                          │
 │                     │                          ├─9. Encrypt password──────►│
 │                     │                          │    BCrypt.hashpw()       │
 │                     │                          │◄─────────────────────────┤
 │                     │                          │    (hashed password)     │
 │                     │                          │                          │
 │                     │                          ├─10. Save user────────────►│
 │                     │                          │     userService          │
 │                     │                          │     .saveUser(user)      │
 │                     │                          │     INSERT INTO users... │
 │                     │                          │◄─────────────────────────┤
 │                     │                          │     (user with ID)       │
 │                     │                          │                          │
 │                     │                          ├─11. Generate JWT token   │
 │                     │                          │     jwtUtil              │
 │                     │                          │     .generateToken(user) │
 │                     │                          │                          │
 │                     │                          │     Token payload:       │
 │                     │                          │     - username           │
 │                     │                          │     - issued at          │
 │                     │                          │     - expiration         │
 │                     │                          │     - signature          │
 │                     │                          │                          │
 │                     │                          ├─12. Create response      │
 │                     │                          │     AuthResponse:        │
 │                     │                          │     - token              │
 │                     │                          │     - id                 │
 │                     │                          │     - username           │
 │                     │                          │     - email              │
 │                     │                          │     - role               │
 │                     │                          │     - monthlyIncome      │
 │                     │                          │     - currentSavings     │
 │                     │                          │     - targetExpenses     │
 │                     │                          │                          │
 │                     │◄─13. Return response─────┤                          │
 │                     │     {token, id, ...}     │                          │
 │                     │                          │                          │
 │                     ├─14. Store token          │                          │
 │                     │     localStorage         │                          │
 │                     │     .setItem('authToken',│                          │
 │                     │              token)      │                          │
 │                     │                          │                          │
 │                     ├─15. Set user state       │                          │
 │                     │     setUser(response)    │                          │
 │                     │     setToken(token)      │                          │
 │                     │                          │                          │
 │◄─16. Navigate to────┤                          │                          │
 │     Dashboard       │                          │                          │
 │                     │                          │                          │
 │     Show success    │                          │                          │
 │     message         │                          │                          │
```

### Code Implementation:

#### Frontend - SignUp.jsx:
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Call register function from AuthContext
    const response = await register(formData);
    
    if (response.token && response.id) {
      showAlert('Registration successful! You are now logged in.', 'success');
      navigate('/dashboard');
    }
  } catch (error) {
    showAlert(`Registration failed: ${error.message}`, 'error');
  } finally {
    setLoading(false);
  }
};
```

#### Backend - AuthController.java:
```java
@PostMapping("/register")
public ResponseEntity<?> register(@Valid @RequestBody AuthRequest authRequest) {
    // 1. Check if username exists
    if (userService.existsByUsername(authRequest.getUsername())) {
        return ResponseEntity.badRequest()
            .body("Error: Username is already taken!");
    }
    
    // 2. Check if email exists
    if (userService.existsByEmail(authRequest.getEmail())) {
        return ResponseEntity.badRequest()
            .body("Error: Email is already in use!");
    }
    
    // 3. Create new user
    User user = new User(authRequest.getUsername(), 
                        authRequest.getEmail(), 
                        authRequest.getPassword());
    
    // 4. Set role
    if (authRequest.getRole() != null) {
        user.setRole(Role.valueOf(authRequest.getRole()));
    }
    
    // 5. Save user (password will be encrypted automatically)
    User savedUser = userService.saveUser(user);
    
    // 6. Generate JWT token
    String token = jwtUtil.generateToken(savedUser);
    
    // 7. Create response with token and user data
    AuthResponse response = new AuthResponse(token, savedUser.getId(), 
        savedUser.getUsername(), savedUser.getEmail(), savedUser.getRole().name());
    
    return ResponseEntity.ok(response);
}
```

---

## 🔑 User Login Flow

### Step-by-Step Process:

```
User                Frontend                    Backend                    Database
 │                     │                          │                          │
 ├─1. Enter credentials─►│                          │                          │
 │   (username,        │                          │                          │
 │    password)        │                          │                          │
 │                     │                          │                          │
 ├─2. Click Login─────►│                          │                          │
 │                     │                          │                          │
 │                     ├─3. Call login()─────────►│                          │
 │                     │   from AuthContext       │                          │
 │                     │                          │                          │
 │                     │   POST /api/auth/login   │                          │
 │                     │   Body: {username,       │                          │
 │                     │          password}       │                          │
 │                     │                          │                          │
 │                     │                          ├─4. AuthController        │
 │                     │                          │    .login()              │
 │                     │                          │                          │
 │                     │                          ├─5. Authenticate user     │
 │                     │                          │    authenticationManager │
 │                     │                          │    .authenticate()       │
 │                     │                          │                          │
 │                     │                          ├─6. Load user from DB─────►│
 │                     │                          │    SELECT * FROM users   │
 │                     │                          │    WHERE username=?      │
 │                     │                          │◄─────────────────────────┤
 │                     │                          │    (User entity)         │
 │                     │                          │                          │
 │                     │                          ├─7. Compare password      │
 │                     │                          │    BCrypt.checkpw(       │
 │                     │                          │      inputPassword,      │
 │                     │                          │      storedHashedPwd)    │
 │                     │                          │                          │
 │                     │                          │    ✅ Match!             │
 │                     │                          │                          │
 │                     │                          ├─8. Set SecurityContext   │
 │                     │                          │    SecurityContextHolder │
 │                     │                          │    .setAuthentication()  │
 │                     │                          │                          │
 │                     │                          ├─9. Generate JWT token    │
 │                     │                          │    jwtUtil               │
 │                     │                          │    .generateToken(user)  │
 │                     │                          │                          │
 │                     │                          │    Token contains:       │
 │                     │                          │    - username            │
 │                     │                          │    - role                │
 │                     │                          │    - issued at           │
 │                     │                          │    - expires in 24h      │
 │                     │                          │                          │
 │                     │                          ├─10. Create response      │
 │                     │                          │     AuthResponse:        │
 │                     │                          │     - token              │
 │                     │                          │     - user data          │
 │                     │                          │     - financial profile  │
 │                     │                          │                          │
 │                     │◄─11. Return response─────┤                          │
 │                     │     {token, user}        │                          │
 │                     │                          │                          │
 │                     ├─12. Store token          │                          │
 │                     │     localStorage         │                          │
 │                     │     .setItem('authToken',│                          │
 │                     │              token)      │                          │
 │                     │                          │                          │
 │                     ├─13. Set auth state       │                          │
 │                     │     setUser(response)    │                          │
 │                     │     setToken(token)      │                          │
 │                     │                          │                          │
 │◄─14. Navigate to────┤                          │                          │
 │     Dashboard       │                          │                          │
 │                     │                          │                          │
```

### Code Implementation:

#### Frontend - SignIn.jsx:
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Call login function from AuthContext
    const response = await login({
      username: formData.username,
      password: formData.password
    });
    
    showAlert('Login successful!', 'success');
    navigate('/dashboard');
  } catch (error) {
    showAlert(`Login failed: ${error.message}`, 'error');
  } finally {
    setLoading(false);
  }
};
```

#### Frontend - AuthContext.jsx:
```javascript
const login = async (credentials) => {
  try {
    // Call API service
    const response = await apiService.login(credentials);
    
    if (response.token) {
      // Store token
      localStorage.setItem('authToken', response.token);
      setToken(response.token);
      
      // Set user data
      setUser(response);
      
      return response;
    }
    throw new Error('Invalid credentials - no token in response');
  } catch (error) {
    throw error;
  }
};
```

#### Backend - AuthController.java:
```java
@PostMapping("/login")
public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
    try {
        // 1. Authenticate user
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(),
                loginRequest.getPassword()
            )
        );
        
        // 2. Set security context
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // 3. Get authenticated user
        User user = (User) authentication.getPrincipal();
        
        // 4. Generate JWT token
        String token = jwtUtil.generateToken(user);
        
        // 5. Create response with user data
        AuthResponse response = new AuthResponse(token, user.getId(), 
            user.getUsername(), user.getEmail(), user.getRole().name());
        response.setMonthlyIncome(user.getMonthlyIncome());
        response.setCurrentSavings(user.getCurrentSavings());
        response.setTargetExpenses(user.getTargetExpenses());
        
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body("Error: Invalid username or password");
    }
}
```

---

## 👤 Profile Management Flow

### Step-by-Step Process:

```
User                Frontend                    Backend                    Database
 │                     │                          │                          │
 ├─1. View profile────►│                          │                          │
 │                     │                          │                          │
 │                     ├─2. Load profile data     │                          │
 │                     │   (from AuthContext)     │                          │
 │                     │                          │                          │
 │◄─3. Display profile─┤                          │                          │
 │    - Username       │                          │                          │
 │    - Email          │                          │                          │
 │    - Role           │                          │                          │
 │    - Monthly Income │                          │                          │
 │    - Current Savings│                          │                          │
 │    - Target Expenses│                          │                          │
 │                     │                          │                          │
 ├─4. Edit financial──►│                          │                          │
 │    data             │                          │                          │
 │                     │                          │                          │
 ├─5. Click Save──────►│                          │                          │
 │                     │                          │                          │
 │                     ├─6. Call API─────────────►│                          │
 │                     │   PUT /api/user/profile  │                          │
 │                     │   Headers: {             │                          │
 │                     │     Authorization:       │                          │
 │                     │     'Bearer <token>'     │                          │
 │                     │   }                      │                          │
 │                     │   Body: {                │                          │
 │                     │     monthlyIncome,       │                          │
 │                     │     currentSavings,      │                          │
 │                     │     targetExpenses       │                          │
 │                     │   }                      │                          │
 │                     │                          │                          │
 │                     │                          ├─7. JWT Filter extracts   │
 │                     │                          │    token from header     │
 │                     │                          │                          │
 │                     │                          ├─8. Validate token        │
 │                     │                          │    jwtUtil               │
 │                     │                          │    .validateToken()      │
 │                     │                          │                          │
 │                     │                          │    ✅ Valid token        │
 │                     │                          │                          │
 │                     │                          ├─9. Extract username      │
 │                     │                          │    from token            │
 │                     │                          │                          │
 │                     │                          ├─10. Load user────────────►│
 │                     │                          │     SELECT * FROM users  │
 │                     │                          │     WHERE username=?     │
 │                     │                          │◄─────────────────────────┤
 │                     │                          │     (User entity)        │
 │                     │                          │                          │
 │                     │                          ├─11. Update user data     │
 │                     │                          │     user.setMonthlyIncome│
 │                     │                          │     user.setCurrentSavings│
 │                     │                          │     user.setTargetExpenses│
 │                     │                          │                          │
 │                     │                          ├─12. Save to DB───────────►│
 │                     │                          │     UPDATE users SET     │
 │                     │                          │     monthly_income=?,    │
 │                     │                          │     current_savings=?,   │
 │                     │                          │     target_expenses=?    │
 │                     │                          │     WHERE id=?           │
 │                     │                          │◄─────────────────────────┤
 │                     │                          │     (updated user)       │
 │                     │                          │                          │
 │                     │◄─13. Return updated user─┤                          │
 │                     │                          │                          │
 │                     ├─14. Update local state   │                          │
 │                     │     updateUser(response) │                          │
 │                     │                          │                          │
 │◄─15. Show success───┤                          │                          │
 │     message         │                          │                          │
 │                     │                          │                          │
```

### Code Implementation:

#### Frontend - ProfileNew.jsx:
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const updateData = {
      monthlyIncome: parseFloat(formData.monthlyIncome) || null,
      currentSavings: parseFloat(formData.currentSavings) || null,
      targetExpenses: parseFloat(formData.targetExpenses) || null
    };

    // Call API to update profile
    const response = await apiService.updateUserProfile(updateData);
    
    // Update local user state
    updateUser(response);
    
    showAlert('Profile updated successfully!', 'success');
  } catch (error) {
    showAlert(`Failed to update profile: ${error.message}`, 'error');
  } finally {
    setLoading(false);
  }
};
```

#### Frontend - api.js:
```javascript
async updateUserProfile(profileData) {
  return this.makeRequest('/api/user/profile', 'PUT', profileData);
}

async makeRequest(endpoint, method = 'GET', data = null) {
  const config = {
    method,
    headers: this.getHeaders(method)  // Includes JWT token
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(this.baseUrl + endpoint, config);
  // ... error handling and response parsing
  return JSON.parse(responseText);
}

getHeaders(method = 'GET') {
  const headers = {};
  
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    headers['Content-Type'] = 'application/json';
  }
  
  const token = this.getToken();  // Get from localStorage
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}
```

#### Backend - UserController.java:
```java
@PutMapping("/profile")
public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> updates,
                                       @RequestHeader("Authorization") String token) {
    try {
        // Extract username from JWT token
        String jwtToken = token.substring(7); // Remove "Bearer "
        String username = jwtUtil.extractUsername(jwtToken);
        
        // Get user from database
        User user = userService.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Update financial data
        if (updates.containsKey("monthlyIncome")) {
            user.setMonthlyIncome(
                new BigDecimal(updates.get("monthlyIncome").toString())
            );
        }
        if (updates.containsKey("currentSavings")) {
            user.setCurrentSavings(
                new BigDecimal(updates.get("currentSavings").toString())
            );
        }
        if (updates.containsKey("targetExpenses")) {
            user.setTargetExpenses(
                new BigDecimal(updates.get("targetExpenses").toString())
            );
        }
        
        // Save updated user
        User updatedUser = userService.saveUser(user);
        
        // Return updated user data
        return ResponseEntity.ok(updatedUser);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body("Error updating profile: " + e.getMessage());
    }
}
```

---

## 🔒 JWT Authentication Flow

### JWT Token Structure:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VybmFtZSIsImlhdCI6MTYxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
│                                   │                                │                                              │
│         HEADER                    │           PAYLOAD              │                  SIGNATURE                    │
│  (Algorithm & Type)               │      (Claims/Data)             │          (Verify Integrity)                   │
```

#### Header:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

#### Payload:
```json
{
  "sub": "john_doe",           // Username
  "iat": 1696550400,           // Issued at (timestamp)
  "exp": 1696636800            // Expiration (timestamp)
}
```

#### Signature:
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret_key
)
```

### JWT Token Lifecycle:

```
┌────────────────────────────────────────────────────────────────────┐
│                     JWT TOKEN LIFECYCLE                             │
└────────────────────────────────────────────────────────────────────┘

1. TOKEN GENERATION (Login/Register)
   ┌─────────────────────────────────────────────┐
   │  Backend (JwtUtil.generateToken())          │
   │  ┌────────────────────────────────────┐     │
   │  │ 1. Create claims                   │     │
   │  │    - sub: username                 │     │
   │  │    - iat: current timestamp        │     │
   │  │    - exp: current + 24 hours       │     │
   │  ├────────────────────────────────────┤     │
   │  │ 2. Sign with secret key            │     │
   │  │    HMACSHA256(claims, secret)      │     │
   │  ├────────────────────────────────────┤     │
   │  │ 3. Base64 encode                   │     │
   │  │    header.payload.signature        │     │
   │  └────────────────────────────────────┘     │
   └─────────────────────────────────────────────┘
                      │
                      ▼
   ┌─────────────────────────────────────────────┐
   │  Return token to frontend                   │
   │  Response: { token: "eyJhbGc..." }          │
   └─────────────────────────────────────────────┘

2. TOKEN STORAGE (Frontend)
   ┌─────────────────────────────────────────────┐
   │  localStorage.setItem('authToken', token)   │
   └─────────────────────────────────────────────┘

3. TOKEN USAGE (Every API Request)
   ┌─────────────────────────────────────────────┐
   │  Frontend (api.js)                          │
   │  ┌────────────────────────────────────┐     │
   │  │ 1. Get token from localStorage     │     │
   │  │    const token = localStorage      │     │
   │  │       .getItem('authToken')        │     │
   │  ├────────────────────────────────────┤     │
   │  │ 2. Add to request header           │     │
   │  │    Authorization: Bearer <token>   │     │
   │  └────────────────────────────────────┘     │
   └─────────────────────────────────────────────┘
                      │
                      ▼
   ┌─────────────────────────────────────────────┐
   │  Backend (JwtAuthenticationFilter)          │
   │  ┌────────────────────────────────────┐     │
   │  │ 1. Extract token from header       │     │
   │  │    String jwt = header             │     │
   │  │       .substring(7); // Remove     │     │
   │  │                      // "Bearer "  │     │
   │  ├────────────────────────────────────┤     │
   │  │ 2. Extract username from token     │     │
   │  │    String username = jwtUtil       │     │
   │  │       .extractUsername(jwt)        │     │
   │  ├────────────────────────────────────┤     │
   │  │ 3. Load user from database         │     │
   │  │    UserDetails user =              │     │
   │  │       userDetailsService           │     │
   │  │       .loadUserByUsername()        │     │
   │  ├────────────────────────────────────┤     │
   │  │ 4. Validate token                  │     │
   │  │    boolean valid = jwtUtil         │     │
   │  │       .validateToken(jwt, user)    │     │
   │  │                                     │     │
   │  │    Checks:                         │     │
   │  │    - Signature valid?              │     │
   │  │    - Not expired?                  │     │
   │  │    - Username matches?             │     │
   │  ├────────────────────────────────────┤     │
   │  │ 5. Set SecurityContext             │     │
   │  │    SecurityContextHolder           │     │
   │  │       .getContext()                │     │
   │  │       .setAuthentication(auth)     │     │
   │  └────────────────────────────────────┘     │
   └─────────────────────────────────────────────┘
                      │
                      ▼
   ┌─────────────────────────────────────────────┐
   │  Allow request to proceed                   │
   │  filterChain.doFilter(request, response)    │
   └─────────────────────────────────────────────┘

4. TOKEN EXPIRATION (After 24 hours)
   ┌─────────────────────────────────────────────┐
   │  Backend validates token                    │
   │  ┌────────────────────────────────────┐     │
   │  │ Token expired?                     │     │
   │  │ if (exp < current_time) {          │     │
   │  │    throw ExpiredJwtException       │     │
   │  │ }                                  │     │
   │  └────────────────────────────────────┘     │
   └─────────────────────────────────────────────┘
                      │
                      ▼
   ┌─────────────────────────────────────────────┐
   │  Frontend handles 401 Unauthorized          │
   │  ┌────────────────────────────────────┐     │
   │  │ 1. Clear localStorage              │     │
   │  │ 2. Redirect to /signin             │     │
   │  │ 3. Show "Session expired" message  │     │
   │  └────────────────────────────────────┘     │
   └─────────────────────────────────────────────┘
```

### Code Implementation:

#### Backend - JwtUtil.java (Token Generation):
```java
public String generateToken(UserDetails userDetails) {
    Map<String, Object> claims = new HashMap<>();
    return createToken(claims, userDetails.getUsername());
}

private String createToken(Map<String, Object> claims, String subject) {
    return Jwts.builder()
            .setClaims(claims)
            .setSubject(subject)                          // Username
            .setIssuedAt(new Date(System.currentTimeMillis()))  // Current time
            .setExpiration(new Date(System.currentTimeMillis() + expiration))  // +24h
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)  // Sign
            .compact();
}
```

#### Backend - JwtUtil.java (Token Validation):
```java
public Boolean validateToken(String token, UserDetails userDetails) {
    final String username = extractUsername(token);
    return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
}

public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
}

private Boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
}
```

#### Backend - JwtAuthenticationFilter.java:
```java
@Override
protected void doFilterInternal(HttpServletRequest request, 
                                HttpServletResponse response, 
                                FilterChain filterChain) {
    // 1. Extract JWT from header
    final String authorizationHeader = request.getHeader("Authorization");
    
    String username = null;
    String jwt = null;
    
    if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
        jwt = authorizationHeader.substring(7);  // Remove "Bearer "
        try {
            username = jwtUtil.extractUsername(jwt);
        } catch (Exception e) {
            logger.error("JWT token is invalid or expired");
        }
    }
    
    // 2. Validate token and set authentication
    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        
        if (jwtUtil.validateToken(jwt, userDetails)) {
            // Token is valid - authenticate user
            UsernamePasswordAuthenticationToken authToken = 
                new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            
            // Set SecurityContext
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
    }
    
    // 3. Continue filter chain
    filterChain.doFilter(request, response);
}
```

---

## 🛡️ Security Implementation

### 1. Password Encryption (BCrypt)

```
┌────────────────────────────────────────────────────────────────┐
│                    PASSWORD ENCRYPTION                          │
└────────────────────────────────────────────────────────────────┘

Registration:
  User Input: "myPassword123"
       │
       ▼
  BCrypt Hash: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
       │
       ▼
  Store in Database: users.password = (hashed value)

Login:
  User Input: "myPassword123"
       │
       ▼
  BCrypt.checkpw(inputPassword, storedHash)
       │
       ├─► Match: ✅ Authenticate user
       └─► No match: ❌ Reject login
```

#### Code:
```java
// Automatic encryption when saving user
@PrePersist
@PreUpdate
public void encryptPassword() {
    if (this.password != null && !this.password.startsWith("$2a$")) {
        this.password = passwordEncoder.encode(this.password);
    }
}

// Password validation during login
Authentication authentication = authenticationManager.authenticate(
    new UsernamePasswordAuthenticationToken(username, password)
);
// Spring Security automatically uses BCrypt to compare passwords
```

### 2. Role-Based Access Control (RBAC)

```
┌────────────────────────────────────────────────────────────────┐
│              ROLE-BASED ACCESS CONTROL (RBAC)                   │
└────────────────────────────────────────────────────────────────┘

Roles:
┌─────────┐
│  USER   │  - View own profile
│         │  - Manage own transactions
│         │  - Set budgets and goals
│         │  - View own reports
└─────────┘

┌─────────┐
│  ADMIN  │  - All USER permissions
│         │  - View all users
│         │  - View system statistics
│         │  - Admin dashboard access
└─────────┘

Endpoint Protection:
┌──────────────────────────────────┬──────────┬───────┐
│ Endpoint                         │ USER     │ ADMIN │
├──────────────────────────────────┼──────────┼───────┤
│ POST /api/auth/register          │ Public   │Public │
│ POST /api/auth/login             │ Public   │Public │
│ GET  /api/user/profile           │ ✅       │ ✅    │
│ PUT  /api/user/profile           │ ✅       │ ✅    │
│ GET  /api/transactions           │ ✅       │ ✅    │
│ POST /api/transactions           │ ✅       │ ✅    │
│ GET  /api/admin/users            │ ❌       │ ✅    │
│ GET  /api/admin/dashboard-stats  │ ❌       │ ✅    │
└──────────────────────────────────┴──────────┴───────┘
```

#### Backend - SecurityConfig.java:
```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(authz -> authz
            // Public endpoints
            .requestMatchers("/api/auth/**").permitAll()
            
            // USER and ADMIN can access
            .requestMatchers("/api/user/profile").hasAnyRole("USER", "ADMIN")
            .requestMatchers("/api/transactions/**").hasAnyRole("USER", "ADMIN")
            
            // Only ADMIN can access
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            
            // All other requests require authentication
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtAuthenticationFilter, 
                        UsernamePasswordAuthenticationFilter.class);
    
    return http.build();
}
```

#### Frontend - RoleBasedAccess Component:
```javascript
const RoleBasedAccess = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  
  if (!user || !allowedRoles.includes(user.role)) {
    return null;  // Don't render component
  }
  
  return <>{children}</>;
};

// Usage:
<RoleBasedAccess allowedRoles={['ADMIN']}>
  <Link to="/admin/dashboard">Admin Dashboard</Link>
</RoleBasedAccess>
```

### 3. CORS Configuration

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    
    // Allow frontend origin
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
    
    // Allow HTTP methods
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
    
    // Allow headers
    configuration.setAllowedHeaders(Arrays.asList("*"));
    
    // Expose headers
    configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
    
    // Allow credentials (cookies, auth headers)
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

### 4. Session Management (Stateless)

```java
.sessionManagement(session -> 
    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
)
```

**Why Stateless?**
- No server-side session storage
- JWT token contains all necessary information
- Scalable (no session synchronization needed)
- Each request is independent

---

## 🎬 Code Walkthrough

### Complete Request Flow Example: "User Updates Profile"

#### 1. User fills form in ProfileNew.jsx:
```javascript
// User changes monthlyIncome to $5000
setFormData({ ...formData, monthlyIncome: '5000' });
```

#### 2. User clicks Save button:
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const updateData = {
    monthlyIncome: parseFloat(formData.monthlyIncome)  // 5000
  };
  
  // Call API service
  const response = await apiService.updateUserProfile(updateData);
};
```

#### 3. API service prepares request:
```javascript
// api.js
async updateUserProfile(profileData) {
  return this.makeRequest('/api/user/profile', 'PUT', profileData);
}

async makeRequest(endpoint, method, data) {
  const token = localStorage.getItem('authToken');  // Get JWT
  
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Add JWT
    },
    body: JSON.stringify(profileData)  // { monthlyIncome: 5000 }
  };
  
  const response = await fetch('http://localhost:8080/api/user/profile', config);
  return response.json();
}
```

#### 4. Request reaches backend SecurityConfig:
```java
// SecurityConfig.java
.authorizeHttpRequests(authz -> authz
  .requestMatchers("/api/user/profile").hasAnyRole("USER", "ADMIN")
  // Request requires authentication - passes to JWT filter
)
```

#### 5. JwtAuthenticationFilter processes request:
```java
// JwtAuthenticationFilter.java
@Override
protected void doFilterInternal(HttpServletRequest request, ...) {
  // Extract token from header
  String authHeader = request.getHeader("Authorization");
  // "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  
  String jwt = authHeader.substring(7);  // Remove "Bearer "
  
  // Extract username from token
  String username = jwtUtil.extractUsername(jwt);  // "john_doe"
  
  // Load user from database
  UserDetails userDetails = userDetailsService.loadUserByUsername(username);
  
  // Validate token
  if (jwtUtil.validateToken(jwt, userDetails)) {
    // Token is valid - set authentication
    UsernamePasswordAuthenticationToken authToken = 
      new UsernamePasswordAuthenticationToken(
        userDetails, null, userDetails.getAuthorities()
      );
    
    SecurityContextHolder.getContext().setAuthentication(authToken);
    // User is now authenticated for this request
  }
  
  filterChain.doFilter(request, response);  // Continue to controller
}
```

#### 6. Request reaches UserController:
```java
// UserController.java
@PutMapping("/profile")
public ResponseEntity<?> updateProfile(
    @RequestBody Map<String, Object> updates,
    @RequestHeader("Authorization") String token) {
  
  // Extract username from token
  String jwt = token.substring(7);
  String username = jwtUtil.extractUsername(jwt);  // "john_doe"
  
  // Get user from database
  User user = userService.findByUsername(username).orElseThrow();
  
  // Update monthly income
  if (updates.containsKey("monthlyIncome")) {
    user.setMonthlyIncome(new BigDecimal(updates.get("monthlyIncome").toString()));
    // user.monthlyIncome = 5000.00
  }
  
  // Save to database
  User updatedUser = userService.saveUser(user);
  // SQL: UPDATE users SET monthly_income = 5000.00 WHERE id = ?
  
  return ResponseEntity.ok(updatedUser);
}
```

#### 7. Response returns to frontend:
```javascript
// ProfileNew.jsx
const response = await apiService.updateUserProfile(updateData);
// response = { id: 1, username: "john_doe", monthlyIncome: 5000, ... }

// Update AuthContext state
updateUser(response);

// Show success message
showAlert('Profile updated successfully!', 'success');
```

---

## 📊 Data Flow Diagrams

### Entity Relationship Diagram:

```
┌──────────────────────────────────────┐
│              users                    │
├──────────────────────────────────────┤
│ 🔑 id (PK)                  BIGINT   │
│ 📝 username               VARCHAR    │ UNIQUE
│ 📧 email                  VARCHAR    │ UNIQUE
│ 🔒 password               VARCHAR    │ (BCrypt hashed)
│ 👤 role                   ENUM       │ (USER/ADMIN)
│ 💰 monthly_income         DECIMAL    │
│ 💵 current_savings        DECIMAL    │
│ 🎯 target_expenses        DECIMAL    │
│ 📅 created_at             TIMESTAMP  │
│ 📅 updated_at             TIMESTAMP  │
│ ✅ is_enabled             BOOLEAN    │
│ 🔓 is_account_non_expired BOOLEAN    │
│ 🔓 is_account_non_locked  BOOLEAN    │
│ 🔓 is_credentials_non_exp BOOLEAN    │
└──────────────────────────────────────┘
```

### State Management (Frontend):

```
┌──────────────────────────────────────────────────────────────┐
│                    AuthContext State                          │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  State:                                                       │
│  ├─ user: {                                                   │
│  │    id: 1,                                                  │
│  │    username: "john_doe",                                   │
│  │    email: "john@example.com",                              │
│  │    role: "USER",                                           │
│  │    monthlyIncome: 5000,                                    │
│  │    currentSavings: 10000,                                  │
│  │    targetExpenses: 3000                                    │
│  │  }                                                         │
│  ├─ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."         │
│  └─ loading: false                                            │
│                                                               │
│  Actions:                                                     │
│  ├─ login(credentials)      → Set user & token               │
│  ├─ register(userData)      → Set user & token               │
│  ├─ logout()                → Clear user & token             │
│  ├─ updateUser(userData)    → Update user state              │
│  └─ loadUserProfile()       → Fetch fresh user data          │
│                                                               │
│  Consumed by:                                                 │
│  ├─ All authenticated components                             │
│  ├─ Protected routes                                          │
│  └─ API service (for token)                                   │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎓 Summary

### Milestone 1 implements a **complete, production-ready authentication system** with:

#### ✅ **Security Features:**
1. **JWT-based authentication** - Stateless, scalable token system
2. **BCrypt password encryption** - Industry-standard hashing
3. **Role-based access control** - USER and ADMIN roles
4. **Protected API endpoints** - Authorization checks on every request
5. **CORS configuration** - Secure cross-origin requests
6. **Token expiration** - Automatic logout after 24 hours

#### ✅ **User Features:**
1. **Registration** - Create account with username, email, password
2. **Login** - Authenticate and receive JWT token
3. **Profile management** - Set and update financial data:
   - Monthly income
   - Current savings
   - Target expenses
4. **Role selection** - Choose USER or ADMIN role during registration
5. **Persistent sessions** - Token stored in localStorage
6. **Automatic re-authentication** - Load user on page refresh

#### ✅ **Technical Implementation:**
- **Backend**: Spring Boot 3.5.3 + Spring Security + JWT
- **Frontend**: React 18 + Context API + React Router
- **Database**: MySQL 8.0 with JPA/Hibernate
- **Architecture**: RESTful API with JWT authentication
- **State Management**: React Context for global auth state
- **API Communication**: Fetch API with JWT header injection

#### 🎯 **All Requirements Met:**
- ✅ JWT-based user registration and login system
- ✅ Role-based access (user/admin) with different privileges
- ✅ Profile creation and management: income, savings, target expenses

---

**This comprehensive authentication system serves as the foundation for all future features in Milestones 3, 4, and 5!**

---

**Next Steps**: Ready to proceed with **Milestone 3: Budget & Savings Goals** implementation! 🚀
