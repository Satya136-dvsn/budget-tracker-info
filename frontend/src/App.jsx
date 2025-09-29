import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AlertProvider } from './hooks/useAlert';
import Navbar from './components/Layout/Navbar';
import Home from './components/Home/Home';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import ForgotPassword from './components/Auth/ForgotPassword';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Profile/Profile';
import MonthlySpending from './components/Trends/MonthlySpending';
import CategoryAnalysis from './components/Trends/CategoryAnalysis';
import SavingsGrowth from './components/Trends/SavingsGrowth';
import Alert from './components/Common/Alert';
import './styles/App.css';
import './styles/override.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/signin" />;
};

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function AppContent() {
  return (
    <div className="App">
      <Navbar />
      <Alert />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/signin" 
          element={
            <div className="container">
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            </div>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <div className="container">
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            </div>
          } 
        />
        <Route 
          path="/forgot-password" 
          element={
            <div className="container">
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            </div>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <div className="container">
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </div>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <div className="container">
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </div>
          } 
        />
        <Route 
          path="/trends/monthly-spending" 
          element={
            <div className="container">
              <ProtectedRoute>
                <MonthlySpending />
              </ProtectedRoute>
            </div>
          } 
        />
        <Route 
          path="/trends/category-analysis" 
          element={
            <div className="container">
              <ProtectedRoute>
                <CategoryAnalysis />
              </ProtectedRoute>
            </div>
          } 
        />
        <Route 
          path="/trends/savings-growth" 
          element={
            <div className="container">
              <ProtectedRoute>
                <SavingsGrowth />
              </ProtectedRoute>
            </div>
          } 
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <Router>
          <AppContent />
        </Router>
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;
