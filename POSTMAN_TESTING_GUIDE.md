# 🧪 Postman Testing Guide - Milestone 3

## 📋 Prerequisites

1. **Backend must be running**: `mvn spring-boot:run` in the backend folder
2. **Database must have the new tables**: Run `backend/milestone3_database_setup.sql`
3. **Postman installed**: Download from https://www.postman.com/downloads/
4. **Valid JWT token**: Login first to get authentication token

---

## 🔐 Step 1: Authentication (Get JWT Token)

### Login Request
```
Method: POST
URL: http://localhost:8080/api/auth/login
Headers:
  Content-Type: application/json
Body (raw JSON):
{
  "username": "testuser1",
  "password": "password123"
}
```

**Response Example:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "testuser1",
  "role": "USER"
}
```

**Important:** Copy the `token` value and use it in all subsequent requests!

---

## 💰 Budget API Testing

### 1️⃣ Create a Budget

```
Method: POST
URL: http://localhost:8080/api/budgets
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_TOKEN_HERE
Body (raw JSON):
{
  "category": "Food & Dining",
  "budgetAmount": 500.00,
  "month": 1,
  "year": 2025
}
```

**Expected Response (201 Created):**
```json
{
  "id": 1,
  "category": "Food & Dining",
  "budgetAmount": 500.00,
  "spentAmount": 0.00,
  "remainingAmount": 500.00,
  "progressPercentage": 0.0,
  "month": 1,
  "year": 2025,
  "overBudget": false,
  "createdAt": "2025-01-07T10:30:00",
  "updatedAt": "2025-01-07T10:30:00"
}
```

### 2️⃣ Get All Budgets

```
Method: GET
URL: http://localhost:8080/api/budgets
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "category": "Food & Dining",
    "budgetAmount": 500.00,
    "spentAmount": 150.00,
    "remainingAmount": 350.00,
    "progressPercentage": 30.0,
    "month": 1,
    "year": 2025,
    "overBudget": false,
    "createdAt": "2025-01-07T10:30:00",
    "updatedAt": "2025-01-07T10:35:00"
  }
]
```

### 3️⃣ Get Current Month Budgets

```
Method: GET
URL: http://localhost:8080/api/budgets/current-month
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200 OK):**
Returns budgets for current month and year automatically.

### 4️⃣ Get Budgets for Specific Month/Year

```
Method: GET
URL: http://localhost:8080/api/budgets/month/1/year/2025
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200 OK):**
Returns all budgets for January 2025.

### 5️⃣ Get Budget by ID

```
Method: GET
URL: http://localhost:8080/api/budgets/1
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200 OK):**
Returns single budget with ID 1.

### 6️⃣ Update a Budget

```
Method: PUT
URL: http://localhost:8080/api/budgets/1
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_TOKEN_HERE
Body (raw JSON):
{
  "category": "Food & Dining",
  "budgetAmount": 600.00,
  "month": 1,
  "year": 2025
}
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "category": "Food & Dining",
  "budgetAmount": 600.00,
  "spentAmount": 150.00,
  "remainingAmount": 450.00,
  "progressPercentage": 25.0,
  "month": 1,
  "year": 2025,
  "overBudget": false,
  "createdAt": "2025-01-07T10:30:00",
  "updatedAt": "2025-01-07T11:00:00"
}
```

### 7️⃣ Recalculate All Budgets

```
Method: POST
URL: http://localhost:8080/api/budgets/recalculate
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
{
  "message": "All budgets recalculated successfully",
  "count": 5
}
```

### 8️⃣ Delete a Budget

```
Method: DELETE
URL: http://localhost:8080/api/budgets/1
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (204 No Content)**

---

## 🎯 Savings Goals API Testing

### 1️⃣ Create a Savings Goal

```
Method: POST
URL: http://localhost:8080/api/savings-goals
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_TOKEN_HERE
Body (raw JSON):
{
  "name": "Emergency Fund",
  "description": "Build 6 months of expenses",
  "targetAmount": 10000.00,
  "targetDate": "2025-12-31"
}
```

**Expected Response (201 Created):**
```json
{
  "id": 1,
  "name": "Emergency Fund",
  "description": "Build 6 months of expenses",
  "targetAmount": 10000.00,
  "currentAmount": 0.00,
  "remainingAmount": 10000.00,
  "progressPercentage": 0.0,
  "targetDate": "2025-12-31",
  "daysRemaining": 358,
  "status": "IN_PROGRESS",
  "completed": false,
  "completedAt": null,
  "createdAt": "2025-01-07T10:30:00",
  "updatedAt": "2025-01-07T10:30:00"
}
```

### 2️⃣ Get All Savings Goals

```
Method: GET
URL: http://localhost:8080/api/savings-goals
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200 OK):**
Returns array of all savings goals for the authenticated user.

### 3️⃣ Get Active Savings Goals Only

```
Method: GET
URL: http://localhost:8080/api/savings-goals/active
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200 OK):**
Returns only goals with status = "IN_PROGRESS".

### 4️⃣ Get Savings Goals by Status

```
Method: GET
URL: http://localhost:8080/api/savings-goals/status/COMPLETED
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```

**Status values:** IN_PROGRESS, COMPLETED, CANCELLED

**Expected Response (200 OK):**
Returns goals filtered by status.

### 5️⃣ Get Savings Goal by ID

```
Method: GET
URL: http://localhost:8080/api/savings-goals/1
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200 OK):**
Returns single savings goal.

### 6️⃣ Update a Savings Goal

```
Method: PUT
URL: http://localhost:8080/api/savings-goals/1
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_TOKEN_HERE
Body (raw JSON):
{
  "name": "Emergency Fund",
  "description": "Updated: Build 12 months of expenses",
  "targetAmount": 15000.00,
  "targetDate": "2025-12-31"
}
```

**Expected Response (200 OK):**
Returns updated savings goal.

### 7️⃣ Update Progress (Add/Subtract Funds)

```
Method: PATCH
URL: http://localhost:8080/api/savings-goals/1/progress
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_TOKEN_HERE
Body (raw JSON):
{
  "amount": 500.00
}
```

**Note:** Use positive values to add funds, negative to subtract.

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "name": "Emergency Fund",
  "currentAmount": 500.00,
  "progressPercentage": 5.0,
  "remainingAmount": 9500.00,
  ...
}
```

### 8️⃣ Set Current Amount (Absolute Value)

```
Method: PATCH
URL: http://localhost:8080/api/savings-goals/1/amount
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_TOKEN_HERE
Body (raw JSON):
{
  "amount": 2500.00
}
```

**Expected Response (200 OK):**
Sets currentAmount to exactly 2500.00.

### 9️⃣ Complete a Savings Goal

```
Method: PATCH
URL: http://localhost:8080/api/savings-goals/1/complete
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "status": "COMPLETED",
  "completed": true,
  "completedAt": "2025-01-07T11:30:00",
  ...
}
```

### 🔟 Cancel a Savings Goal

```
Method: PATCH
URL: http://localhost:8080/api/savings-goals/1/cancel
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "status": "CANCELLED",
  ...
}
```

### 1️⃣1️⃣ Reopen a Savings Goal

```
Method: PATCH
URL: http://localhost:8080/api/savings-goals/1/reopen
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "status": "IN_PROGRESS",
  "completed": false,
  "completedAt": null,
  ...
}
```

### 1️⃣2️⃣ Delete a Savings Goal

```
Method: DELETE
URL: http://localhost:8080/api/savings-goals/1
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (204 No Content)**

---

## 🧪 Complete Testing Workflow

### Test Scenario 1: Budget Auto-Calculation

1. **Create a budget** for "Food & Dining" - $500 for January 2025
2. **Create transactions** (EXPENSE type) with "Food & Dining" category:
   ```
   POST http://localhost:8080/api/transactions
   {
     "title": "Grocery Shopping",
     "amount": 150.00,
     "type": "EXPENSE",
     "category": "Food & Dining",
     "date": "2025-01-05",
     "description": "Weekly groceries"
   }
   ```
3. **Recalculate budgets**: `POST /api/budgets/recalculate`
4. **Get current month budgets**: `GET /api/budgets/current-month`
5. **Verify**: `spentAmount` should be 150.00, `progressPercentage` = 30%

### Test Scenario 2: Savings Goal Lifecycle

1. **Create a savings goal** - "Vacation Fund" - $5000 target
2. **Add funds**: PATCH `/savings-goals/1/progress` with amount: 1000.00
3. **Check progress**: GET `/savings-goals/1` - should show 20% progress
4. **Add more funds**: PATCH `/savings-goals/1/progress` with amount: 4000.00
5. **Check status**: Should auto-complete when reaching $5000
6. **Get completed goals**: GET `/savings-goals/status/COMPLETED`

### Test Scenario 3: Over-Budget Detection

1. **Create budget**: "Entertainment" - $200 for January 2025
2. **Create expenses** totaling $250 in "Entertainment" category
3. **Recalculate**: POST `/api/budgets/recalculate`
4. **Get budget**: Should show `overBudget: true`, `progressPercentage: 125%`

---

## 🚨 Common Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Full authentication is required"
}
```
**Fix:** Add valid JWT token in Authorization header.

### 404 Not Found
```json
{
  "error": "Budget not found with id: 99"
}
```
**Fix:** Use valid ID that exists in database.

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": {
    "budgetAmount": "Budget amount must be at least 0.01",
    "month": "Month must be between 1 and 12"
  }
}
```
**Fix:** Check validation rules in request body.

### 409 Conflict
```json
{
  "error": "Budget already exists for this category, month, and year"
}
```
**Fix:** Update existing budget instead of creating duplicate.

---

## 📊 Postman Collection Setup

### Create New Collection
1. Open Postman
2. Click **New** → **Collection**
3. Name it "Budget Tracker - Milestone 3"

### Create Environment
1. Click **Environments** → **Create Environment**
2. Name it "Budget Tracker Local"
3. Add variables:
   - `baseUrl`: `http://localhost:8080`
   - `token`: (leave empty, will be set after login)

### Add Requests
For each API endpoint above:
1. Create new request in the collection
2. Set method, URL using `{{baseUrl}}`
3. Add headers using `{{token}}` variable
4. Add body if needed
5. Save with descriptive name

### Auto-Set Token After Login
In the Login request, add this to **Tests** tab:
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
    console.log("Token saved:", jsonData.token);
}
```

Now the token will be automatically saved after successful login!

---

## ✅ Testing Checklist

### Budget Endpoints (8 total)
- [ ] POST `/api/budgets` - Create budget
- [ ] GET `/api/budgets` - Get all budgets
- [ ] GET `/api/budgets/current-month` - Current month budgets
- [ ] GET `/api/budgets/month/{month}/year/{year}` - Specific month
- [ ] GET `/api/budgets/{id}` - Get by ID
- [ ] PUT `/api/budgets/{id}` - Update budget
- [ ] POST `/api/budgets/recalculate` - Recalculate all
- [ ] DELETE `/api/budgets/{id}` - Delete budget

### Savings Goals Endpoints (12 total)
- [ ] POST `/api/savings-goals` - Create goal
- [ ] GET `/api/savings-goals` - Get all goals
- [ ] GET `/api/savings-goals/active` - Active goals only
- [ ] GET `/api/savings-goals/status/{status}` - Filter by status
- [ ] GET `/api/savings-goals/{id}` - Get by ID
- [ ] PUT `/api/savings-goals/{id}` - Update goal
- [ ] PATCH `/api/savings-goals/{id}/progress` - Add/subtract funds
- [ ] PATCH `/api/savings-goals/{id}/amount` - Set absolute amount
- [ ] PATCH `/api/savings-goals/{id}/complete` - Mark complete
- [ ] PATCH `/api/savings-goals/{id}/cancel` - Mark cancelled
- [ ] PATCH `/api/savings-goals/{id}/reopen` - Reopen goal
- [ ] DELETE `/api/savings-goals/{id}` - Delete goal

### Integration Tests
- [ ] Budget auto-calculation from transactions
- [ ] Savings goal auto-completion
- [ ] Over-budget detection
- [ ] Status transitions (IN_PROGRESS → COMPLETED → CANCELLED)
- [ ] Validation errors
- [ ] Unauthorized access attempts

---

## 🎯 Expected Results Summary

All 20 endpoints should:
- ✅ Return proper HTTP status codes (200, 201, 204, 400, 401, 404)
- ✅ Require authentication (401 without token)
- ✅ Return properly formatted JSON responses
- ✅ Validate input data
- ✅ Handle errors gracefully
- ✅ Calculate fields correctly (progress, remaining, etc.)
- ✅ Maintain data integrity

---

**Happy Testing!** 🧪

If you encounter any issues, check:
1. Backend is running (`mvn spring-boot:run`)
2. Database tables exist (run migration script)
3. JWT token is valid (not expired)
4. Request body matches expected format
5. Database has required data (users, categories, transactions)
