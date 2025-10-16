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
import ProfileNew from './components/Profile/ProfileNew';
import AdminDashboard from './components/Admin/AdminDashboard';
import Reports from './components/Reports/Reports';
import Transactions from './components/Transactions/Transactions';
import Budget from './components/Budget/Budget';
import SavingsGoals from './components/SavingsGoals/SavingsGoals';
import FinancialHealthAnalysis from './components/FinancialHealth/FinancialHealthAnalysis';
import Trends from './components/Trends/Trends';
import MonthlySpending from './components/Trends/MonthlySpending';
import CategoryAnalysis from './components/Trends/CategoryAnalysis';
import SavingsGrowth from './components/Trends/SavingsGrowth';
import Export from './components/Export/Export';
import FinancialInsights from './components/Insights/FinancialInsights';
import Alert from './components/Common/Alert';
import ErrorBoundary from './components/Common/ErrorBoundary';
import './styles/App.css';
import './styles/override.css';
import './components/FinancialHealth/FinancialHealthAnalysis.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  // If auth is still loading, render a small placeholder to avoid redirect loops
  if (loading) return <div style={{ padding: '2rem' }}>Checking authentication...</div>;
  return isAuthenticated ? children : <Navigate to="/signin" />;
};

// Admin Protected Route Component
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }
  
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  // Don't redirect while auth is still loading
  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
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
          path="/transactions" 
          element={
            <div className="container">
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            </div>
          } 
        />
        <Route 
          path="/budgets" 
          element={
            <div className="container">
              <ProtectedRoute>
                <Budget />
              </ProtectedRoute>
            </div>
          } 
        />
        <Route 
          path="/savings-goals" 
          element={
            <div className="container">
              <ProtectedRoute>
                <SavingsGoals />
              </ProtectedRoute>
            </div>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <div className="container">
              <ProtectedRoute>
                <ProfileNew />
              </ProtectedRoute>
            </div>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <div className="container">
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </div>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <div className="container">
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            </div>
          } 
        />
        <Route 
          path="/financial-health" 
          element={
            <ProtectedRoute>
              <FinancialHealthAnalysis />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/trends/monthly-spending" 
          element={
            <div className="container">
              <ProtectedRoute>
                <ErrorBoundary>
                  <MonthlySpending />
                </ErrorBoundary>
              </ProtectedRoute>
            </div>
          } 
        />
        <Route 
          path="/trends/category-analysis" 
          element={
            <div className="container">
              <ProtectedRoute>
                <ErrorBoundary>
                  <CategoryAnalysis />
                </ErrorBoundary>
              </ProtectedRoute>
            </div>
          } 
        />
        <Route 
          path="/trends/savings-growth" 
          element={
            <div className="container">
              <ProtectedRoute>
                <ErrorBoundary>
                  <SavingsGrowth />
                </ErrorBoundary>
              </ProtectedRoute>
            </div>
          } 
        />
        <Route 
          path="/export" 
          element={
            <div className="container">
              <ProtectedRoute>
                <ErrorBoundary>
                  <Export />
                </ErrorBoundary>
              </ProtectedRoute>
            </div>
          } 
        />
        <Route 
          path="/insights" 
          element={
            <div className="container">
              <ProtectedRoute>
                <ErrorBoundary>
                  <FinancialInsights />
                </ErrorBoundary>
              </ProtectedRoute>
            </div>
          } 
        />
        <Route 
          path="/trends" 
          element={
            <div className="container">
              <ProtectedRoute>
                <ErrorBoundary>
                  <Trends />
                </ErrorBoundary>
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
