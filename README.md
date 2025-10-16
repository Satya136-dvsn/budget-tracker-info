# 💰 Budget Tracker - Full Stack Application

## 🎯 Project Overview
A comprehensive budget tracking application built with Spring Boot backend and React frontend, featuring JWT authentication, role-based access control, and modern UI design.

## ✅ **MILESTONE 1 COMPLETED** - Authentication & User Management

### � **Authentication System**
- ✅ JWT-based authentication with role differentiation (USER/ADMIN)
- ✅ User registration and login system
- ✅ Password encryption with BCrypt
- ✅ Token-based session management
- ✅ Role-based access control (RBAC)

### 👤 **User Management**
- ✅ User profile management with financial data
- ✅ Enhanced profile editing (income, savings, expenses)
- ✅ User account creation and authentication
- ✅ Profile data persistence and updates

### 👨‍💼 **Admin Features**
- ✅ Complete admin dashboard with user statistics
- ✅ User management interface (view all users, user details)
- ✅ Admin-only API endpoints with proper authorization
- ✅ Dashboard analytics (total users, active users, admin count)

### 🎨 **Frontend Features**
- ✅ Modern React application with Vite
- ✅ Role-based UI components and navigation
- ✅ Professional glassmorphism design
- ✅ Mobile responsive layout
- ✅ Protected routes and admin access control
- ✅ Enhanced forms and user experience

## 🚀 **Technology Stack**

### Backend
- **Framework**: Spring Boot 3.5.3
- **Security**: Spring Security with JWT
- **Database**: MySQL 8.0 with JPA/Hibernate
- **Build Tool**: Maven
- **Java Version**: 24.0.1

### Frontend  
- **Framework**: React 18 with Vite 7.1.7
- **Styling**: Custom CSS with glassmorphism effects
- **HTTP Client**: Axios for API communication
- **Routing**: React Router for navigation
- **State Management**: React Context API

## 📁 **Project Structure**

```
budget-tracker-project/
├── backend/
│   ├── src/main/java/com/budgettracker/
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── UserProfileController.java
│   │   │   └── AdminController.java ✨
│   │   ├── security/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/ (SignIn, SignUp, ForgotPassword)
│   │   │   ├── Dashboard/
│   │   │   ├── Admin/ ✨
│   │   │   │   └── AdminDashboard.jsx
│   │   │   ├── Profile/
│   │   │   │   └── ProfileNew.jsx ✨
│   │   │   └── Layout/
│   │   ├── utils/
│   │   │   └── RoleBasedAccess.jsx ✨
│   │   ├── contexts/
│   │   ├── services/
│   │   └── styles/
│   └── package.json
```

## 📋 **API Endpoints**

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Admin (Admin Role Required)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/{id}` - Get user by ID
- `GET /api/admin/dashboard-stats` - Get dashboard statistics

## 🧪 **Testing Status**
- ✅ All API endpoints tested with Postman
- ✅ Authentication and authorization validated
- ✅ Role-based access control verified
- ✅ User profile CRUD operations confirmed
- ✅ Admin features tested and working

## 🚀 **Getting Started**

### Prerequisites
- Java 17+ (Currently using Java 24.0.1)
- Node.js 18+
- MySQL 8.0
- Maven 3.6+

### Backend Setup
```bash
cd backend
mvn spring-boot:run
# Server runs on http://localhost:8080
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Server runs on http://localhost:5173
```

### Database Configuration
Update `backend/src/main/resources/application.properties` with your MySQL credentials:
```properties
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/budget_tracker
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## 📱 **Demo Accounts**
- **Regular User**: `testuser1` / `password123`
- **Admin User**: `admin` / `admin123` (requires role update in database)

## ✅ **MILESTONE 2 COMPLETED** - Frontend-Backend Integration & Transaction Management (100%)

### 💼 **Transaction Management System**
- ✅ Complete transaction CRUD operations (Create, Read, Update, Delete)
- ✅ Dedicated Transactions page with professional UI
- ✅ Filtering by transaction type (Income/Expense/All)
- ✅ Filtering by category with dynamic category loading
- ✅ Search functionality across transaction titles
- ✅ Sorting by date and amount (ascending/descending)
- ✅ Summary cards displaying financial totals
- ✅ Add/Edit modal with form validation
- ✅ Delete confirmation dialogs
- ✅ Responsive table layout for all devices

### 🎛️ **Dashboard Backend Integration**
- ✅ Connected expense form to backend API
- ✅ Dynamic category loading from backend
- ✅ Recent transactions display (5 most recent)
- ✅ Visual indicators for income vs expenses
- ✅ Real-time data updates after submissions
- ✅ Empty states with call-to-action buttons
- ✅ Seamless navigation to Transactions page

### 📡 **Backend Features**
- ✅ All 20+ transaction API endpoints implemented
- ✅ Category management endpoints (expense, income, all)
- ✅ Transaction filtering and aggregation
- ✅ Financial summary calculations
- ✅ Category-based breakdown analysis
- ✅ JWT authentication on all endpoints
- ✅ Username-based transaction ownership

### 🎨 **UI/UX Enhancements**
- ✅ Professional Profile page with glassmorphism effects
- ✅ Enhanced form styling with smooth transitions
- ✅ Color-coded financial data (income: green, expense: red)
- ✅ Role-based badge styling (Admin/User)
- ✅ Mobile-responsive design (3 breakpoints)
- ✅ Smooth animations and loading states
- ✅ Improved spacing and typography

### 📊 **Reports & Analytics**
- ✅ Reports page integration with live data
- ✅ Financial summary display (income, expenses, balance)
- ✅ Category-based expense/income breakdown
- ✅ Real-time financial metrics calculation
- ✅ Visual data presentation

## ✅ **MILESTONE 3 COMPLETED** - Budget and Savings Goals (100%)

### � **Budget Management System**
- ✅ Monthly budget setting by category
- ✅ Auto-tracking of progress and remaining budget
- ✅ Spent amount calculated from transactions
- ✅ Color-coded progress indicators (green/orange/red)
- ✅ Over-budget detection and warnings
- ✅ Month/year selector with filtering
- ✅ Summary cards (Total Budget, Spent, Remaining)
- ✅ Create/Edit/Delete budget operations
- ✅ Unique constraint per category/month/year
- ✅ Budget recalculation API endpoint

### 🎯 **Savings Goals System**
- ✅ Define savings goals with target amounts
- ✅ Monitor progress with visual indicators
- ✅ Add and withdraw funds functionality
- ✅ Target date tracking with days remaining
- ✅ Status management (In Progress, Completed, Cancelled)
- ✅ Auto-completion when target reached
- ✅ Filter by status (All, Active, Completed)
- ✅ Summary cards for active goals
- ✅ Progress percentage visualization
- ✅ Complete CRUD operations

### � **Backend Features**
- ✅ 20 new REST API endpoints (8 budget + 12 savings goal)
- ✅ Budget and SavingsGoal entity models
- ✅ Repository layer with custom queries
- ✅ Service layer with business logic
- ✅ Auto-calculation of spent amounts from transactions
- ✅ Validation on all inputs
- ✅ JWT authentication on all endpoints
- ✅ Database migration script provided

### 🎨 **UI/UX Features**
- ✅ Responsive Budget component with modal
- ✅ Responsive SavingsGoals component with filters
- ✅ Progress bars with smooth animations
- ✅ Glassmorphism design consistency
- ✅ Mobile-responsive layouts
- ✅ Color-coded status badges
- ✅ Intuitive action buttons
- ✅ Confirmation dialogs for deletions

## 🎨 **UI Features**
- Modern glassmorphism design
- Responsive layout for all devices
- Role-based navigation and components
- Professional color schemes and animations
- Intuitive user experience

## 📈 **Project Milestones**

- [x] **Milestone 1**: Authentication & User Management ✅ (100%)
  - [x] JWT-based authentication
  - [x] User registration and login
  - [x] Role-based access control (USER/ADMIN)
  - [x] Admin dashboard with user management
  - [x] Enhanced profile management
  
- [x] **Milestone 2**: Frontend-Backend Integration & Transaction Management ✅ (100%)
  - [x] Backend APIs (20+ Transaction endpoints)
  - [x] Reports Page Integration
  - [x] Dashboard Transaction Form Integration
  - [x] Complete Transaction Management Page
  - [x] Dynamic Category Loading
  - [x] Recent Transactions Display
  - [x] Profile UI Enhancement
  
- [x] **Milestone 3**: Budget and Savings Goals ✅ (100%)
  - [x] Monthly budget setting by category
  - [x] Auto-track progress and remaining budget
  - [x] Define and monitor savings goals
  - [x] 20 new REST API endpoints
  - [x] Budget and SavingsGoal entities
  - [x] Complete UI components with filtering
  - [x] Progress visualization and status management
  
- [ ] **Milestone 4**: Charts & Analytics
  - [ ] Interactive charts and graphs
  - [ ] Monthly/yearly financial trends
  - [ ] Budget vs Actual analysis
  - [ ] Financial insights dashboard
  
- [ ] **Milestone 5**: Advanced Features & Export
  - [ ] Export functionality (PDF/CSV)
  - [ ] Discussion forum for financial tips
  - [ ] Advanced reporting features

## 🤝 **Contributing**
This is a learning project demonstrating full-stack development with modern technologies. Feel free to explore the codebase and suggest improvements!

## 📄 **License**
This project is for educational purposes and portfolio demonstration.

---

**Last Updated**: October 2025  
**Status**: Milestone 1 Complete ✅ (100%) | Milestone 2 Complete ✅ (100%) | Milestone 3 Complete ✅ (100%)  
**Overall Completion**: 60% (3 of 5 milestones complete)

**Recent Updates**: 
- ✅ **NEW: Milestone 3 Complete** - Budget and Savings Goals module
- ✅ Monthly budget management with auto-tracking
- ✅ Savings goals with progress visualization
- ✅ 20 new REST API endpoints (8 budget + 12 savings goal)
- ✅ Budget and SavingsGoal entity models with repositories
- ✅ Complete UI components with filtering and status management
- ✅ ~4,190 lines of new code written
- ✅ Comprehensive documentation (API docs, summary, setup guide)
- ✅ Database migration script for budgets and savings_goals tables
- 🎯 Next: Milestone 4 - Charts & Analytics (Days 5-8)

## 📚 **Documentation**

This project includes comprehensive documentation:

### General Documentation
1. **MILESTONE_1_FLOW_EXPLANATION.md** - Complete authentication flow with diagrams
2. **MILESTONES_1_2_COMPLETION_REPORT.md** - Detailed completion verification
3. **FRONTEND_BACKEND_CONNECTION_GUIDE.md** - How the project connects and works
4. **MILESTONES_3_4_5_IMPLEMENTATION_PLAN.md** - 14-day implementation plan
5. **IMPLEMENTATION_CHECKLIST.md** - Daily progress tracking
6. **SPRINT_TIMELINE.md** - Visual timeline and progress tracker
7. **PROJECT_COMPLETE_PROGRESS_SUMMARY.md** - Complete project overview

### Milestone 3 Documentation (NEW)
8. **backend/MILESTONE_3_API_DOCUMENTATION.md** - Complete API reference for 20 endpoints
9. **MILESTONE_3_IMPLEMENTATION_SUMMARY.md** - Implementation overview with statistics
10. **MILESTONE_3_SETUP_GUIDE.md** - Step-by-step setup and testing guide

## 🔧 Features

### Current (Backend + Static Frontend)
- ✅ User registration and authentication
- ✅ JWT token-based security
- ✅ User/Admin role management
- ✅ Profile management
- ✅ RESTful API endpoints
- ✅ Static HTML/CSS/JS frontend
- ✅ Role-based signup with dropdown selection

### Planned (React Frontend)
- 🔄 Modern React UI with components
- 🔄 State management with Context/Redux
- 🔄 Responsive design with Material-UI
- 🔄 Real-time budget tracking
- 🔄 Data visualization with charts
- 🔄 Progressive Web App (PWA) features

## 📚 API Documentation

The backend provides RESTful APIs for:
- Authentication (`/api/auth/*`)
- User Profile (`/api/user/*`)
- Budget Management (planned)

See `backend/API_DOCUMENTATION.md` for detailed API documentation.

## 🏗️ Architecture

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.5.3
- **Security**: Spring Security with JWT
- **Database**: MySQL with JPA/Hibernate
- **Build Tool**: Maven

### Frontend (Planned - React)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules + Material-UI
- **State Management**: React Context/Redux Toolkit

## 🚢 Deployment

### Development
```bash
# Backend
cd backend && mvn spring-boot:run

# Frontend (when available)
cd frontend && npm run dev
```

### Production
```bash
# Build frontend
cd frontend && npm run build

# Package backend with frontend
cd backend && mvn clean package

# Run production build
java -jar backend/target/budget-tracker-backend-0.0.1-SNAPSHOT.jar
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md) (Coming Soon)
- [API Documentation](./backend/API_DOCUMENTATION.md)

---

**Current Status**: Backend complete with static frontend. React frontend migration in progress.
