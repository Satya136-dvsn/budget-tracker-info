import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AlertProvider } from './hooks/useAlert';
import CleanSidebar from './components/Layout/CleanSidebar';
import CleanHome from './components/Home/CleanHome';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import ForgotPassword from './components/Auth/ForgotPassword';
import CleanDashboard from './components/Dashboard/CleanDashboard';
import ProfileNew from './components/Profile/ProfileNew';
import AdminDashboard from './components/Admin/AdminDashboard';
import Reports from './components/Reports/Reports';
import Transactions from './components/Transactions/Transactions';
import Budget from './components/Budget/Budget';
// import SavingsGoals from './components/SavingsGoals/SavingsGoals'; // Now included in FinancialPlanner
import FinancialHealthAnalysis from './components/FinancialHealth/FinancialHealthAnalysis';
import CleanTrends from './components/Trends/CleanTrends';
import MonthlySpendingResponsive from './components/Trends/MonthlySpendingResponsive';
import CleanCategoryAnalysis from './components/Trends/CleanCategoryAnalysis';
import SavingsGrowthResponsive from './components/Trends/SavingsGrowthResponsive';
import Export from './components/Export/Export';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import { BillsDashboard } from './components/Bills';
import { NotificationCenter } from './components/Notifications';
import { AIDashboard } from './components/AI';
import { CommunityHub } from './components/Community';
import { InvestmentDashboard } from './components/Investment';
import FinancialPlanner from './components/Planning/FinancialPlanner';
import UserProfile from './components/Profile/UserProfile';
// import RealTimeStatus from './components/Common/RealTimeStatus'; // Removed as requested
import RealTimeToast from './components/Common/RealTimeToast';

import RetirementCalculator from './components/Planning/RetirementCalculator';
import DebtOptimizer from './components/Planning/DebtOptimizer';
import TaxPlanner from './components/Planning/TaxPlanner';
import CurrencyDashboard from './components/Currency/CurrencyDashboard';
import BankIntegration from './components/Banking/BankIntegration';
import Alert from './components/Common/Alert';
import ErrorBoundary from './components/Common/ErrorBoundary';
import './styles/clean-layout.css';
import './styles/global-layout-fix.css';
import './styles/component-layout-fix.css';
import './styles/chart-layout-fix.css';
import './styles/comprehensive-layout-fix.css';
import './styles/dropdown-fix.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
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

// Public Route Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  return (
    <div className="app-container">
      <CleanSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isAuthenticated={isAuthenticated}
      />
      
      <main className={isHomePage ? 'main-content-full' : `main-content ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
        <Alert />
        {isAuthenticated && !isHomePage && (
          <>
            <RealTimeToast />
          </>
        )}
        <Routes>
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <CleanHome />
          } />
          
          {/* Auth Routes */}
          <Route path="/signin" element={
            <PublicRoute><SignIn /></PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute><SignUp /></PublicRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicRoute><ForgotPassword /></PublicRoute>
          } />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute><CleanDashboard /></ProtectedRoute>
          } />
          <Route path="/transactions" element={
            <ProtectedRoute><Transactions /></ProtectedRoute>
          } />
          <Route path="/budgets" element={
            <ProtectedRoute><Budget /></ProtectedRoute>
          } />
          <Route path="/savings-goals" element={
            <Navigate to="/planning" replace />
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfileNew /></ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute><UserProfile /></ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute><Reports /></ProtectedRoute>
          } />
          <Route path="/financial-health" element={
            <ProtectedRoute><FinancialHealthAnalysis /></ProtectedRoute>
          } />
          
          {/* Trends Routes */}
          <Route path="/trends" element={
            <ProtectedRoute>
              <ErrorBoundary>
                <CleanTrends />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/trends/monthly-spending" element={
            <ProtectedRoute>
              <ErrorBoundary>
                <MonthlySpendingResponsive />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/trends/category-analysis" element={
            <ProtectedRoute>
              <ErrorBoundary>
                <CleanCategoryAnalysis />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/trends/savings-growth" element={
            <ProtectedRoute>
              <ErrorBoundary>
                <SavingsGrowthResponsive />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          
          {/* Analytics Route */}
          <Route path="/analytics" element={
            <ProtectedRoute>
              <ErrorBoundary>
                <AnalyticsDashboard />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          
          {/* Bills Routes */}
          <Route path="/bills" element={
            <ProtectedRoute>
              <ErrorBoundary>
                <BillsDashboard />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          
          {/* Notifications Route */}
          <Route path="/notifications" element={
            <ProtectedRoute>
              <ErrorBoundary>
                <NotificationCenter />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          
          {/* AI Routes */}
          <Route path="/ai" element={
            <ProtectedRoute>
              <ErrorBoundary>
                <AIDashboard />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          
          {/* Community Routes */}
          <Route path="/community" element={
            <ProtectedRoute>
              <ErrorBoundary>
                <CommunityHub />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          
          {/* Investment Routes */}
          <Route path="/investments" element={
            <ProtectedRoute>
              <ErrorBoundary>
                <InvestmentDashboard />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          
          {/* Financial Planning Routes */}
          <Route path="/planning" element={
            <ProtectedRoute>
              <ErrorBoundary>
                <FinancialPlanner />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/planning/retirement" element={
            <ProtectedRoute>
              <ErrorBoundary>
                <RetirementCalculator />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/planning/debt" element={
            <ProtectedRoute>
              <ErrorBoundary>
                <DebtOptimizer />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/planning/tax" element={
            <ProtectedRoute>
              <ErrorBoundary>
                <TaxPlanner />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          
          {/* Currency Routes */}
          <Route path="/currencies" element={
            <ProtectedRoute>
              <ErrorBoundary>
                <CurrencyDashboard />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          
          {/* Bank Integration Routes */}
          <Route path="/banking" element={
            <ProtectedRoute>
              <ErrorBoundary>
                <BankIntegration />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          
          {/* Other Routes */}
          <Route path="/export" element={
            <ProtectedRoute>
              <ErrorBoundary>
                <Export />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute><AdminDashboard /></AdminRoute>
          } />
        </Routes>
      </main>
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