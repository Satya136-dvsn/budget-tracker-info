# 🎨 Frontend UI Testing Guide - Budget Tracker
**Date:** October 12, 2025  
**Frontend URL:** http://localhost:5173/  
**Backend URL:** http://localhost:8080  
**Status:** ✅ Both servers running

---

## 📋 **UI Testing Checklist**

### **Phase 1: Initial Load & Authentication** 🔐

#### **Test 1.1: Homepage/Sign In Page**
- [ ] Page loads successfully
- [ ] Sign In form is visible
- [ ] Username and password fields present
- [ ] "Sign In" button visible
- [ ] "Sign Up" link visible
- [ ] "Forgot Password?" link visible (if implemented)
- [ ] No console errors (F12 to check)

**Test Credentials:**
```
Username: testuser1
Password: password123
```

#### **Test 1.2: Sign In Functionality**
- [ ] Enter username: `testuser1`
- [ ] Enter password: `password123`
- [ ] Click "Sign In" button
- [ ] ✅ Should redirect to Dashboard
- [ ] ✅ Should store JWT token
- [ ] ✅ Should show user info/welcome message

#### **Test 1.3: Sign Up Page (Optional)**
- [ ] Click "Sign Up" link
- [ ] Registration form displays
- [ ] All fields present (username, email, password, confirm password, full name)
- [ ] Can navigate back to Sign In

---

### **Phase 2: Dashboard & Navigation** 🏠

#### **Test 2.1: Dashboard Display**
- [ ] Dashboard loads after login
- [ ] Navbar is visible at top
- [ ] User info displayed in navbar
- [ ] Navigation menu items visible
- [ ] Main content area displays correctly
- [ ] No layout issues or overlapping elements

#### **Test 2.2: Navbar Components**
- [ ] "Budget Tracker" logo/title visible
- [ ] Navigation links visible:
  - [ ] Dashboard
  - [ ] Transactions
  - [ ] Budgets
  - [ ] Savings Goals
  - [ ] Financial Health
- [ ] User profile section visible
- [ ] Logout button accessible

#### **Test 2.3: Responsive Design**
- [ ] Resize browser window (make smaller)
- [ ] Navbar adapts to mobile view (hamburger menu if applicable)
- [ ] Content remains readable
- [ ] No horizontal scrolling issues

---

### **Phase 3: Dropdown Styling (PRIMARY FOCUS)** 🎨

This is the main feature you wanted to test!

#### **Test 3.1: Monthly Spending Analysis Dropdowns**
Navigate to Monthly Spending section (if on Dashboard) or dedicated page.

**Dropdown Appearance:**
- [ ] Border color: Gray (#d1d5db) by default
- [ ] Background: Clean white
- [ ] Padding: Generous (comfortable click area)
- [ ] Border radius: Subtle rounded corners
- [ ] Custom arrow icon: Gray chevron on right side
- [ ] Font: Clear and readable

**Dropdown Interaction:**
- [ ] Hover effect:
  - [ ] Border changes to darker gray (#9ca3af)
  - [ ] Slight lift effect (translateY)
  - [ ] Shadow becomes more prominent (0px 4px 8px)
  - [ ] Smooth transition
- [ ] Focus effect:
  - [ ] Border changes to indigo (#6366f1)
  - [ ] Ring appears around dropdown (indigo glow)
  - [ ] No default blue outline
- [ ] Click to open:
  - [ ] Options list appears
  - [ ] Options are readable
  - [ ] Can select an option
  - [ ] Closes after selection

**Specific Dropdowns to Test:**
1. **Period Selector** (if present)
   - [ ] Default: "Monthly" or similar
   - [ ] Options: Weekly, Monthly, Yearly, Custom, etc.
   - [ ] Styling matches design
   
2. **Category Selector** (if present)
   - [ ] Lists expense categories
   - [ ] Clean appearance
   - [ ] Matches styling

#### **Test 3.2: Other Dropdown Locations**

Navigate to these sections and test all dropdowns:

**A. Trends/Analytics Page:**
- [ ] Period selector dropdown
- [ ] Time range dropdown
- [ ] All dropdowns have consistent styling

**B. Savings Growth:**
- [ ] Period selector dropdown
- [ ] Goal selector dropdown (if any)
- [ ] Consistent styling

**C. Category Analysis:**
- [ ] Category filter dropdown
- [ ] Time period dropdown
- [ ] Consistent styling

**D. Financial Health Analysis:**
- [ ] Any filter dropdowns
- [ ] Time period selectors
- [ ] Consistent styling

**E. Budgets Page:**
- [ ] Month selector
- [ ] Year selector
- [ ] Category selector
- [ ] All match the new styling

**F. Savings Goals Page:**
- [ ] Status filter dropdown
- [ ] Sort by dropdown
- [ ] Consistent styling

#### **Test 3.3: Dropdown Visual Comparison**
**Expected Styling (from reference):**
```css
✅ Border: 1px solid #d1d5db (light gray)
✅ Hover: Border #9ca3af + Shadow 0px 4px 8px
✅ Focus: Border #6366f1 (indigo) + Ring glow
✅ Padding: 12px 40px 12px 16px (generous)
✅ Background: White (#ffffff)
✅ Font: Smooth, professional
✅ Arrow: Custom gray chevron
```

**Check Against:**
- [ ] No heavy shadows or gradients
- [ ] No bright blue or green colors (except focus)
- [ ] No thick borders (1px only)
- [ ] Clean, modern, professional appearance
- [ ] Matches reference image you provided

---

### **Phase 4: Functional Testing** ⚙️

#### **Test 4.1: Budgets Functionality**
Navigate to Budgets page.

**View Budgets:**
- [ ] Can see list of budgets created in API tests:
  - [ ] Food and Dining - $500
  - [ ] Entertainment - $200
  - [ ] Transportation - $300
- [ ] Budget cards/rows display correctly
- [ ] Progress bars visible (if implemented)
- [ ] Spent amount vs Budget amount shown

**Create New Budget:**
- [ ] Click "Add Budget" or "Create Budget" button
- [ ] Form appears (modal or new page)
- [ ] Fill in details:
  - Category: Select from dropdown
  - Amount: Enter number
  - Month/Year: Select from dropdowns
- [ ] Click "Create" or "Save"
- [ ] ✅ Budget appears in list
- [ ] ✅ No errors

**Edit Budget:**
- [ ] Click edit icon on existing budget
- [ ] Form pre-filled with current values
- [ ] Change amount
- [ ] Save changes
- [ ] ✅ Budget updates in list

**Delete Budget:**
- [ ] Click delete icon
- [ ] Confirmation dialog appears
- [ ] Confirm deletion
- [ ] ✅ Budget removed from list

#### **Test 4.2: Savings Goals Functionality**
Navigate to Savings Goals page.

**View Savings Goals:**
- [ ] Can see goals created in API tests:
  - [ ] Emergency Fund - $10,000
  - [ ] Vacation Fund - $5,000 (Completed)
  - [ ] Car Down Payment - $15,000
- [ ] Goal cards display correctly
- [ ] Progress bars show percentage
- [ ] Target amount and current amount visible
- [ ] Target date visible
- [ ] Status badges (In Progress, Completed) visible

**Create New Goal:**
- [ ] Click "Add Goal" or "Create Goal" button
- [ ] Form appears
- [ ] Fill in:
  - Name: e.g., "Home Down Payment"
  - Target Amount: e.g., $20,000
  - Target Date: Pick a future date
  - Description: Optional
- [ ] Click "Create"
- [ ] ✅ Goal appears in list

**Add Progress:**
- [ ] Find a goal (e.g., Emergency Fund)
- [ ] Click "Add Progress" or similar button
- [ ] Enter amount: e.g., $500
- [ ] Click "Add"
- [ ] ✅ Progress bar updates
- [ ] ✅ Current amount increases
- [ ] ✅ Percentage recalculates

**Complete Goal:**
- [ ] Find an active goal
- [ ] Add enough funds to reach 100%
- [ ] ✅ Goal auto-marks as "Completed"
- [ ] ✅ Status badge changes
- [ ] Or manually mark as complete

**Filter Goals:**
- [ ] Use status dropdown to filter
- [ ] Select "In Progress" → Only active goals show
- [ ] Select "Completed" → Only finished goals show
- [ ] Select "All" → All goals show

#### **Test 4.3: Transactions Functionality**
Navigate to Transactions page.

**View Transactions:**
- [ ] Transaction list displays
- [ ] Each transaction shows:
  - [ ] Title/Description
  - [ ] Amount
  - [ ] Category
  - [ ] Date
  - [ ] Type (Income/Expense)
- [ ] Color coding for income (green) vs expense (red)

**Create Transaction:**
- [ ] Click "Add Transaction" button
- [ ] Form appears
- [ ] Fill in:
  - Title: "Grocery Shopping"
  - Amount: $150
  - Type: Expense
  - Category: Select "Food and Dining" from dropdown
  - Date: Pick date
- [ ] Click "Create"
- [ ] ✅ Transaction appears in list
- [ ] ✅ Dashboard totals update (if visible)

**Filter Transactions:**
- [ ] Date range filter
- [ ] Category filter dropdown
- [ ] Type filter (Income/Expense) dropdown
- [ ] Filters work correctly

#### **Test 4.4: Dashboard Widgets**

**Financial Summary Cards:**
- [ ] Total Income card displays
- [ ] Total Expenses card displays
- [ ] Current Savings displays
- [ ] Net Balance displays
- [ ] Values are accurate
- [ ] Icons/colors appropriate

**Recent Activity:**
- [ ] Recent transactions list
- [ ] Shows latest 5-10 transactions
- [ ] Formatted correctly
- [ ] Can click to view details

**Budget Overview:**
- [ ] Shows current month budgets
- [ ] Progress bars for each category
- [ ] Over-budget warnings (if any)
- [ ] Clickable to go to Budgets page

**Savings Goals Summary:**
- [ ] Shows active goals
- [ ] Progress indicators
- [ ] Quick add progress button
- [ ] Clickable to go to Goals page

---

### **Phase 5: Financial Health Analysis** 📊

Navigate to Financial Health or Analytics page.

#### **Test 5.1: Page Components**
- [ ] Page loads without errors
- [ ] Multiple analysis sections visible:
  - [ ] Monthly Spending Analysis
  - [ ] Category Breakdown
  - [ ] Trends Chart
  - [ ] Savings Growth
  - [ ] Budget vs Actual

#### **Test 5.2: Dropdown Interactions**
**CRITICAL TEST - This is your main concern!**

For each dropdown on this page:
- [ ] Hover effect works smoothly
- [ ] Focus ring appears on click
- [ ] Options are readable
- [ ] Selection changes data/chart
- [ ] No visual glitches
- [ ] Matches design reference

#### **Test 5.3: Charts & Visualizations**
- [ ] Charts render correctly (if implemented)
- [ ] Data is accurate
- [ ] Interactive tooltips work (if applicable)
- [ ] Responsive to window resize

---

### **Phase 6: Cross-Browser Testing** 🌐

Test in different browsers (if available):

#### **Chrome/Edge:**
- [ ] All dropdowns styled correctly
- [ ] Hover effects work
- [ ] Focus rings appear
- [ ] No layout issues

#### **Firefox:**
- [ ] Dropdown arrow displays correctly
- [ ] Styling consistent with Chrome
- [ ] All interactions work

---

### **Phase 7: Error Handling** ⚠️

#### **Test 7.1: Validation**
- [ ] Try creating budget with empty fields
- [ ] ✅ Validation errors display
- [ ] Try negative amounts
- [ ] ✅ Prevented or warning shown
- [ ] Try invalid dates
- [ ] ✅ Handled gracefully

#### **Test 7.2: Network Errors**
- [ ] Stop backend server temporarily
- [ ] Try creating a budget
- [ ] ✅ Error message displays
- [ ] ✅ UI doesn't crash
- [ ] Restart backend
- [ ] ✅ System recovers

#### **Test 7.3: Authentication**
- [ ] Logout from the system
- [ ] Try accessing protected page directly
- [ ] ✅ Redirects to login
- [ ] Login again
- [ ] ✅ Redirects to requested page

---

### **Phase 8: Performance** ⚡

#### **Test 8.1: Load Times**
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Page loads in < 3 seconds
- [ ] No long loading spinners
- [ ] Smooth transitions

#### **Test 8.2: Responsiveness**
- [ ] Click buttons → Immediate feedback
- [ ] Dropdown opens quickly
- [ ] Forms submit without delay
- [ ] No freezing or lag

---

## 🎯 **Priority Test Areas**

Based on our conversation, focus on these:

### **1. HIGHEST PRIORITY: Dropdown Styling** ⭐⭐⭐
- [ ] All dropdowns have new styling
- [ ] Gray borders, not blue/green
- [ ] Professional hover effects
- [ ] Indigo focus rings
- [ ] Custom arrow icons
- [ ] Generous padding
- [ ] Clean, modern look
- [ ] **Matches your reference image**

### **2. HIGH PRIORITY: Milestone 3 Features** ⭐⭐
- [ ] Budget CRUD operations work
- [ ] Savings Goals CRUD operations work
- [ ] Data persists after page refresh
- [ ] API integration successful

### **3. MEDIUM PRIORITY: User Experience** ⭐
- [ ] Navigation is intuitive
- [ ] Forms are user-friendly
- [ ] Error messages are clear
- [ ] Design is consistent

---

## 🐛 **Bug Tracking**

If you find any issues, note them here:

### **Dropdown Issues:**
| Issue | Location | Severity | Status |
|-------|----------|----------|--------|
| _Example: Border too thick_ | _Budgets page_ | _Low_ | _Found_ |

### **Functional Issues:**
| Issue | Feature | Severity | Status |
|-------|---------|----------|--------|
| _Example: Can't delete goal_ | _Savings Goals_ | _High_ | _Found_ |

### **Visual Issues:**
| Issue | Location | Severity | Status |
|-------|----------|----------|--------|
| _Example: Text overlapping_ | _Dashboard_ | _Medium_ | _Found_ |

---

## ✅ **Testing Tools**

### **Browser DevTools (F12):**
- **Console Tab:** Check for JavaScript errors
- **Network Tab:** Monitor API calls (should see 200/201 responses)
- **Elements Tab:** Inspect dropdown CSS if needed

### **Useful Shortcuts:**
- `F12` - Open DevTools
- `Ctrl+Shift+R` - Hard refresh (clear cache)
- `Ctrl+Shift+I` - Open Inspector
- `F5` - Regular refresh

---

## 📸 **Visual Comparison**

### **Dropdown Styling Goals:**
**BEFORE (Old Styling):**
- ❌ Heavy shadows
- ❌ Bright blue/green colors
- ❌ Thick borders
- ❌ Cramped padding

**AFTER (New Styling - What You Should See):**
- ✅ Subtle shadows (2-4px)
- ✅ Gray borders (#d1d5db)
- ✅ Indigo focus (#6366f1)
- ✅ Generous padding (12px 40px 12px 16px)
- ✅ Professional, clean look
- ✅ Custom gray chevron arrow
- ✅ Smooth hover lift effect

---

## 🎉 **Test Completion Criteria**

Consider testing complete when:
- [ ] ✅ All dropdown styling verified and approved
- [ ] ✅ Budget CRUD operations working
- [ ] ✅ Savings Goals CRUD operations working
- [ ] ✅ Authentication works correctly
- [ ] ✅ No critical bugs found
- [ ] ✅ UI matches design expectations
- [ ] ✅ Performance is acceptable

---

## 📝 **Test Results Summary**

Fill this in after testing:

**Dropdown Styling:**
- Status: ⬜ Pass / ⬜ Fail / ⬜ Needs Work
- Notes: _____________________

**Budget Management:**
- Status: ⬜ Pass / ⬜ Fail
- Notes: _____________________

**Savings Goals:**
- Status: ⬜ Pass / ⬜ Fail
- Notes: _____________________

**Overall Frontend:**
- Status: ⬜ Ready for Production / ⬜ Needs Fixes
- Notes: _____________________

---

## 🚀 **Next Steps After Testing**

1. **If All Tests Pass:**
   - ✅ Commit any final changes
   - ✅ Push to GitHub
   - ✅ Proceed to Milestone 4 (Charts & Analytics)

2. **If Issues Found:**
   - 📋 Document issues clearly
   - 🔧 Prioritize critical fixes
   - 🐛 Fix bugs systematically
   - 🔄 Re-test after fixes

---

**Frontend URL:** http://localhost:5173/  
**Test Started:** ___________  
**Test Completed:** ___________  
**Tester:** ___________  
**Status:** 🟡 In Progress

---

**💡 TIP:** Open this file in VS Code and check off items as you test!
