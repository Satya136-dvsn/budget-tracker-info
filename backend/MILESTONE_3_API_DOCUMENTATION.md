# 📊 Milestone 3 API Documentation
## Budget and Savings Goals Module

**Date:** October 6, 2025  
**Version:** 1.0.0  
**Base URL:** `http://localhost:8080/api`

---

## 🎯 Overview

Milestone 3 introduces two major features:
1. **Monthly Budget Management** - Set and track spending limits by category
2. **Savings Goals** - Define and monitor progress towards financial goals

---

## 🔐 Authentication

All endpoints require JWT Bearer token authentication.

**Header Format:**
```
Authorization: Bearer <your-jwt-token>
```

---

## 📊 Budget Endpoints

### 1. Create Budget
**POST** `/budgets`

Create a new monthly budget for a specific category.

**Request Body:**
```json
{
  "category": "Food",
  "budgetAmount": 500.00,
  "month": 10,
  "year": 2025
}
```

**Validation Rules:**
- `category`: Required, max 100 characters
- `budgetAmount`: Required, min 0.01, max 8 digits + 2 decimals
- `month`: Required, 1-12
- `year`: Required, 2020-2100

**Success Response (201 Created):**
```json
{
  "id": 1,
  "category": "Food",
  "budgetAmount": 500.00,
  "spentAmount": 0.00,
  "remainingAmount": 500.00,
  "progressPercentage": 0.0,
  "isOverBudget": false,
  "month": 10,
  "year": 2025,
  "createdAt": "2025-10-06T10:00:00",
  "updatedAt": "2025-10-06T10:00:00"
}
```

**Error Response (400 Bad Request):**
```json
"Budget already exists for Food in October 2025"
```

---

### 2. Get All Budgets
**GET** `/budgets`

Get all budgets for the current user, sorted by year, month, and category.

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "category": "Food",
    "budgetAmount": 500.00,
    "spentAmount": 125.50,
    "remainingAmount": 374.50,
    "progressPercentage": 25.1,
    "isOverBudget": false,
    "month": 10,
    "year": 2025,
    "createdAt": "2025-10-06T10:00:00",
    "updatedAt": "2025-10-06T11:30:00"
  },
  ...
]
```

---

### 3. Get Budgets for Specific Month/Year
**GET** `/budgets/month/{month}/year/{year}`

Get all budgets for a specific month and year. Automatically updates spent amounts from transactions.

**Parameters:**
- `month`: Integer (1-12)
- `year`: Integer

**Example:** `GET /budgets/month/10/year/2025`

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "category": "Food",
    "budgetAmount": 500.00,
    "spentAmount": 125.50,
    "remainingAmount": 374.50,
    "progressPercentage": 25.1,
    "isOverBudget": false,
    "month": 10,
    "year": 2025,
    "createdAt": "2025-10-06T10:00:00",
    "updatedAt": "2025-10-06T11:30:00"
  }
]
```

---

### 4. Get Current Month Budgets
**GET** `/budgets/current-month`

Get all budgets for the current month. Automatically detects current month/year.

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "category": "Food",
    "budgetAmount": 500.00,
    "spentAmount": 125.50,
    "remainingAmount": 374.50,
    "progressPercentage": 25.1,
    "isOverBudget": false,
    "month": 10,
    "year": 2025,
    "createdAt": "2025-10-06T10:00:00",
    "updatedAt": "2025-10-06T11:30:00"
  }
]
```

---

### 5. Get Budget by ID
**GET** `/budgets/{id}`

Get a specific budget by ID. Updates spent amount before returning.

**Parameters:**
- `id`: Budget ID

**Example:** `GET /budgets/1`

**Success Response (200 OK):**
```json
{
  "id": 1,
  "category": "Food",
  "budgetAmount": 500.00,
  "spentAmount": 125.50,
  "remainingAmount": 374.50,
  "progressPercentage": 25.1,
  "isOverBudget": false,
  "month": 10,
  "year": 2025,
  "createdAt": "2025-10-06T10:00:00",
  "updatedAt": "2025-10-06T11:30:00"
}
```

**Error Response (404 Not Found):**
```
(Empty response)
```

---

### 6. Update Budget
**PUT** `/budgets/{id}`

Update an existing budget.

**Parameters:**
- `id`: Budget ID

**Request Body:**
```json
{
  "category": "Food",
  "budgetAmount": 600.00,
  "month": 10,
  "year": 2025
}
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "category": "Food",
  "budgetAmount": 600.00,
  "spentAmount": 125.50,
  "remainingAmount": 474.50,
  "progressPercentage": 20.92,
  "isOverBudget": false,
  "month": 10,
  "year": 2025,
  "createdAt": "2025-10-06T10:00:00",
  "updatedAt": "2025-10-06T12:00:00"
}
```

**Error Response (400 Bad Request):**
```json
"Budget not found"
```

---

### 7. Delete Budget
**DELETE** `/budgets/{id}`

Delete a budget.

**Parameters:**
- `id`: Budget ID

**Success Response (200 OK):**
```json
"Budget deleted successfully"
```

**Error Response (400 Bad Request):**
```json
"Budget not found"
```

---

### 8. Recalculate All Budgets
**POST** `/budgets/recalculate`

Recalculate spent amounts for all user's budgets based on transactions. Useful after creating/deleting transactions.

**Success Response (200 OK):**
```json
"All budgets recalculated successfully"
```

---

## 🎯 Savings Goals Endpoints

### 1. Create Savings Goal
**POST** `/savings-goals`

Create a new savings goal.

**Request Body:**
```json
{
  "name": "Emergency Fund",
  "description": "Build 6 months of expenses",
  "targetAmount": 10000.00,
  "targetDate": "2026-06-01"
}
```

**Validation Rules:**
- `name`: Required, max 255 characters
- `description`: Optional, max 1000 characters
- `targetAmount`: Required, min 0.01, max 10 digits + 2 decimals
- `targetDate`: Optional, format: YYYY-MM-DD

**Success Response (201 Created):**
```json
{
  "id": 1,
  "name": "Emergency Fund",
  "description": "Build 6 months of expenses",
  "targetAmount": 10000.00,
  "currentAmount": 0.00,
  "remainingAmount": 10000.00,
  "progressPercentage": 0.0,
  "targetDate": "2026-06-01",
  "daysRemaining": 239,
  "status": "IN_PROGRESS",
  "isCompleted": false,
  "createdAt": "2025-10-06T10:00:00",
  "updatedAt": "2025-10-06T10:00:00",
  "completedAt": null
}
```

---

### 2. Get All Savings Goals
**GET** `/savings-goals`

Get all savings goals for the current user.

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Emergency Fund",
    "description": "Build 6 months of expenses",
    "targetAmount": 10000.00,
    "currentAmount": 2500.00,
    "remainingAmount": 7500.00,
    "progressPercentage": 25.0,
    "targetDate": "2026-06-01",
    "daysRemaining": 239,
    "status": "IN_PROGRESS",
    "isCompleted": false,
    "createdAt": "2025-10-06T10:00:00",
    "updatedAt": "2025-10-06T11:30:00",
    "completedAt": null
  },
  ...
]
```

---

### 3. Get Active Savings Goals
**GET** `/savings-goals/active`

Get only active (IN_PROGRESS) savings goals.

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Emergency Fund",
    "description": "Build 6 months of expenses",
    "targetAmount": 10000.00,
    "currentAmount": 2500.00,
    "remainingAmount": 7500.00,
    "progressPercentage": 25.0,
    "targetDate": "2026-06-01",
    "daysRemaining": 239,
    "status": "IN_PROGRESS",
    "isCompleted": false,
    "createdAt": "2025-10-06T10:00:00",
    "updatedAt": "2025-10-06T11:30:00",
    "completedAt": null
  }
]
```

---

### 4. Get Savings Goals by Status
**GET** `/savings-goals/status/{status}`

Get savings goals filtered by status.

**Parameters:**
- `status`: One of `IN_PROGRESS`, `COMPLETED`, `CANCELLED`

**Example:** `GET /savings-goals/status/COMPLETED`

**Success Response (200 OK):**
```json
[
  {
    "id": 2,
    "name": "Vacation",
    "description": "Trip to Europe",
    "targetAmount": 3000.00,
    "currentAmount": 3000.00,
    "remainingAmount": 0.00,
    "progressPercentage": 100.0,
    "targetDate": "2025-12-31",
    "daysRemaining": 86,
    "status": "COMPLETED",
    "isCompleted": true,
    "createdAt": "2025-08-01T10:00:00",
    "updatedAt": "2025-10-05T15:00:00",
    "completedAt": "2025-10-05T15:00:00"
  }
]
```

**Error Response (400 Bad Request):**
```json
"Invalid status: INVALID_STATUS"
```

---

### 5. Get Savings Goal by ID
**GET** `/savings-goals/{id}`

Get a specific savings goal by ID.

**Parameters:**
- `id`: Savings Goal ID

**Example:** `GET /savings-goals/1`

**Success Response (200 OK):**
```json
{
  "id": 1,
  "name": "Emergency Fund",
  "description": "Build 6 months of expenses",
  "targetAmount": 10000.00,
  "currentAmount": 2500.00,
  "remainingAmount": 7500.00,
  "progressPercentage": 25.0,
  "targetDate": "2026-06-01",
  "daysRemaining": 239,
  "status": "IN_PROGRESS",
  "isCompleted": false,
  "createdAt": "2025-10-06T10:00:00",
  "updatedAt": "2025-10-06T11:30:00",
  "completedAt": null
}
```

**Error Response (404 Not Found):**
```
(Empty response)
```

---

### 6. Update Savings Goal
**PUT** `/savings-goals/{id}`

Update savings goal details (name, description, target amount, target date).

**Parameters:**
- `id`: Savings Goal ID

**Request Body:**
```json
{
  "name": "Emergency Fund - Updated",
  "description": "Build 1 year of expenses",
  "targetAmount": 20000.00,
  "targetDate": "2027-01-01"
}
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "name": "Emergency Fund - Updated",
  "description": "Build 1 year of expenses",
  "targetAmount": 20000.00,
  "currentAmount": 2500.00,
  "remainingAmount": 17500.00,
  "progressPercentage": 12.5,
  "targetDate": "2027-01-01",
  "daysRemaining": 452,
  "status": "IN_PROGRESS",
  "isCompleted": false,
  "createdAt": "2025-10-06T10:00:00",
  "updatedAt": "2025-10-06T12:00:00",
  "completedAt": null
}
```

---

### 7. Update Savings Goal Progress
**PATCH** `/savings-goals/{id}/progress`

Add or subtract from the current amount (incremental change).

**Parameters:**
- `id`: Savings Goal ID

**Request Body:**
```json
{
  "amount": 500.00
}
```

**Note:** Use negative values to subtract (e.g., `-100.00`)

**Success Response (200 OK):**
```json
{
  "id": 1,
  "name": "Emergency Fund",
  "description": "Build 6 months of expenses",
  "targetAmount": 10000.00,
  "currentAmount": 3000.00,
  "remainingAmount": 7000.00,
  "progressPercentage": 30.0,
  "targetDate": "2026-06-01",
  "daysRemaining": 239,
  "status": "IN_PROGRESS",
  "isCompleted": false,
  "createdAt": "2025-10-06T10:00:00",
  "updatedAt": "2025-10-06T12:30:00",
  "completedAt": null
}
```

**Error Response (400 Bad Request):**
```json
"Current amount cannot be negative"
```

---

### 8. Set Savings Goal Amount
**PATCH** `/savings-goals/{id}/amount`

Set the current amount directly (absolute value).

**Parameters:**
- `id`: Savings Goal ID

**Request Body:**
```json
{
  "currentAmount": 5000.00
}
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "name": "Emergency Fund",
  "description": "Build 6 months of expenses",
  "targetAmount": 10000.00,
  "currentAmount": 5000.00,
  "remainingAmount": 5000.00,
  "progressPercentage": 50.0,
  "targetDate": "2026-06-01",
  "daysRemaining": 239,
  "status": "IN_PROGRESS",
  "isCompleted": false,
  "createdAt": "2025-10-06T10:00:00",
  "updatedAt": "2025-10-06T13:00:00",
  "completedAt": null
}
```

---

### 9. Complete Savings Goal
**PATCH** `/savings-goals/{id}/complete`

Mark a savings goal as completed.

**Parameters:**
- `id`: Savings Goal ID

**Success Response (200 OK):**
```json
{
  "id": 1,
  "name": "Emergency Fund",
  "description": "Build 6 months of expenses",
  "targetAmount": 10000.00,
  "currentAmount": 10000.00,
  "remainingAmount": 0.00,
  "progressPercentage": 100.0,
  "targetDate": "2026-06-01",
  "daysRemaining": 239,
  "status": "COMPLETED",
  "isCompleted": true,
  "createdAt": "2025-10-06T10:00:00",
  "updatedAt": "2025-10-06T14:00:00",
  "completedAt": "2025-10-06T14:00:00"
}
```

---

### 10. Cancel Savings Goal
**PATCH** `/savings-goals/{id}/cancel`

Mark a savings goal as cancelled.

**Parameters:**
- `id`: Savings Goal ID

**Success Response (200 OK):**
```json
{
  "id": 1,
  "name": "Emergency Fund",
  "description": "Build 6 months of expenses",
  "targetAmount": 10000.00,
  "currentAmount": 2500.00,
  "remainingAmount": 7500.00,
  "progressPercentage": 25.0,
  "targetDate": "2026-06-01",
  "daysRemaining": 239,
  "status": "CANCELLED",
  "isCompleted": false,
  "createdAt": "2025-10-06T10:00:00",
  "updatedAt": "2025-10-06T14:30:00",
  "completedAt": null
}
```

---

### 11. Reopen Savings Goal
**PATCH** `/savings-goals/{id}/reopen`

Reopen a completed or cancelled savings goal (set status back to IN_PROGRESS).

**Parameters:**
- `id`: Savings Goal ID

**Success Response (200 OK):**
```json
{
  "id": 1,
  "name": "Emergency Fund",
  "description": "Build 6 months of expenses",
  "targetAmount": 10000.00,
  "currentAmount": 2500.00,
  "remainingAmount": 7500.00,
  "progressPercentage": 25.0,
  "targetDate": "2026-06-01",
  "daysRemaining": 239,
  "status": "IN_PROGRESS",
  "isCompleted": false,
  "createdAt": "2025-10-06T10:00:00",
  "updatedAt": "2025-10-06T15:00:00",
  "completedAt": null
}
```

---

### 12. Delete Savings Goal
**DELETE** `/savings-goals/{id}`

Delete a savings goal permanently.

**Parameters:**
- `id`: Savings Goal ID

**Success Response (200 OK):**
```json
"Savings goal deleted successfully"
```

**Error Response (400 Bad Request):**
```json
"Savings goal not found"
```

---

## 📋 Database Schema

### Budgets Table
```sql
CREATE TABLE budgets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    category VARCHAR(100) NOT NULL,
    budget_amount DECIMAL(10, 2) NOT NULL,
    spent_amount DECIMAL(10, 2) DEFAULT 0.00,
    month INT NOT NULL,
    year INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_budget (user_id, category, month, year)
);
```

### Savings Goals Table
```sql
CREATE TABLE savings_goals (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    target_amount DECIMAL(10, 2) NOT NULL,
    current_amount DECIMAL(10, 2) DEFAULT 0.00,
    target_date DATE,
    status VARCHAR(20) DEFAULT 'IN_PROGRESS',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🎯 Features Summary

### Budget Features
- ✅ Create monthly budgets by category
- ✅ Auto-calculate spent amount from transactions
- ✅ Track budget progress (percentage used)
- ✅ Identify over-budget categories
- ✅ View budgets by month/year
- ✅ Update and delete budgets
- ✅ Recalculate all budgets

### Savings Goals Features
- ✅ Create savings goals with target amounts and dates
- ✅ Track progress towards goals
- ✅ Add/withdraw funds incrementally
- ✅ Set amounts directly
- ✅ Mark goals as completed/cancelled
- ✅ Reopen completed/cancelled goals
- ✅ Filter goals by status
- ✅ Calculate days remaining until target date
- ✅ Automatic completion when target reached

---

## 🔄 Workflow Examples

### Budget Workflow
1. User creates monthly budget for "Food" category: $500
2. User creates transactions in "Food" category
3. System automatically calculates spent amount
4. Budget shows: $500 budget, $125.50 spent, $374.50 remaining, 25.1% progress
5. User can update budget amount or delete budget

### Savings Goal Workflow
1. User creates goal: "Emergency Fund", target $10,000 by June 2026
2. User adds $500 to goal (progress: 5%)
3. User adds another $2,000 (progress: 25%)
4. User sets current amount directly to $5,000 (progress: 50%)
5. When current amount >= target amount, goal is automatically marked complete
6. User can manually mark goal as complete, cancel, or reopen

---

## 📱 Frontend Components

### Budget Component
**Location:** `/frontend/src/components/Budget/Budget.jsx`
- Month/Year selector
- Budget summary cards (Total Budget, Total Spent, Remaining)
- Budget list with progress bars
- Create/Edit modal
- Color-coded progress (green <80%, orange 80-100%, red >100%)

### Savings Goals Component
**Location:** `/frontend/src/components/SavingsGoals/SavingsGoals.jsx`
- Filter tabs (All, Active, Completed)
- Summary cards (Total Target, Total Saved, Overall Progress)
- Goal cards with progress bars
- Add/Withdraw funds buttons
- Complete/Cancel/Reopen actions
- Days remaining indicator

---

## 🚀 Testing

### Manual Testing Steps

#### Budget Testing:
1. Create budget for current month
2. Create transactions in same category
3. Verify spent amount auto-calculates
4. Test month/year filtering
5. Test budget update and delete
6. Test recalculate endpoint

#### Savings Goals Testing:
1. Create new goal with target date
2. Add funds using progress endpoint
3. Verify progress percentage updates
4. Test set amount endpoint
5. Test complete/cancel/reopen actions
6. Test status filtering

---

## 📈 Next Steps (Milestone 4)

After completing Milestone 3, proceed to:
- **Milestone 4:** Charts and Analytics
  - Line charts for financial trends
  - Pie charts for expense breakdown
  - Bar charts for monthly comparison
  - Interactive data visualization

---

**Documentation Version:** 1.0.0  
**Last Updated:** October 6, 2025  
**Author:** Budget Tracker Development Team
