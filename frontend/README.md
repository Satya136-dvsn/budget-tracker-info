# Budget Tracker Frontend

Modern React frontend for the Budget Tracker application.

## 🚧 Status: Coming Soon

This directory is prepared for the React frontend implementation using Vite.

## 📋 Planned Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules + Material-UI/Chakra UI
- **State Management**: React Context API or Redux Toolkit
- **HTTP Client**: Axios or Fetch API
- **Routing**: React Router v6
- **Forms**: React Hook Form + Yup validation
- **Testing**: Jest + React Testing Library

## 🎯 Planned Features

- ✅ Modern responsive design
- ✅ User authentication (login/register/logout)
- ✅ Role-based UI (User/Admin)
- ✅ Dashboard with budget overview
- ✅ Expense tracking and categorization
- ✅ Income management
- ✅ Budget goals and alerts
- ✅ Data visualization with charts
- ✅ Profile management
- ✅ Progressive Web App (PWA) support

## 🚀 Getting Started (Once Implemented)

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
cd frontend
npm install
npm run dev
```

### Build for Production
```bash
npm run build
```

## 🔗 API Integration

The frontend will communicate with the Spring Boot backend via RESTful APIs:
- Backend URL: `http://localhost:8080`
- Authentication: JWT Bearer tokens
- CORS: Already configured in backend

## 📁 Planned Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks  
│   ├── services/          # API service functions
│   ├── contexts/          # React Context providers
│   ├── utils/             # Utility functions
│   ├── styles/            # Global styles
│   ├── types/             # TypeScript type definitions
│   └── App.tsx
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🎨 Design System

- **Colors**: Primary blue theme with accessibility support
- **Typography**: Clean, modern font stack
- **Components**: Consistent design patterns
- **Responsive**: Mobile-first approach
- **Dark Mode**: Optional theme support

---

**To implement**: Run `npm create vite@latest . -- --template react-ts` in this directory to get started.