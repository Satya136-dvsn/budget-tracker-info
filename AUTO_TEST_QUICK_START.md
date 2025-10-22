# 🚀 Quick Start: Auto-Testing in VS Code

## ✅ YES! You can do automated testing in VS Code!

I've created everything you need to test all 20 API endpoints without leaving VS Code!

---

## 🎯 Step-by-Step Setup (2 Minutes)

### Step 1: Install REST Client Extension

**Option A - Quick Install:**
1. Press `Ctrl + P` in VS Code
2. Type: `ext install humao.rest-client`
3. Press Enter

**Option B - Manual Install:**
1. Press `Ctrl + Shift + X` (Extensions)
2. Search for "REST Client"
3. Install "REST Client" by Huachao Mao
4. Look for the one with 6M+ downloads

### Step 2: Setup Database (One-Time)

```bash
mysql -u root -p budget_tracker < backend/milestone3_database_setup.sql
```

### Step 3: Start Backend

```bash
cd backend
mvn spring-boot:run
```

Wait for: "Started BudgetTrackerBackendApplication..."

### Step 4: Open Test File

In VS Code:
1. Open `api-tests.http` (it's in your project root)
2. You'll see colorful HTTP requests

---

## 🔥 How to Use (Super Easy!)

### 1. Run Your First Test

1. **Scroll to "Login" section** in `api-tests.http`
2. **Look for this:**
   ```http
   ### Login - Run this FIRST to get JWT token
   POST http://localhost:8080/api/auth/login
   ...
   ```
3. **Click "Send Request"** (appears above the POST line)
4. **See response** in a split panel on the right!

### 2. Test Budget APIs

After login, scroll down to any budget test:
```http
### Create Budget
POST http://localhost:8080/api/budgets
...
```

Click "Send Request" → See response instantly!

### 3. Test Savings Goals APIs

Same process:
```http
### Create Savings Goal
POST http://localhost:8080/api/savings-goals
...
```

Click "Send Request" → Response appears!

---

## 🎨 What You'll See

### In the Test File (`api-tests.http`):
```http
### Login - Run this FIRST
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "testuser1",
  "password": "password123"
}
```

**You'll see:**
- 🔵 Blue "Send Request" link above each test
- 🟢 Green syntax highlighting for HTTP methods
- 📝 Clear comments explaining each test

### In the Response Panel:
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "testuser1",
  "role": "USER"
}
```

**You'll see:**
- ✅ Status code (200 OK, 201 Created, etc.)
- 📊 Response headers
- 🎯 JSON response body (formatted nicely!)

---

## 🧪 What Tests Are Available

### All in `api-tests.http`:

#### 🔐 Authentication (2 tests)
- Login (get JWT token)
- Register new user

#### 💰 Budget APIs (10 tests)
- Create budget (3 examples)
- Get all budgets
- Get current month budgets
- Get specific month/year
- Get by ID
- Update budget
- Recalculate budgets
- Delete budget

#### 🎯 Savings Goals APIs (18 tests)
- Create goal (3 examples)
- Get all goals
- Get active goals
- Filter by status
- Get by ID
- Update goal
- Add funds (3 examples)
- Withdraw funds
- Set amount
- Complete goal
- Cancel goal
- Reopen goal
- Delete goal

#### 🧪 Integration Tests (2 workflows)
- Budget auto-calculation from transactions
- Savings goal lifecycle (create → add funds → auto-complete)

#### 🔍 Validation Tests (6 error cases)
- Missing required field
- Invalid month value
- Negative amount
- Duplicate budget
- Unauthorized request
- Invalid token

### **Total: 38+ Ready-to-Run Tests!**

---

## 💡 Cool Features

### 1. Auto-Save JWT Token
After you run "Login", the token is **automatically saved**!

All subsequent requests use it automatically:
```http
Authorization: Bearer {{login.response.body.token}}
```

No copy-paste needed! 🎉

### 2. Variables at the Top
```http
@baseUrl = http://localhost:8080
```

Change once, applies everywhere!

### 3. Response History
- Click the clock icon in response panel
- See all previous responses
- Compare results over time

### 4. Multiple Requests in Sequence
You can send multiple requests one after another to test workflows!

---

## 🎯 Quick Testing Workflow

### Test Scenario 1: Create and View Budget (1 minute)

1. **Login** → Click "Send Request" on Login test
2. **Create Budget** → Click "Send Request" on Create Budget
3. **Get All Budgets** → Click "Send Request" on Get All Budgets
4. **See your budget!** ✅

### Test Scenario 2: Savings Goal Lifecycle (2 minutes)

1. **Login** → Get token
2. **Create Goal** → Target: $1000
3. **Add Funds** → Add $500 (50% progress)
4. **Check Progress** → See 50% complete
5. **Add More** → Add another $500
6. **Verify Auto-Complete** → Status = COMPLETED ✅

### Test Scenario 3: Budget Auto-Calculation (3 minutes)

1. **Login** → Get token
2. **Create Budget** → Food & Dining: $500
3. **Create Transaction** → Groceries: $150 (use existing transaction API)
4. **Recalculate** → Click recalculate test
5. **Check Budget** → Spent = $150, Progress = 30% ✅

---

## 📊 Advantages Over Postman

| Feature | REST Client in VS Code | Postman |
|---------|------------------------|---------|
| **Setup** | ✅ Just install extension | ⚠️ Separate app |
| **Speed** | ✅ Instant | ⚠️ Slower |
| **Version Control** | ✅ .http files in git | ❌ Separate export |
| **Auto-Token** | ✅ Built-in variables | ⚠️ Manual setup |
| **Team Sharing** | ✅ Commit to repo | ⚠️ Export/import |
| **Code Context** | ✅ Same window | ❌ Switch apps |
| **Free** | ✅ 100% free | ⚠️ Limited free tier |

---

## 🎓 Tips & Tricks

### Keyboard Shortcuts
- `Ctrl + Alt + R` - Send request
- `Ctrl + Alt + C` - Cancel request
- `Ctrl + Alt + E` - Switch environment

### Running Multiple Tests
You can select multiple tests and run them in sequence!

### Organizing Tests
Use `###` to separate tests. Each `###` creates a new clickable request.

### Comments
Any line starting with `#` is a comment:
```http
# This is a comment
### This is a test separator
```

### Environments
You can have multiple environments:
```http
# Development
@baseUrl = http://localhost:8080

# Production
# @baseUrl = https://api.budgettracker.com
```

Just comment/uncomment as needed!

---

## 🚨 Troubleshooting

### "Send Request" link doesn't appear
**Solution:** Make sure REST Client extension is installed and enabled

### "Connection refused" error
**Solution:** Backend isn't running. Start it:
```bash
cd backend
mvn spring-boot:run
```

### "401 Unauthorized" error
**Solution:** Run the Login test first to get JWT token

### "Table doesn't exist" error
**Solution:** Run database migration:
```bash
mysql -u root -p budget_tracker < backend/milestone3_database_setup.sql
```

### Token expired
**Solution:** Just run the Login test again to get a fresh token

---

## 📁 File Structure

```
budget-tracker-project/
├── api-tests.http                           ⭐ YOUR TEST FILE
├── VS_CODE_AUTOMATED_TESTING_GUIDE.md      📚 Complete guide
├── POSTMAN_TESTING_GUIDE.md                📚 Alternative (Postman)
├── QUICK_START_TESTING.md                  📚 Quick reference
└── backend/
    └── milestone3_database_setup.sql       🗄️ Database setup
```

---

## ✅ What You Can Test Right Now

### Budget Management ✅
- [x] Create monthly budgets
- [x] View all budgets
- [x] Filter by month/year
- [x] Update budget amounts
- [x] Auto-calculate spent amounts
- [x] Detect over-budget situations
- [x] Delete budgets

### Savings Goals ✅
- [x] Create savings goals
- [x] Set target amounts and dates
- [x] Add funds incrementally
- [x] Withdraw funds
- [x] Track progress percentage
- [x] Auto-complete when target reached
- [x] Complete/cancel/reopen goals
- [x] Filter by status

### Integration ✅
- [x] Budget auto-calculation from transactions
- [x] Goal auto-completion
- [x] Over-budget detection
- [x] Status management
- [x] Validation rules

### All 20 Milestone 3 Endpoints ✅

---

## 🎉 Summary

**You now have:**
- ✅ 38+ automated tests in VS Code
- ✅ One-click testing (no Postman needed!)
- ✅ Auto-saved JWT tokens
- ✅ Integration test scenarios
- ✅ Validation error tests
- ✅ Complete documentation

**Time to test:** 2 minutes setup + instant testing!

**Just:**
1. Install REST Client extension
2. Start backend
3. Open `api-tests.http`
4. Click "Send Request"
5. Done! 🚀

---

## 📚 Additional Resources

- **VS_CODE_AUTOMATED_TESTING_GUIDE.md** - Full testing guide
- **POSTMAN_TESTING_GUIDE.md** - If you prefer Postman
- **MILESTONE_3_API_DOCUMENTATION.md** - Complete API docs
- **MILESTONE_3_SETUP_GUIDE.md** - Setup instructions

---

**Happy Auto-Testing!** 🧪✨

All 20 Milestone 3 endpoints are ready to test with one click! No need to leave VS Code!
