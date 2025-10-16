# 🚀 Quick Start Guide - Testing Milestone 3

## ✅ What's Been Done

- ✅ **All code pushed to GitHub** (commit: f27754d)
- ✅ **All servers killed** (Java and Node processes stopped)
- ✅ **Postman testing guide created** (POSTMAN_TESTING_GUIDE.md)
- ✅ **6,421 lines of code** committed (25 files)

## 📋 Before You Start Testing

### 1. Database Setup (REQUIRED!)
```bash
# Run this SQL script to create the new tables
mysql -u root -p budget_tracker < backend/milestone3_database_setup.sql
```

**This creates:**
- `budgets` table
- `savings_goals` table

### 2. Start Backend Server
```bash
cd backend
mvn spring-boot:run
```

**Wait for:** "Started BudgetTrackerBackendApplication in X seconds"

### 3. Open Postman
Download from: https://www.postman.com/downloads/

---

## 🔥 Quick Postman Test (5 Minutes)

### Step 1: Login to Get Token
```
POST http://localhost:8080/api/auth/login
Body (JSON):
{
  "username": "testuser1",
  "password": "password123"
}
```
**Copy the `token` from response!**

### Step 2: Create a Budget
```
POST http://localhost:8080/api/budgets
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
Body (JSON):
{
  "category": "Food & Dining",
  "budgetAmount": 500.00,
  "month": 1,
  "year": 2025
}
```
**Expected:** 201 Created with budget details

### Step 3: Get All Budgets
```
GET http://localhost:8080/api/budgets
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```
**Expected:** Array with your budget

### Step 4: Create a Savings Goal
```
POST http://localhost:8080/api/savings-goals
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
Body (JSON):
{
  "name": "Emergency Fund",
  "targetAmount": 10000.00,
  "targetDate": "2025-12-31"
}
```
**Expected:** 201 Created with goal details

### Step 5: Add Funds to Goal
```
PATCH http://localhost:8080/api/savings-goals/1/progress
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
Body (JSON):
{
  "amount": 1000.00
}
```
**Expected:** Goal with currentAmount = 1000, progressPercentage = 10%

---

## 📚 Complete Documentation

1. **POSTMAN_TESTING_GUIDE.md** - Full Postman guide with all 20 endpoints
2. **MILESTONE_3_API_DOCUMENTATION.md** - Complete API reference
3. **MILESTONE_3_SETUP_GUIDE.md** - Setup and testing procedures
4. **MILESTONE_3_IMPLEMENTATION_SUMMARY.md** - What was built

---

## 🎯 All 20 API Endpoints

### Budget APIs (8 endpoints)
1. `POST /api/budgets` - Create
2. `GET /api/budgets` - Get all
3. `GET /api/budgets/current-month` - Current month
4. `GET /api/budgets/month/{month}/year/{year}` - Specific month
5. `GET /api/budgets/{id}` - Get by ID
6. `PUT /api/budgets/{id}` - Update
7. `POST /api/budgets/recalculate` - Recalculate all
8. `DELETE /api/budgets/{id}` - Delete

### Savings Goals APIs (12 endpoints)
1. `POST /api/savings-goals` - Create
2. `GET /api/savings-goals` - Get all
3. `GET /api/savings-goals/active` - Active only
4. `GET /api/savings-goals/status/{status}` - By status
5. `GET /api/savings-goals/{id}` - Get by ID
6. `PUT /api/savings-goals/{id}` - Update
7. `PATCH /api/savings-goals/{id}/progress` - Add/subtract funds
8. `PATCH /api/savings-goals/{id}/amount` - Set amount
9. `PATCH /api/savings-goals/{id}/complete` - Complete
10. `PATCH /api/savings-goals/{id}/cancel` - Cancel
11. `PATCH /api/savings-goals/{id}/reopen` - Reopen
12. `DELETE /api/savings-goals/{id}` - Delete

---

## ✅ Testing Checklist

- [ ] Database migration script run successfully
- [ ] Backend starts without errors
- [ ] Can login and get JWT token
- [ ] Can create budgets
- [ ] Can get all budgets
- [ ] Budget auto-calculates spent amount from transactions
- [ ] Can create savings goals
- [ ] Can add funds to goals
- [ ] Goal auto-completes when target reached
- [ ] Can complete/cancel/reopen goals
- [ ] All CRUD operations work
- [ ] Validation errors return proper messages
- [ ] Unauthorized requests return 401

---

## 🐛 Troubleshooting

### "Table doesn't exist"
**Solution:** Run the migration script:
```bash
mysql -u root -p budget_tracker < backend/milestone3_database_setup.sql
```

### "401 Unauthorized"
**Solution:** Add Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

### "404 Not Found"
**Solution:** Check URL and make sure ID exists in database

### Backend won't start
**Solution:** 
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

---

## 📊 Project Status

- ✅ **Milestone 1**: Authentication (100%)
- ✅ **Milestone 2**: Transactions (100%)
- ✅ **Milestone 3**: Budget & Savings Goals (100% - Testing Phase)
- ⏳ **Milestone 4**: Charts & Analytics (Next)
- ⏳ **Milestone 5**: Export & Forum (Planned)

**Overall: 60% Complete (3 of 5 milestones)**

---

## 🎉 Next Steps

After testing in Postman:
1. Add routing to `App.jsx` for Budget and SavingsGoals pages
2. Add navigation links to `Navbar.jsx`
3. Test full UI functionality in browser
4. Start Milestone 4 (Charts & Analytics)

---

**Need Help?** Check the comprehensive guides in the project root folder!

Happy Testing! 🧪
