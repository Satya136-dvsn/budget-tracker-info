# 🧪 Complete Testing Guide - Budget Tracker Application

## 📋 Pre-Testing Checklist

### Step 1: Verify Servers are Running

#### Check Backend Server (Port 8080):
```powershell
netstat -ano | Select-String ":8080"
```
✅ **Expected Output**: Should show `LISTENING` on port 8080

**If NOT running**, start the backend:
```powershell
cd backend
java -jar target/budget-tracker-backend-0.0.1-SNAPSHOT.jar
```
Or use Maven:
```powershell
cd backend
mvn spring-boot:run
```

#### Check Frontend Server (Port 5173):
```powershell
netstat -ano | Select-String ":5173"
```
✅ **Expected Output**: Should show `LISTENING` on port 5173

**If NOT running**, start the frontend:
```powershell
cd frontend
npm run dev
```

---

## 🎯 Testing Milestone 1: Authentication & User Management

### Test 1: User Registration

**Steps:**
1. Open browser: http://localhost:5173
2. Click **"Get Started"** or **"Sign Up"** button
3. Fill in the registration form:
   - Username: `testuser2`
   - Email: `testuser2@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
4. Click **"Sign Up"**

**✅ Expected Result:**
- Success alert appears
- Redirected to Sign In page
- Form clears after submission

**❌ Common Issues:**
- "Username already exists" → Use a different username
- Backend not responding → Check if backend is running on port 8080

---

### Test 2: User Login

**Steps:**
1. Navigate to Sign In page: http://localhost:5173/signin
2. Enter credentials:
   - Username: `testuser2` (or your registered username)
   - Password: `password123`
3. Click **"Sign In"**

**✅ Expected Result:**
- Success alert: "Login successful!"
- Redirected to Dashboard
- Navbar shows: Home | Profile | Logout (no Admin link for regular users)
- User greeting appears in dashboard

**❌ Common Issues:**
- "Invalid credentials" → Check username/password
- Not redirecting → Check browser console for errors

---

### Test 3: Admin Login (if you have admin account)

**Steps:**
1. Navigate to Sign In page
2. Enter admin credentials:
   - Username: `admin`
   - Password: `admin123` (or your admin password)
3. Click **"Sign In"**

**✅ Expected Result:**
- Redirected to Dashboard
- Navbar shows: Home | Profile | **Admin** | Logout
- Admin link is visible only for admin users

---

### Test 4: Profile Page Access

**Steps:**
1. After login, click **"Profile"** in navbar
2. Verify profile page loads

**✅ Expected Result:**
- Purple gradient background
- Account Information card displays:
  - Username
  - Email
  - Role badge (colored: gold for Admin, green for User)
- Financial Profile form displays:
  - Monthly Income field
  - Current Savings field
  - Target Monthly Expenses field
- Update Profile button visible
- No cut-off at bottom (proper spacing)

---

### Test 5: Update Profile

**Steps:**
1. On Profile page, enter financial data:
   - Monthly Income: `5000`
   - Current Savings: `10000`
   - Target Monthly Expenses: `3000`
2. Click **"💾 Update Profile"**

**✅ Expected Result:**
- Success alert: "Profile updated successfully!"
- Button shows "Updating..." during submission
- Data persists (refresh page to verify)

---

## 💰 Testing Milestone 2: Transaction Management

### Test 6: Add Expense from Dashboard

**Steps:**
1. Navigate to Dashboard: http://localhost:5173/dashboard
2. Scroll to **"Quick Actions"** section
3. Click **"Add Expense"** button
4. Fill in the expense form:
   - **Title**: `Grocery Shopping`
   - **Amount**: `150.50`
   - **Category**: Select `Food` (dropdown should show dynamic categories)
   - **Date**: Keep today's date or select a date
5. Click **"Add Expense"**

**✅ Expected Result:**
- Success alert: "Expense added successfully!"
- Modal closes
- Expense appears in **"Recent Transactions"** section below
- Transaction shows:
  - 📤 icon (for expense)
  - Title: "Grocery Shopping"
  - Category: "Food"
  - Date: formatted date
  - Amount: "-$150.50" (in red)

**❌ Common Issues:**
- "Failed to add expense" → Check backend connection
- Category dropdown empty → Backend categories endpoint not responding

---

### Test 7: Add Income from Dashboard

**Steps:**
1. Click **"Add Expense"** button (we'll change the type)
2. In the form, notice the **Type** field (if available)
3. Fill in:
   - **Title**: `Monthly Salary`
   - **Amount**: `5000`
   - **Category**: Select an appropriate category
   - **Date**: Today's date
4. Click **"Add Expense"**

**✅ Expected Result:**
- Transaction appears in Recent Transactions
- Shows 📥 icon (for income)
- Amount: "+$5000.00" (in green)

---

### Test 8: View Recent Transactions

**Steps:**
1. On Dashboard, scroll to **"Recent Transactions"** section
2. Verify you see your added transactions
3. Check the display format

**✅ Expected Result:**
- Shows up to 5 most recent transactions
- Each transaction displays:
  - Icon (📥 or 📤)
  - Title
  - Category name
  - Date (formatted)
  - Amount (color-coded)
- "View All" button at top right
- If no transactions: "No transactions yet" with "Add Your First Expense" button

---

### Test 9: Navigate to Transactions Page

**Steps:**
1. On Dashboard, click **"View All"** button in Recent Transactions section
   - OR directly navigate to: http://localhost:5173/transactions

**✅ Expected Result:**
- Redirected to Transactions page
- Page loads with full transaction management interface
- URL shows: `/transactions`

---

### Test 10: Transactions Page - Summary Cards

**Steps:**
1. On Transactions page, observe the top summary cards

**✅ Expected Result:**
- **4 summary cards displayed**:
  1. **Total Income** (green theme)
     - Shows sum of all income transactions
     - Icon: 💰
  2. **Total Expenses** (red theme)
     - Shows sum of all expense transactions
     - Icon: 💸
  3. **Balance** (green if positive, red if negative)
     - Shows: Income - Expenses
     - Icon: 📊
  4. **Transactions**
     - Shows total count of transactions
     - Icon: 📝
- Numbers update in real-time as you filter/search

---

### Test 11: Filter by Transaction Type

**Steps:**
1. On Transactions page, locate the **Filters** section
2. Click the **Type** dropdown
3. Select different options:
   - **ALL** → Shows all transactions
   - **INCOME** → Shows only income transactions
   - **EXPENSE** → Shows only expense transactions

**✅ Expected Result:**
- Transaction list updates immediately
- Summary cards recalculate based on filtered data
- Income transactions show green amounts with 📥
- Expense transactions show red amounts with 📤

---

### Test 12: Filter by Category

**Steps:**
1. In Filters section, click **Category** dropdown
2. Select a category (e.g., "Food", "Salary", etc.)

**✅ Expected Result:**
- Only transactions from selected category are shown
- Summary cards update
- Transaction count changes
- Can combine with Type filter

---

### Test 13: Search Transactions

**Steps:**
1. In Filters section, find the **Search** input box
2. Type: `Grocery`

**✅ Expected Result:**
- Only transactions with "Grocery" in title are shown
- Search is case-insensitive
- Works in combination with other filters
- Clear search box to see all transactions again

---

### Test 14: Sort Transactions

**Steps:**
1. In Filters section, click **Sort By** dropdown
2. Try each sorting option:
   - **Date (Newest First)** → Most recent at top
   - **Date (Oldest First)** → Oldest at top
   - **Amount (High to Low)** → Largest amounts first
   - **Amount (Low to High)** → Smallest amounts first

**✅ Expected Result:**
- Transaction order changes immediately
- Sorting works with active filters
- Visual order matches selected sort

---

### Test 15: Add New Transaction from Transactions Page

**Steps:**
1. On Transactions page, click **"+ Add Transaction"** button (top right)
2. Modal opens with form
3. Fill in the form:
   - **Type**: Select `EXPENSE`
   - **Title**: `Coffee Shop`
   - **Amount**: `5.50`
   - **Category**: Select `Food` (categories change based on type)
   - **Date**: Today's date
   - **Description** (optional): `Morning coffee`
4. Click **"Add Transaction"**

**✅ Expected Result:**
- Success alert appears
- Modal closes
- New transaction appears in the list
- Summary cards update with new amounts
- Transaction list re-sorts based on current sort option

---

### Test 16: Change Transaction Type in Add Form

**Steps:**
1. Click **"+ Add Transaction"**
2. Select **Type**: `INCOME`
3. Observe the **Category** dropdown

**✅ Expected Result:**
- Category dropdown updates with income categories
- Different categories than expense type
- Form validates that all fields are filled

---

### Test 17: Edit Existing Transaction

**Steps:**
1. In the transaction table, locate any transaction
2. Click the **✏️ Edit** button (blue button)
3. Modal opens with pre-filled data
4. Modify some fields:
   - Change **Amount**: from `150.50` to `175.00`
   - Change **Title**: add "(Updated)"
5. Click **"Update Transaction"**

**✅ Expected Result:**
- Success alert: "Transaction updated successfully!"
- Modal closes
- Transaction updates in the list
- Updated values are visible immediately
- Summary cards recalculate

---

### Test 18: Delete Transaction

**Steps:**
1. In the transaction table, locate any transaction
2. Click the **🗑️ Delete** button (red button)
3. Confirmation dialog appears

**✅ Expected Result:**
- Browser confirmation dialog: "Are you sure you want to delete this transaction?"
- Click **"OK"** to confirm
- Success alert: "Transaction deleted successfully!"
- Transaction disappears from list
- Summary cards update
- Transaction count decreases

---

### Test 19: Empty State - No Transactions

**Steps:**
1. Delete all transactions OR
2. Use filters that result in no matches

**✅ Expected Result:**
- Empty state message appears
- Icon: 📝
- Message: "No transactions found"
- Subtext: "Add your first transaction to get started!"
- **"Add Transaction"** button visible

---

### Test 20: Responsive Design - Mobile View

**Steps:**
1. Press **F12** to open browser developer tools
2. Click the **Device Toggle** button (phone/tablet icon)
3. Select a mobile device (e.g., iPhone 12)
4. Test navigation through all pages

**✅ Expected Result:**
- Dashboard: Cards stack vertically
- Transactions: Table scrolls horizontally OR converts to card layout
- Filters: Stack vertically
- Summary cards: 1-2 per row
- Buttons are touch-friendly
- Text is readable
- No horizontal overflow

---

## 🎨 Testing UI/UX Features

### Test 21: Profile Page Styling

**Steps:**
1. Navigate to Profile page
2. Check visual elements

**✅ Expected Result:**
- Purple gradient background (matching app theme)
- Two glassmorphism cards:
  - Account Information card
  - Financial Profile card
- Smooth animations when page loads
- Role badge colored correctly:
  - Admin: Gold/yellow gradient with 👑
  - User: Green gradient with 👤
- Proper spacing at bottom (no cut-off)
- Update button has gradient and hover effect

---

### Test 22: Dashboard Recent Transactions Styling

**Steps:**
1. On Dashboard, observe Recent Transactions section
2. Check visual styling

**✅ Expected Result:**
- Clean card layout
- Icons for income/expense
- Formatted dates (e.g., "Oct 5, 2025")
- Currency formatting (e.g., "$150.50")
- Color coding:
  - Income: Green text
  - Expense: Red text
- Hover effects on transactions
- "View All" button with proper styling

---

### Test 23: Transactions Page Styling

**Steps:**
1. On Transactions page, review all visual elements

**✅ Expected Result:**
- **Summary Cards**:
  - Gradient left border (matching card type)
  - Icons and colors match content
  - Hover effects (slight elevation)
- **Filters Section**:
  - Clean grid layout
  - Styled dropdowns and inputs
  - Proper spacing
- **Transaction Table**:
  - Alternating row colors
  - Hover effects on rows
  - Color-coded amounts
  - Category badges (pills)
  - Type badges (colored)
  - Action buttons (blue Edit, red Delete)
- **Modal**:
  - Centered on screen
  - Backdrop blur
  - Smooth animations

---

## 🔐 Testing Authentication & Authorization

### Test 24: Protected Routes

**Steps:**
1. Open an **Incognito/Private** browser window
2. Try to access: http://localhost:5173/dashboard

**✅ Expected Result:**
- Redirected to `/signin` page
- Cannot access dashboard without login
- Same for `/transactions` and `/profile`

---

### Test 25: Logout Functionality

**Steps:**
1. While logged in, click **"Logout"** in navbar
2. Observe behavior

**✅ Expected Result:**
- Success alert: "Logged out successfully!"
- Redirected to home page (/)
- Navbar shows: Sign In | Sign Up (no Profile/Logout)
- Cannot access protected routes anymore

---

### Test 26: Admin Access

**Steps:**
1. Login as regular user
2. Try to access: http://localhost:5173/admin

**✅ Expected Result:**
- Redirected to `/dashboard`
- Cannot access admin page as regular user

**With Admin Account:**
1. Logout and login as admin
2. Access: http://localhost:5173/admin

**✅ Expected Result:**
- Admin dashboard loads
- Shows user statistics
- Can view user list

---

## 🔄 Testing Data Persistence

### Test 27: Data Persistence After Refresh

**Steps:**
1. Add a transaction
2. Press **F5** to refresh the page
3. Check if transaction is still there

**✅ Expected Result:**
- Transaction persists after refresh
- All data reloads from backend
- Summary cards show correct totals

---

### Test 28: Profile Data Persistence

**Steps:**
1. Update profile with financial data
2. Navigate away (go to Dashboard)
3. Come back to Profile page

**✅ Expected Result:**
- Profile data is still there
- Form fields show saved values
- No data loss

---

## 🐛 Testing Error Handling

### Test 29: Test Backend Disconnection

**Steps:**
1. Stop the backend server (Ctrl+C in backend terminal)
2. Try to add a transaction

**✅ Expected Result:**
- Error alert appears
- User-friendly message (not technical error)
- Modal stays open so user can retry
- Console shows error details (for debugging)

**To Resume:** Restart backend server

---

### Test 30: Form Validation

**Steps:**
1. Click "Add Transaction"
2. Try to submit with empty fields
3. Try to submit with invalid data (negative amount, etc.)

**✅ Expected Result:**
- Form validation prevents submission
- Required fields marked
- Helpful error messages
- Cannot submit invalid data

---

## 📊 Testing Summary

### Quick Test Checklist:

- [ ] Can register new user
- [ ] Can login successfully
- [ ] Can logout
- [ ] Profile page displays correctly
- [ ] Can update profile information
- [ ] Can add expense from dashboard
- [ ] Expense appears in recent transactions
- [ ] Can navigate to transactions page
- [ ] Summary cards show correct totals
- [ ] Can filter by type
- [ ] Can filter by category
- [ ] Can search transactions
- [ ] Can sort transactions (4 options)
- [ ] Can add new transaction from transactions page
- [ ] Can edit existing transaction
- [ ] Can delete transaction (with confirmation)
- [ ] Categories load dynamically
- [ ] UI is responsive on mobile
- [ ] Profile page styling looks professional
- [ ] Protected routes work (redirect to login)
- [ ] Data persists after page refresh

---

## 🆘 Troubleshooting Common Issues

### Backend Not Responding:
```powershell
# Check if backend is running
netstat -ano | Select-String ":8080"

# If not running, start it
cd backend
java -jar target/budget-tracker-backend-0.0.1-SNAPSHOT.jar
```

### Frontend Not Loading:
```powershell
# Check if frontend is running
netstat -ano | Select-String ":5173"

# If not running, start it
cd frontend
npm run dev
```

### Database Connection Issues:
- Check MySQL is running
- Verify credentials in `backend/src/main/resources/application.properties`
- Check database exists: `budget_tracker`

### CORS Errors in Console:
- Verify backend CORS configuration
- Check backend is running on port 8080
- Frontend should be on port 5173

### Token Expired:
- Logout and login again
- JWT tokens expire after configured time

---

## 📈 Performance Testing

### Load Time Testing:
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Refresh page
4. Check load times:
   - ✅ Page load: < 2 seconds
   - ✅ API calls: < 500ms
   - ✅ Total page ready: < 3 seconds

---

## ✅ Final Verification

After completing all tests, verify:
- ✅ Milestone 1: 100% (All auth & admin features work)
- ✅ Milestone 2: 100% (All transaction features work)
- ✅ UI is professional and responsive
- ✅ No console errors (check browser console)
- ✅ Data persists correctly
- ✅ All CRUD operations work
- ✅ Filters and search work correctly
- ✅ Profile updates save successfully

---

**Testing Complete! 🎉**

If all tests pass, your Budget Tracker application is fully functional and ready for use!

**Last Updated**: October 5, 2025  
**Application Version**: Milestone 2 Complete (100%)
