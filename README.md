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

## 🎯 **Next Phase: Milestone 2**

### 📊 **Expense & Income Tracking** (Coming Next)
- Transaction management (Add/Edit/Delete)
- Category-based expense organization
- Income tracking and management
- Financial reporting and analytics
- Budget vs actual spending comparison
- Data visualization with charts

### 📈 **Planned Features**
- Monthly/yearly financial reports
- Category-wise expense breakdown
- Budget alerts and notifications
- Export functionality (PDF/CSV)
- Advanced filtering and search
- Financial insights and recommendations

## 🎨 **UI Features**
- Modern glassmorphism design
- Responsive layout for all devices
- Role-based navigation and components
- Professional color schemes and animations
- Intuitive user experience

## 📈 **Project Milestones**

- [x] **Milestone 1**: Authentication & User Management ✅
- [ ] **Milestone 2**: Expense & Income Tracking
- [ ] **Milestone 3**: Reporting & Analytics
- [ ] **Milestone 4**: Advanced Features & Optimization

## 🤝 **Contributing**
This is a learning project demonstrating full-stack development with modern technologies. Feel free to explore the codebase and suggest improvements!

## 📄 **License**
This project is for educational purposes and portfolio demonstration.

---

**Last Updated**: October 1, 2025  
**Status**: Milestone 1 Complete ✅ | Milestone 2 In Progress 🚧

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