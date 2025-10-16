# Budget Tracker API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
All endpoints except `/auth/signup` and `/auth/login` require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. User Registration
**POST** `/auth/signup`

Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "USER",
  "monthlyIncome": null,
  "currentSavings": null,
  "targetExpenses": null
}
```

### 2. User Login
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "USER",
  "monthlyIncome": 5000.00,
  "currentSavings": 10000.00,
  "targetExpenses": 3000.00
}
```

### 3. User Logout
**POST** `/auth/logout`

Logout current user (clears security context).

**Response:**
```json
"Successfully logged out"
```

### 4. Get User Profile
**GET** `/user/profile`

Get current user's profile information.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "USER",
  "monthlyIncome": 5000.00,
  "currentSavings": 10000.00,
  "targetExpenses": 3000.00
}
```

### 5. Update User Profile
**PUT** `/user/profile`

Update current user's profile information.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "monthlyIncome": 6000.00,
  "currentSavings": 12000.00,
  "targetExpenses": 3500.00
}
```

**Response:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "USER",
  "monthlyIncome": 6000.00,
  "currentSavings": 12000.00,
  "targetExpenses": 3500.00
}
```

### 6. Get User Profile by ID (Admin Only)
**GET** `/user/profile/{userId}`

Get any user's profile by ID (Admin role required).

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response:**
```json
{
  "id": 2,
  "username": "jane_doe",
  "email": "jane@example.com",
  "role": "USER",
  "monthlyIncome": 4000.00,
  "currentSavings": 8000.00,
  "targetExpenses": 2500.00
}
```

### 7. Update User Profile by ID (Admin Only)
**PUT** `/user/profile/{userId}`

Update any user's profile by ID (Admin role required).

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Request Body:**
```json
{
  "monthlyIncome": 4500.00,
  "currentSavings": 9000.00,
  "targetExpenses": 2800.00
}
```

**Response:**
```json
{
  "id": 2,
  "username": "jane_doe",
  "email": "jane@example.com",
  "role": "USER",
  "monthlyIncome": 4500.00,
  "currentSavings": 9000.00,
  "targetExpenses": 2800.00
}
```

## Error Responses

### 400 Bad Request
```json
"Error: Username is already taken!"
```

### 401 Unauthorized
```json
"Error: Invalid username or password"
```

### 403 Forbidden
```json
"Access Denied"
```

### 500 Internal Server Error
```json
"Error: <error-message>"
```

## User Roles

- **USER**: Can manage their own profile
- **ADMIN**: Can manage any user's profile

## Security Notes

- Passwords are encrypted using BCrypt
- JWT tokens expire after 24 hours (configurable)
- All profile endpoints require authentication
- Admin endpoints require ADMIN role
- CORS is enabled for all origins (configure for production)
