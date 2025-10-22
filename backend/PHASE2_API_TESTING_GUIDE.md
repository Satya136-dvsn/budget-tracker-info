# **Budget Tracker - Phase 2 API Testing Guide**

## **Overview**
Phase 2 introduces **Expense and Income Tracking** functionality to the Budget Tracker application. This includes transaction management and category management features.

## **New API Endpoints**

### **🔄 Transaction Management**

#### **1. Create Transaction**
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/transactions`
- **Headers:** 
  - `Authorization: Bearer <your_jwt_token>`
  - `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "title": "Grocery Shopping",
  "description": "Weekly grocery shopping at supermarket",
  "amount": 150.75,
  "type": "EXPENSE",
  "category": "Food & Dining",
  "transactionDate": "2025-10-02T14:30:00"
}
```

#### **2. Get All User Transactions**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/transactions`
- **Headers:** `Authorization: Bearer <your_jwt_token>`

#### **3. Get Transaction by ID**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/transactions/{id}`
- **Headers:** `Authorization: Bearer <your_jwt_token>`

#### **4. Update Transaction**
- **Method:** `PUT`
- **URL:** `http://localhost:8080/api/transactions/{id}`
- **Headers:** 
  - `Authorization: Bearer <your_jwt_token>`
  - `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "title": "Updated Grocery Shopping",
  "description": "Updated: Weekly grocery shopping at supermarket",
  "amount": 175.50,
  "type": "EXPENSE",
  "category": "Food & Dining",
  "transactionDate": "2025-10-02T14:30:00"
}
```

#### **5. Delete Transaction**
- **Method:** `DELETE`
- **URL:** `http://localhost:8080/api/transactions/{id}`
- **Headers:** `Authorization: Bearer <your_jwt_token>`

#### **6. Get Transactions by Type**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/transactions/type/EXPENSE`
- **URL:** `http://localhost:8080/api/transactions/type/INCOME`
- **Headers:** `Authorization: Bearer <your_jwt_token>`

#### **7. Get Transactions by Category**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/transactions/category/Food%20%26%20Dining`
- **Headers:** `Authorization: Bearer <your_jwt_token>`

#### **8. Get Transactions by Date Range**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/transactions/date-range?startDate=2025-10-01T00:00:00&endDate=2025-10-31T23:59:59`
- **Headers:** `Authorization: Bearer <your_jwt_token>`

#### **9. Get Financial Summary**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/transactions/summary`
- **Headers:** `Authorization: Bearer <your_jwt_token>`

#### **10. Get Monthly Financial Summary**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/transactions/summary/2025/10`
- **Headers:** `Authorization: Bearer <your_jwt_token>`

#### **11. Get Expense Breakdown**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/transactions/breakdown/expenses`
- **Headers:** `Authorization: Bearer <your_jwt_token>`

#### **12. Get Income Breakdown**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/transactions/breakdown/income`
- **Headers:** `Authorization: Bearer <your_jwt_token>`

#### **13. Get Recent Transactions**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/transactions/recent?limit=5`
- **Headers:** `Authorization: Bearer <your_jwt_token>`

#### **14. Get Transaction Statistics**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/transactions/statistics`
- **Headers:** `Authorization: Bearer <your_jwt_token>`

---

### **📂 Category Management**

#### **15. Get All Active Categories**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/categories`
- **Headers:** `Authorization: Bearer <your_jwt_token>`

#### **16. Get Categories by Type**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/categories/type/EXPENSE`
- **URL:** `http://localhost:8080/api/categories/type/INCOME`
- **Headers:** `Authorization: Bearer <your_jwt_token>`

#### **17. Get Income Categories**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/categories/income`
- **Headers:** `Authorization: Bearer <your_jwt_token>`

#### **18. Get Expense Categories**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/categories/expense`
- **Headers:** `Authorization: Bearer <your_jwt_token>`

#### **19. Get Category by ID**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/categories/{id}`
- **Headers:** `Authorization: Bearer <your_jwt_token>`

#### **20. Search Categories**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/categories/search?name=food`
- **Headers:** `Authorization: Bearer <your_jwt_token>`

#### **21. Create Category (Admin Only)**
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/categories`
- **Headers:** 
  - `Authorization: Bearer <admin_jwt_token>`
  - `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "name": "Custom Category",
  "description": "Custom category for specific expenses",
  "type": "EXPENSE",
  "iconName": "🔧",
  "colorCode": "#FF6B6B",
  "isActive": true
}
```

#### **22. Update Category (Admin Only)**
- **Method:** `PUT`
- **URL:** `http://localhost:8080/api/categories/{id}`
- **Headers:** 
  - `Authorization: Bearer <admin_jwt_token>`
  - `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "name": "Updated Custom Category",
  "description": "Updated description",
  "type": "EXPENSE",
  "iconName": "🔧",
  "colorCode": "#FF6B6B",
  "isActive": true
}
```

#### **23. Deactivate Category (Admin Only)**
- **Method:** `PATCH`
- **URL:** `http://localhost:8080/api/categories/{id}/deactivate`
- **Headers:** `Authorization: Bearer <admin_jwt_token>`

#### **24. Activate Category (Admin Only)**
- **Method:** `PATCH`
- **URL:** `http://localhost:8080/api/categories/{id}/activate`
- **Headers:** `Authorization: Bearer <admin_jwt_token>`

#### **25. Delete Category (Admin Only)**
- **Method:** `DELETE`
- **URL:** `http://localhost:8080/api/categories/{id}`
- **Headers:** `Authorization: Bearer <admin_jwt_token>`

#### **26. Get Category Statistics (Admin Only)**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/categories/statistics`
- **Headers:** `Authorization: Bearer <admin_jwt_token>`

#### **27. Initialize Default Categories (Admin Only)**
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/categories/initialize`
- **Headers:** `Authorization: Bearer <admin_jwt_token>`

---

## **🧪 Testing Scenarios**

### **Scenario 1: Basic Transaction Management**
1. Login as a user to get JWT token
2. Create an expense transaction
3. Create an income transaction
4. Get all transactions
5. Update a transaction
6. Delete a transaction

### **Scenario 2: Category Management**
1. Get all available categories
2. Get income categories only
3. Get expense categories only
4. Search for specific categories

### **Scenario 3: Financial Analytics**
1. Create multiple transactions of different types
2. Get financial summary
3. Get expense breakdown by category
4. Get income breakdown by category
5. Get monthly summary
6. Get transaction statistics

### **Scenario 4: Admin Category Management**
1. Login as admin to get admin JWT token
2. Create a new custom category
3. Update an existing category
4. Deactivate/Activate categories
5. Get category statistics
6. Initialize default categories

---

## **📊 Sample Transaction Data**

### **Income Transactions:**
```json
[
  {
    "title": "Monthly Salary",
    "description": "October 2025 salary",
    "amount": 5000.00,
    "type": "INCOME",
    "category": "Salary",
    "transactionDate": "2025-10-01T09:00:00"
  },
  {
    "title": "Freelance Project",
    "description": "Website development project",
    "amount": 1200.00,
    "type": "INCOME",
    "category": "Freelance",
    "transactionDate": "2025-10-01T15:30:00"
  }
]
```

### **Expense Transactions:**
```json
[
  {
    "title": "Grocery Shopping",
    "description": "Weekly groceries",
    "amount": 150.75,
    "type": "EXPENSE",
    "category": "Food & Dining",
    "transactionDate": "2025-10-02T10:30:00"
  },
  {
    "title": "Gas Station",
    "description": "Car fuel",
    "amount": 45.00,
    "type": "EXPENSE",
    "category": "Transportation",
    "transactionDate": "2025-10-02T08:15:00"
  },
  {
    "title": "Electricity Bill",
    "description": "Monthly electricity bill",
    "amount": 89.50,
    "type": "EXPENSE",
    "category": "Bills & Utilities",
    "transactionDate": "2025-10-01T16:00:00"
  }
]
```

---

## **🔑 Authentication Requirements**

- **User Endpoints:** Require valid JWT token with USER or ADMIN role
- **Admin Endpoints:** Require valid JWT token with ADMIN role only
- **Tokens:** Use the same authentication system from Phase 1

---

## **✅ Expected Response Formats**

### **Transaction Response:**
```json
{
  "id": 1,
  "title": "Grocery Shopping",
  "description": "Weekly grocery shopping",
  "amount": 150.75,
  "type": "EXPENSE",
  "category": "Food & Dining",
  "transactionDate": "2025-10-02T10:30:00",
  "createdAt": "2025-10-02T10:35:00",
  "updatedAt": "2025-10-02T10:35:00"
}
```

### **Financial Summary Response:**
```json
{
  "totalIncome": 6200.00,
  "totalExpenses": 285.25,
  "balance": 5914.75,
  "transactionCount": 5
}
```

### **Category Response:**
```json
{
  "id": 1,
  "name": "Food & Dining",
  "description": "Restaurants, groceries, food delivery",
  "type": "EXPENSE",
  "iconName": "🍽️",
  "colorCode": "#FF5722",
  "isActive": true,
  "createdAt": "2025-10-02T16:00:00",
  "updatedAt": "2025-10-02T16:00:00"
}
```

---

This completes the Phase 2 API testing guide. All endpoints maintain the existing UI while providing robust backend functionality for expense and income tracking.