# Budget Tracker - Full Stack Application

A modern full-stack budget tracking application with Spring Boot backend and React frontend.

## 📁 Project Structure

```
budget-tracker-project/
├── backend/                    # Spring Boot REST API
│   ├── src/
│   │   ├── main/java/com/budgettracker/
│   │   └── test/
│   ├── pom.xml
│   └── README.md
├── frontend/                   # React + Vite Frontend (Coming Soon)
│   ├── src/
│   ├── package.json
│   └── README.md
├── docker-compose.yml          # Docker orchestration (Coming Soon)
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Maven 3.9+
- Node.js 18+ (for frontend)
- MySQL 8.0+

### Backend Setup (Spring Boot)

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Configure database**
   - Update `src/main/resources/application.properties` with your MySQL credentials
   - Run the database setup scripts

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```
   - Backend will be available at `http://localhost:8080`

### Frontend Setup (React - Coming Soon)

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   - Frontend will be available at `http://localhost:5173`

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