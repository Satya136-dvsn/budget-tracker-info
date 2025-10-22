# 🚀 Milestone 3 Quick Setup Guide

## Prerequisites
- Backend server (Spring Boot) running on port 8080
- Frontend server (Vite) running on port 5173
- MySQL database configured
- User authenticated with JWT token

---

## Step 1: Database Setup

Run the SQL migration script:

```bash
mysql -u root -p budget_tracker < backend/milestone3_database_setup.sql
```

Or manually execute in MySQL Workbench/CLI:

```sql
-- Copy and paste the contents of:
-- backend/milestone3_database_setup.sql
```

**Verify tables created:**
```sql
SHOW TABLES;
-- Should see: budgets, savings_goals
```

---

## Step 2: Backend Setup

The backend code is already created. Just rebuild and restart:

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**Verify backend is running:**
- Open: http://localhost:8080/health
- Should see: `{"status": "UP"}`

---

## Step 3: Frontend Routing Setup

**Edit `frontend/src/App.jsx`:**

Add imports at the top:
```jsx
import Budget from './components/Budget/Budget';
import SavingsGoals from './components/SavingsGoals/SavingsGoals';
```

Add routes inside `<Routes>`:
```jsx
<Route path="/budget" element={<Budget />} />
<Route path="/savings-goals" element={<SavingsGoals />} />
```

**Edit `frontend/src/components/Layout/Navbar.jsx`:**

Add navigation links:
```jsx
<Link to="/budget" className="nav-link">
  <i className="fas fa-chart-pie"></i> Budget
</Link>
<Link to="/savings-goals" className="nav-link">
  <i className="fas fa-piggy-bank"></i> Savings Goals
</Link>
```

---

## Step 4: Start Frontend

```bash
cd frontend
npm run dev
```

**Verify frontend is running:**
- Open: http://localhost:5173
- Should see the application

---

## Step 5: Test Budget Feature

1. Login to the application
2. Navigate to `/budget` or click "Budget" in navbar
3. Click "+ New Budget" button
4. Fill in the form:
   - Category: Select "Food"
   - Budget Amount: 500
   - Month: October (10)
   - Year: 2025
5. Click "Create Budget"
6. You should see the budget card with $0.00 spent

**Test with Transactions:**
1. Go to Dashboard or Transactions page
2. Create a new EXPENSE transaction:
   - Title: "Groceries"
   - Amount: $125.50
   - Category: "Food"
   - Date: October 2025
3. Go back to Budget page
4. Refresh or select October 2025 again
5. You should see:
   - Budget: $500.00
   - Spent: $125.50
   - Remaining: $374.50
   - Progress: 25.1%

---

## Step 6: Test Savings Goals Feature

1. Navigate to `/savings-goals` or click "Savings Goals" in navbar
2. Click "+ New Goal" button
3. Fill in the form:
   - Goal Name: "Emergency Fund"
   - Description: "Build 6 months of expenses"
   - Target Amount: 10000
   - Target Date: 2026-06-01
4. Click "Create Goal"
5. You should see the goal card with 0% progress

**Test Adding Funds:**
1. Click the "+" icon (Add Funds) on the goal card
2. Enter amount: 2500
3. Click OK
4. You should see:
   - Current: $2,500.00
   - Target: $10,000.00
   - Remaining: $7,500.00
   - Progress: 25.0%
   - Days remaining: ~239 days

---

## Step 7: Test Additional Features

### Budget Features to Test:
- ✅ Month/Year filtering
- ✅ Edit budget (click edit icon)
- ✅ Delete budget (click trash icon)
- ✅ View summary cards (Total Budget, Spent, Remaining)
- ✅ Over-budget indicator (create transactions > budget amount)

### Savings Goals Features to Test:
- ✅ Filter tabs (All, Active, Completed)
- ✅ Add funds (+ icon)
- ✅ Withdraw funds (- icon)
- ✅ Mark as complete (✓ icon)
- ✅ Edit goal (edit icon)
- ✅ Delete goal (trash icon)

---

## 🔍 Troubleshooting

### Backend Issues

**Problem:** Tables not created
```sql
-- Check if tables exist:
SHOW TABLES LIKE '%budget%';
SHOW TABLES LIKE '%savings%';

-- If not, manually create them using milestone3_database_setup.sql
```

**Problem:** 401 Unauthorized errors
- Ensure you're logged in
- Check browser console for token
- Verify Authorization header in Network tab

**Problem:** 404 Not Found for API endpoints
- Verify backend is running on port 8080
- Check backend console for startup errors
- Verify endpoints: http://localhost:8080/api/budgets

### Frontend Issues

**Problem:** Components not showing
- Verify routes are added to App.jsx
- Check browser console for import errors
- Verify component files are in correct location

**Problem:** API calls failing
- Check browser console Network tab
- Verify API_BASE_URL in api.js: `http://localhost:8080`
- Verify CORS is configured in backend SecurityConfig

**Problem:** Styles not loading
- Verify CSS files are imported in component files
- Check for CSS syntax errors
- Clear browser cache

---

## 🧪 API Testing with Postman

### Test Budget Creation

**POST** `http://localhost:8080/api/budgets`

Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

Body:
```json
{
  "category": "Food",
  "budgetAmount": 500.00,
  "month": 10,
  "year": 2025
}
```

### Test Get Current Month Budgets

**GET** `http://localhost:8080/api/budgets/current-month`

Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Test Create Savings Goal

**POST** `http://localhost:8080/api/savings-goals`

Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

Body:
```json
{
  "name": "Emergency Fund",
  "description": "Build 6 months of expenses",
  "targetAmount": 10000.00,
  "targetDate": "2026-06-01"
}
```

### Test Add Funds to Goal

**PATCH** `http://localhost:8080/api/savings-goals/1/progress`

Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

Body:
```json
{
  "amount": 500.00
}
```

---

## 📋 Checklist

Before considering setup complete, verify:

### Backend
- [ ] Database tables created (budgets, savings_goals)
- [ ] Backend server running on port 8080
- [ ] Health check endpoint working
- [ ] Budget endpoints responding (20 total)

### Frontend
- [ ] Routes added to App.jsx
- [ ] Navigation links added to Navbar
- [ ] Budget component loads at `/budget`
- [ ] Savings Goals component loads at `/savings-goals`
- [ ] Components styled correctly

### Integration
- [ ] Can create budget
- [ ] Budget shows transactions correctly
- [ ] Can create savings goal
- [ ] Can add funds to goal
- [ ] All CRUD operations work
- [ ] Auth token is sent with requests

---

## 🎯 Quick Test Script

Run these steps in order to verify everything works:

1. ✅ Login to application
2. ✅ Go to Budget page
3. ✅ Create budget: Food, $500, October 2025
4. ✅ Create transaction: Groceries, $125.50, Food, EXPENSE
5. ✅ Return to Budget page - verify spent amount shows
6. ✅ Go to Savings Goals page
7. ✅ Create goal: Emergency Fund, $10,000, June 2026
8. ✅ Add $2,500 to goal - verify progress updates
9. ✅ Test all filter tabs
10. ✅ Test edit and delete functions

If all steps work, Milestone 3 is fully operational! 🎉

---

## 📞 Need Help?

1. Check API documentation: `MILESTONE_3_API_DOCUMENTATION.md`
2. Check implementation summary: `MILESTONE_3_IMPLEMENTATION_SUMMARY.md`
3. Review backend logs for errors
4. Check browser console for frontend errors
5. Test API endpoints with Postman first

---

**Setup Time:** ~15 minutes  
**Last Updated:** October 6, 2025  
**Version:** 1.0.0
