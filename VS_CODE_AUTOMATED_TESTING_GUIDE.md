# 🧪 Automated Testing in VS Code - Complete Guide

## 🎯 Overview

VS Code has excellent built-in support for automated testing! You can run tests directly in the IDE with:
- ✅ Test Explorer UI
- ✅ Run tests with one click
- ✅ Debug tests with breakpoints
- ✅ See test results inline
- ✅ Auto-run tests on file save

---

## 🚀 Option 1: REST Client Extension (Easiest!)

### Step 1: Install Extension
1. Open VS Code Extensions (Ctrl+Shift+X)
2. Search for "REST Client"
3. Install "REST Client" by Huachao Mao

### Step 2: Create Test File

I'll create a `.http` file that lets you test all APIs directly in VS Code!

**Features:**
- Click "Send Request" above each request
- See responses in a side panel
- Save variables (like JWT token)
- No need for Postman!

---

## 🔥 Option 2: Thunder Client Extension (Postman in VS Code)

### Step 1: Install Extension
1. Open VS Code Extensions (Ctrl+Shift+X)
2. Search for "Thunder Client"
3. Install "Thunder Client" by Ranga Vadhineni

### Step 2: Use Built-in Postman-like Interface
- Click Thunder Client icon in sidebar
- Create collections and requests
- Full Postman experience inside VS Code!

---

## 🧪 Option 3: Automated Backend Tests (JUnit)

### For Spring Boot Backend

Create unit tests that run automatically:

**Benefits:**
- Test business logic automatically
- Run all tests with one command
- See results in VS Code Test Explorer
- Continuous testing on file save

---

## 📝 Option 4: Frontend Testing (Jest/Vitest)

### For React Frontend

Create component tests that run automatically:

**Benefits:**
- Test React components
- Run tests on file save
- See coverage reports
- Debug tests in VS Code

---

## 🎯 RECOMMENDED: REST Client Setup

This is the easiest and fastest way to test your APIs in VS Code!

### Let me create the test file for you...

---

## 🔧 Setup Instructions

### 1. Install REST Client Extension

**Quick Install:**
- Press `Ctrl+P`
- Type: `ext install humao.rest-client`
- Press Enter

### 2. Use the Test File

Once I create `api-tests.http`, you can:
1. Open the file in VS Code
2. Click "Send Request" above any request
3. See response in split view
4. Variables persist across requests (JWT token auto-saved!)

### 3. Run All Tests

You can run requests sequentially or all at once!

---

## 📊 What You'll Be Able To Test

### ✅ Authentication
- Login and auto-save JWT token
- Register new users

### ✅ Budget APIs (8 endpoints)
- Create budgets
- Get all budgets
- Filter by month/year
- Update and delete budgets
- Recalculate spent amounts

### ✅ Savings Goals APIs (12 endpoints)
- Create goals
- Track progress
- Add/withdraw funds
- Complete/cancel/reopen goals
- Filter by status

### ✅ All 20 New Endpoints!

---

## 🎨 REST Client Features

### 1. Variables
```http
@baseUrl = http://localhost:8080
@token = {{login.response.body.token}}
```

### 2. Auto-Save Token
After login, token is automatically available for other requests!

### 3. Multiple Environments
```http
# Development
@baseUrl = http://localhost:8080

# Production
# @baseUrl = https://api.budgettracker.com
```

### 4. Test Scripts
```http
### Login
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "username": "testuser1",
  "password": "password123"
}

### Use token automatically in next request
GET {{baseUrl}}/api/budgets
Authorization: Bearer {{token}}
```

---

## 🔍 VS Code Test Explorer (For Unit Tests)

### For Backend (Java/JUnit)

1. **Install Extension:**
   - Test Runner for Java
   - Extension Pack for Java

2. **Create Test:**
```java
@Test
void testCreateBudget() {
    Budget budget = new Budget();
    budget.setBudgetAmount(new BigDecimal("500.00"));
    // assertions...
}
```

3. **Run Tests:**
   - Click "Run Test" above test method
   - Or use Test Explorer sidebar
   - See results inline with ✓ or ✗

### For Frontend (React/Vitest)

1. **Install Extension:**
   - Vitest (by Vitest)

2. **Create Test:**
```javascript
test('Budget component renders', () => {
  render(<Budget />);
  expect(screen.getByText('Budget')).toBeInTheDocument();
});
```

3. **Run Tests:**
   - Tests run automatically on save
   - See results in Test Explorer
   - Debug with breakpoints

---

## 🚀 Quick Start Guide

### Immediate Testing (REST Client)

1. **Install REST Client** (30 seconds)
   ```
   Ctrl+P → ext install humao.rest-client
   ```

2. **Open Test File** (I'll create it)
   ```
   api-tests.http
   ```

3. **Start Backend**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

4. **Click "Send Request"** above any test
   - Login first to get token
   - Then test any endpoint
   - Responses appear in split view

### Full Automation (Unit Tests)

**Backend Tests:**
```bash
cd backend
mvn test
```

**Frontend Tests:**
```bash
cd frontend
npm test
```

---

## 📦 Extensions Summary

| Extension | Purpose | When to Use |
|-----------|---------|-------------|
| **REST Client** | Test APIs in .http files | ✅ Best for API testing |
| **Thunder Client** | Postman-like UI | Alternative to REST Client |
| **Test Runner for Java** | Run JUnit tests | Backend unit tests |
| **Vitest** | Run React tests | Frontend component tests |
| **Coverage Gutters** | See test coverage | After writing tests |

---

## 🎯 My Recommendation

**For API Testing (NOW):**
1. ✅ Install **REST Client** extension
2. ✅ Use the `api-tests.http` file I'll create
3. ✅ Click "Send Request" to test each endpoint
4. ✅ No need to leave VS Code!

**For Unit Testing (LATER):**
1. ⏳ Add JUnit tests for backend services
2. ⏳ Add Vitest tests for React components
3. ⏳ Set up continuous testing

---

## 🔥 Advantages of REST Client

✅ **No external tools needed** - Everything in VS Code  
✅ **Fast** - Just click "Send Request"  
✅ **Auto-save variables** - JWT token persists  
✅ **Version control** - .http files commit to git  
✅ **Shareable** - Team uses same test file  
✅ **Syntax highlighting** - JSON formatted nicely  
✅ **Response history** - See past responses  
✅ **Multiple environments** - Dev/staging/prod  

---

## 📝 What I'll Create Next

**api-tests.http** - Complete test file with:
- ✅ All 20 Milestone 3 endpoints
- ✅ Authentication setup
- ✅ Variable management
- ✅ Example requests with data
- ✅ Comments explaining each test
- ✅ Ready to use immediately!

---

## 🎓 Learning Resources

### REST Client
- [Official Docs](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
- [Tutorial Video](https://www.youtube.com/watch?v=_jVXxXxM5fI)

### Thunder Client
- [Official Docs](https://www.thunderclient.com/)
- [Getting Started](https://github.com/rangav/thunder-client-support)

### JUnit Testing
- [Spring Boot Testing Guide](https://spring.io/guides/gs/testing-web/)
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)

### React Testing
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

**Ready to create the test file?** Say yes and I'll create a complete `.http` file with all 20 endpoints ready to test! 🚀
