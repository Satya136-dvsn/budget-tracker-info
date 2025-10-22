# 📚 Repository Pattern in Budget Tracker Project

**Date**: October 6, 2025  
**Project**: Budget Tracker Application

---

## 📋 Table of Contents

1. [What is a Repository?](#what-is-a-repository)
2. [Repository Pattern in Your Project](#repository-pattern-in-your-project)
3. [How Repositories Work](#how-repositories-work)
4. [Your Project's Repositories](#your-projects-repositories)
5. [Repository Methods Explained](#repository-methods-explained)
6. [Complete Data Flow](#complete-data-flow)
7. [Real Examples](#real-examples)

---

## 🤔 What is a Repository?

### **Simple Definition:**
A **Repository** is like a **library manager** for your database. Instead of writing SQL queries manually, you ask the repository to get, save, update, or delete data for you.

### **Analogy:**
```
Think of it like a library:

❌ Without Repository:
You: "I need to manually search through all shelves, 
     find the book, check it out, update the catalog..."
     
✅ With Repository:
You: "Can I get the book titled 'Java Programming'?"
Librarian (Repository): "Sure! Here it is." 
     (Handles all the searching and catalog updates for you)
```

### **Technical Definition:**
A Repository is a **Data Access Layer** pattern that:
- Abstracts database operations
- Provides a collection-like interface for accessing domain objects
- Separates business logic from data access logic
- Makes code cleaner, more testable, and maintainable

---

## 🏗️ Repository Pattern in Your Project

### **Architecture Overview**

```
┌──────────────────────────────────────────────────────────────────┐
│                    3-LAYER ARCHITECTURE                           │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  LAYER 1: CONTROLLERS                                            │
│  (Handles HTTP Requests)                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │AuthController│  │UserController│  │TransactionCtrl│          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│         │ Calls            │ Calls            │ Calls            │
│         ▼                  ▼                  ▼                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  LAYER 2: SERVICES                                               │
│  (Business Logic)                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ UserService  │  │TransactionSvc│  │CategoryService│          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│         │ Uses             │ Uses             │ Uses             │
│         ▼                  ▼                  ▼                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  LAYER 3: REPOSITORIES (DATA ACCESS LAYER) ⭐                    │
│  (Database Operations - NO SQL CODE!)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │UserRepository│  │TransactionRep│  │CategoryRep   │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│         │ Talks to         │ Talks to         │ Talks to         │
│         ▼                  ▼                  ▼                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  DATABASE (MySQL)                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ users table  │  │transactions  │  │ categories   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### **Why Use Repositories?**

#### ❌ **Without Repository (Manual SQL):**
```java
public User findUserByUsername(String username) {
    // You have to write SQL manually
    String sql = "SELECT * FROM users WHERE username = ?";
    Connection conn = getConnection();
    PreparedStatement stmt = conn.prepareStatement(sql);
    stmt.setString(1, username);
    ResultSet rs = stmt.executeQuery();
    
    if (rs.next()) {
        User user = new User();
        user.setId(rs.getLong("id"));
        user.setUsername(rs.getString("username"));
        user.setEmail(rs.getString("email"));
        // ... set all other fields manually
        return user;
    }
    // Handle null case, close connections, etc.
}
```
**Problems:**
- 😫 Too much boilerplate code
- 🐛 Easy to make mistakes
- 🔧 Hard to test
- 📝 SQL mixed with Java code

#### ✅ **With Repository (Spring Data JPA):**
```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}

// Usage:
Optional<User> user = userRepository.findByUsername("john_doe");
```
**Benefits:**
- ✅ Clean, simple code
- ✅ No SQL writing needed
- ✅ Easy to test
- ✅ Type-safe
- ✅ Automatic error handling

---

## 🔧 How Repositories Work

### **Spring Data JPA Magic**

```
┌──────────────────────────────────────────────────────────────────┐
│           HOW REPOSITORIES WORK (Spring Data JPA)                 │
└──────────────────────────────────────────────────────────────────┘

Step 1: You define an interface
────────────────────────────────
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}

Note: It's just an INTERFACE, no implementation code!


Step 2: Spring automatically creates implementation
───────────────────────────────────────────────────
At application startup, Spring generates a class that implements:
- All JpaRepository methods (save, findAll, delete, etc.)
- Your custom methods based on method names


Step 3: Spring translates method names to SQL
──────────────────────────────────────────────
Method Name: findByUsername(String username)
             ───────────────
             ↓
Spring parses: "find" + "By" + "Username"
             ↓
Generated SQL: SELECT * FROM users WHERE username = ?
             ↓
Executes query and returns result


Step 4: You use it like any Java object
────────────────────────────────────────
@Autowired
private UserRepository userRepository;

// Spring injects the auto-generated implementation
Optional<User> user = userRepository.findByUsername("john_doe");
```

### **Method Name Conventions**

Spring Data JPA creates queries based on method names:

```java
// Find operations
findBy<PropertyName>              → SELECT * FROM table WHERE property = ?
findBy<Prop1>And<Prop2>          → WHERE prop1 = ? AND prop2 = ?
findBy<Prop1>Or<Prop2>           → WHERE prop1 = ? OR prop2 = ?
findBy<Property>OrderBy<Prop2>   → WHERE property = ? ORDER BY prop2

// Existence checks
existsBy<PropertyName>           → SELECT COUNT(*) > 0 FROM table WHERE property = ?

// Count operations
countBy<PropertyName>            → SELECT COUNT(*) FROM table WHERE property = ?

// Delete operations
deleteBy<PropertyName>           → DELETE FROM table WHERE property = ?

// Examples from your project:
findByUsername(String username)
  → SELECT * FROM users WHERE username = ?

existsByEmail(String email)
  → SELECT COUNT(*) > 0 FROM users WHERE email = ?

findByUserOrderByTransactionDateDesc(User user)
  → SELECT * FROM transactions WHERE user_id = ? ORDER BY transaction_date DESC
```

---

## 📂 Your Project's Repositories

Your project has **3 repositories**, one for each database table:

```
┌────────────────────────────────────────────────────────────────┐
│              YOUR PROJECT'S REPOSITORIES                        │
└────────────────────────────────────────────────────────────────┘

1️⃣ UserRepository
   ├─ Manages: users table
   ├─ Entity: User.java
   └─ Used by: UserService.java

2️⃣ TransactionRepository
   ├─ Manages: transactions table
   ├─ Entity: Transaction.java
   └─ Used by: TransactionService.java

3️⃣ CategoryRepository
   ├─ Manages: categories table
   ├─ Entity: Category.java
   └─ Used by: CategoryService.java
```

---

## 📖 Repository Methods Explained

### **1️⃣ UserRepository**

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Find user by username
    Optional<User> findByUsername(String username);
    // SQL: SELECT * FROM users WHERE username = ?
    // Returns: Optional<User> (user or empty)
    
    // Find user by email
    Optional<User> findByEmail(String email);
    // SQL: SELECT * FROM users WHERE email = ?
    // Returns: Optional<User>
    
    // Check if username exists
    boolean existsByUsername(String username);
    // SQL: SELECT COUNT(*) > 0 FROM users WHERE username = ?
    // Returns: true/false
    
    // Check if email exists
    boolean existsByEmail(String email);
    // SQL: SELECT COUNT(*) > 0 FROM users WHERE email = ?
    // Returns: true/false
}
```

**Inherited from JpaRepository:**
```java
// These methods come FREE with JpaRepository:
save(User user)              // Insert or update user
findById(Long id)            // Find by ID
findAll()                    // Get all users
delete(User user)            // Delete user
deleteById(Long id)          // Delete by ID
count()                      // Count all users
existsById(Long id)          // Check if ID exists
```

### **2️⃣ TransactionRepository**

```java
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    // Find all transactions for a user, ordered by date descending
    List<Transaction> findByUserOrderByTransactionDateDesc(User user);
    // SQL: SELECT * FROM transactions WHERE user_id = ? ORDER BY transaction_date DESC
    
    // Find transactions by user and type (INCOME or EXPENSE)
    List<Transaction> findByUserAndTypeOrderByTransactionDateDesc(
        User user, 
        Transaction.TransactionType type
    );
    // SQL: SELECT * FROM transactions 
    //      WHERE user_id = ? AND type = ? 
    //      ORDER BY transaction_date DESC
    
    // Find transactions by user and category
    List<Transaction> findByUserAndCategoryOrderByTransactionDateDesc(
        User user, 
        String category
    );
    // SQL: SELECT * FROM transactions 
    //      WHERE user_id = ? AND category = ? 
    //      ORDER BY transaction_date DESC
    
    // Find transactions within date range
    List<Transaction> findByUserAndTransactionDateBetweenOrderByTransactionDateDesc(
        User user, 
        LocalDateTime startDate, 
        LocalDateTime endDate
    );
    // SQL: SELECT * FROM transactions 
    //      WHERE user_id = ? AND transaction_date BETWEEN ? AND ?
    //      ORDER BY transaction_date DESC
    
    // Custom JPQL Query - Calculate total income
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.user = :user AND t.type = 'INCOME'")
    BigDecimal calculateTotalIncome(@Param("user") User user);
    // Returns: Sum of all income amounts for user
    
    // Custom JPQL Query - Calculate total expenses
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.user = :user AND t.type = 'EXPENSE'")
    BigDecimal calculateTotalExpenses(@Param("user") User user);
    // Returns: Sum of all expense amounts for user
    
    // Get expense breakdown by category
    @Query("SELECT t.category, COALESCE(SUM(t.amount), 0) " +
           "FROM Transaction t " +
           "WHERE t.user = :user AND t.type = 'EXPENSE' " +
           "GROUP BY t.category " +
           "ORDER BY SUM(t.amount) DESC")
    List<Object[]> getExpenseBreakdownByCategory(@Param("user") User user);
    // Returns: List of [category, total_amount] arrays
    // Example: [["Food", 500], ["Transport", 200], ...]
    
    // Count transactions for user
    long countByUser(User user);
    // SQL: SELECT COUNT(*) FROM transactions WHERE user_id = ?
}
```

### **3️⃣ CategoryRepository**

```java
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    // Find category by name (case-insensitive)
    Optional<Category> findByNameIgnoreCase(String name);
    // SQL: SELECT * FROM categories WHERE LOWER(name) = LOWER(?)
    
    // Find all active categories
    List<Category> findByIsActiveTrue();
    // SQL: SELECT * FROM categories WHERE is_active = true
    
    // Find categories by type (INCOME, EXPENSE, BOTH)
    List<Category> findByTypeOrderByName(Category.CategoryType type);
    // SQL: SELECT * FROM categories WHERE type = ? ORDER BY name
    
    // Find active categories by type
    List<Category> findByTypeAndIsActiveTrueOrderByName(Category.CategoryType type);
    // SQL: SELECT * FROM categories 
    //      WHERE type = ? AND is_active = true 
    //      ORDER BY name
    
    // Custom JPQL Query - Get income categories
    @Query("SELECT c FROM Category c " +
           "WHERE c.type IN ('INCOME', 'BOTH') AND c.isActive = true " +
           "ORDER BY c.name")
    List<Category> getIncomeCategories();
    
    // Custom JPQL Query - Get expense categories
    @Query("SELECT c FROM Category c " +
           "WHERE c.type IN ('EXPENSE', 'BOTH') AND c.isActive = true " +
           "ORDER BY c.name")
    List<Category> getExpenseCategories();
    
    // Check if category name exists
    boolean existsByNameIgnoreCase(String name);
    // SQL: SELECT COUNT(*) > 0 FROM categories WHERE LOWER(name) = LOWER(?)
}
```

---

## 🔄 Complete Data Flow

### **Example: User Login**

```
┌──────────────────────────────────────────────────────────────────┐
│                    LOGIN FLOW WITH REPOSITORY                     │
└──────────────────────────────────────────────────────────────────┘

1. User submits login form
   ────────────────────────
   Frontend: POST /api/auth/login
   Body: { username: "john_doe", password: "pass123" }
   
   
2. AuthController receives request
   ─────────────────────────────────
   @PostMapping("/login")
   public ResponseEntity<?> login(@RequestBody LoginRequest request) {
       // Authenticate user
       Authentication auth = authenticationManager.authenticate(...);
   }
   
   
3. Spring Security calls UserService
   ────────────────────────────────────
   @Override
   public UserDetails loadUserByUsername(String username) {
       // Service layer
       User user = userRepository.findByUsername(username)
           .orElseThrow(() -> new UsernameNotFoundException("User not found"));
       return user;
   }
   
   
4. UserRepository queries database
   ──────────────────────────────────
   Method Called: userRepository.findByUsername("john_doe")
                         │
                         ▼
   Spring Data JPA generates SQL:
   SELECT * FROM users WHERE username = 'john_doe'
                         │
                         ▼
   MySQL executes query
                         │
                         ▼
   Returns user row:
   {
     id: 1,
     username: "john_doe",
     email: "john@example.com",
     password: "$2a$10$N9qo8uLOickgx...",  // BCrypt hash
     role: "USER",
     monthly_income: 5000.00,
     ...
   }
                         │
                         ▼
   Repository converts to User object
                         │
                         ▼
   Returns: Optional<User>
   
   
5. UserService returns User to AuthController
   ────────────────────────────────────────────
   User object with all data
   
   
6. AuthController validates password
   ────────────────────────────────────
   BCrypt.matches(inputPassword, user.getPassword())
   ✅ Match → Generate JWT token
   ❌ No match → Return 401 error
   
   
7. Response sent to frontend
   ──────────────────────────
   { token: "eyJhbGci...", id: 1, username: "john_doe", ... }
```

### **Example: Creating a Transaction**

```
┌──────────────────────────────────────────────────────────────────┐
│            CREATE TRANSACTION FLOW WITH REPOSITORY                │
└──────────────────────────────────────────────────────────────────┘

1. Frontend sends request
   ────────────────────────
   POST /api/transactions
   Body: {
     title: "Groceries",
     amount: 150,
     type: "EXPENSE",
     category: "Food"
   }
   
   
2. TransactionController receives request
   ─────────────────────────────────────────
   @PostMapping("/transactions")
   public ResponseEntity<?> createTransaction(@RequestBody TransactionRequest req) {
       Transaction transaction = transactionService.createTransaction(req, username);
       return ResponseEntity.ok(transaction);
   }
   
   
3. TransactionService processes
   ───────────────────────────────
   public Transaction createTransaction(TransactionRequest req, String username) {
       // Get user from repository
       User user = userRepository.findByUsername(username)
           .orElseThrow(() -> new RuntimeException("User not found"));
       
       // Create transaction
       Transaction transaction = new Transaction();
       transaction.setUser(user);
       transaction.setTitle(req.getTitle());
       transaction.setAmount(req.getAmount());
       transaction.setType(req.getType());
       transaction.setCategory(req.getCategory());
       
       // Save using repository
       return transactionRepository.save(transaction);
   }
   
   
4. TransactionRepository saves to database
   ──────────────────────────────────────────
   Method Called: transactionRepository.save(transaction)
                         │
                         ▼
   Spring Data JPA generates SQL:
   INSERT INTO transactions (
       user_id, title, amount, type, category, transaction_date
   ) VALUES (
       1, 'Groceries', 150.00, 'EXPENSE', 'Food', '2025-10-06 10:30:00'
   )
                         │
                         ▼
   MySQL executes INSERT
                         │
                         ▼
   Returns generated ID: 123
                         │
                         ▼
   Repository updates transaction object with ID
                         │
                         ▼
   Returns: Transaction object with ID=123
   
   
5. Response sent to frontend
   ──────────────────────────
   {
     id: 123,
     title: "Groceries",
     amount: 150,
     type: "EXPENSE",
     category: "Food",
     transactionDate: "2025-10-06T10:30:00",
     user: { id: 1, username: "john_doe" }
   }
```

---

## 💡 Real Examples from Your Project

### **Example 1: Check if Username Exists (Registration)**

```java
// UserService.java
public ResponseEntity<?> register(AuthRequest request) {
    // Use repository to check if username already taken
    if (userRepository.existsByUsername(request.getUsername())) {
        return ResponseEntity.badRequest()
            .body("Error: Username is already taken!");
    }
    
    // Continue with registration...
}

// What happens behind the scenes:
// userRepository.existsByUsername("john_doe")
//   ↓
// Spring generates SQL:
// SELECT COUNT(*) > 0 FROM users WHERE username = 'john_doe'
//   ↓
// Returns: true (exists) or false (available)
```

### **Example 2: Get User's Transactions**

```java
// TransactionService.java
public List<Transaction> getUserTransactions(String username) {
    // Get user from repository
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));
    
    // Get user's transactions from repository
    return transactionRepository.findByUserOrderByTransactionDateDesc(user);
}

// What happens:
// 1. userRepository.findByUsername("john_doe")
//    → SELECT * FROM users WHERE username = 'john_doe'
//    → Returns User object
//
// 2. transactionRepository.findByUserOrderByTransactionDateDesc(user)
//    → SELECT * FROM transactions 
//      WHERE user_id = 1 
//      ORDER BY transaction_date DESC
//    → Returns List<Transaction>
```

### **Example 3: Calculate Total Income**

```java
// TransactionService.java
public BigDecimal getTotalIncome(String username) {
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));
    
    // Use custom query method
    return transactionRepository.calculateTotalIncome(user);
}

// What happens:
// transactionRepository.calculateTotalIncome(user)
//   ↓
// Executes custom @Query:
// SELECT COALESCE(SUM(amount), 0) 
// FROM transactions 
// WHERE user_id = 1 AND type = 'INCOME'
//   ↓
// Returns: 5000.00 (total income amount)
```

### **Example 4: Get Expense Breakdown**

```java
// TransactionService.java
public Map<String, BigDecimal> getExpenseBreakdown(String username) {
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));
    
    // Get breakdown from repository
    List<Object[]> breakdown = transactionRepository
        .getExpenseBreakdownByCategory(user);
    
    // Convert to Map
    Map<String, BigDecimal> result = new HashMap<>();
    for (Object[] row : breakdown) {
        String category = (String) row[0];
        BigDecimal amount = (BigDecimal) row[1];
        result.put(category, amount);
    }
    return result;
}

// What happens:
// transactionRepository.getExpenseBreakdownByCategory(user)
//   ↓
// Executes custom @Query:
// SELECT category, SUM(amount)
// FROM transactions
// WHERE user_id = 1 AND type = 'EXPENSE'
// GROUP BY category
// ORDER BY SUM(amount) DESC
//   ↓
// Returns: [
//   ["Food", 500.00],
//   ["Transport", 200.00],
//   ["Entertainment", 150.00]
// ]
//   ↓
// Converts to Map:
// {
//   "Food": 500.00,
//   "Transport": 200.00,
//   "Entertainment": 150.00
// }
```

---

## 🎯 Key Benefits of Repositories

### ✅ **1. No SQL Code Needed**
```java
// Instead of this:
String sql = "SELECT * FROM users WHERE username = ?";
PreparedStatement stmt = conn.prepareStatement(sql);
// ... 20 lines of JDBC code

// You write this:
userRepository.findByUsername("john_doe");
```

### ✅ **2. Type Safety**
```java
// Compile-time checking
Optional<User> user = userRepository.findByUsername("john_doe");
// ↑ Compiler knows this returns Optional<User>

// Prevents runtime errors
List<Transaction> transactions = transactionRepository.findByUser(user.get());
// ↑ Type-safe method call
```

### ✅ **3. Automatic CRUD Operations**
```java
// FREE methods from JpaRepository:
userRepository.save(user);           // Insert or update
userRepository.findById(1L);         // Find by ID
userRepository.findAll();            // Get all
userRepository.delete(user);         // Delete
userRepository.count();              // Count rows
```

### ✅ **4. Query Generation from Method Names**
```java
// Just name your method correctly:
findByUsername(String username)
findByEmailAndIsActiveTrue(String email)
findByCreatedAtBetween(LocalDateTime start, LocalDateTime end)

// Spring automatically generates the SQL!
```

### ✅ **5. Easy Testing**
```java
// Mock repository in tests
@Mock
private UserRepository userRepository;

// Setup mock behavior
when(userRepository.findByUsername("john_doe"))
    .thenReturn(Optional.of(testUser));

// Test service without hitting database
```

---

## 📊 Summary

### **What Repositories Do:**
1. **Abstract database operations** - Hide SQL complexity
2. **Provide clean interface** - Simple method calls
3. **Generate queries automatically** - Based on method names
4. **Handle connections** - No manual connection management
5. **Convert data** - Between database rows and Java objects

### **Your Project's Repositories:**

| Repository | Manages | Key Methods |
|------------|---------|-------------|
| **UserRepository** | users table | `findByUsername`, `existsByEmail`, `save` |
| **TransactionRepository** | transactions table | `findByUser`, `calculateTotalIncome`, `getExpenseBreakdown` |
| **CategoryRepository** | categories table | `getIncomeCategories`, `getExpenseCategories` |

### **The Flow:**
```
Controller → Service → Repository → Database
                ↓
         (Business Logic)
```

### **Why They're Awesome:**
✅ No SQL code  
✅ Type-safe  
✅ Easy to test  
✅ Automatic error handling  
✅ Clean, maintainable code  
✅ FREE CRUD operations  

---

**Repositories are the bridge between your Java code and the MySQL database, making data access simple, safe, and efficient!** 🚀
