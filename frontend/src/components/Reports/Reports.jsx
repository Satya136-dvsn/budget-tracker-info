import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../hooks/useAlert';
import { apiService } from '../../services/api';

const Reports = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();
  const { showAlert } = useAlert();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedReportType, setSelectedReportType] = useState('summary');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportsDataState, setReportsDataState] = useState(null);

  // state-backed data (fetched from API)
  const reportsData = reportsDataState || {
    summary: {
      totalIncome: 0,
      totalExpenses: 0,
      totalSavings: 0,
      savingsRate: 0,
      topExpenseCategory: '',
      budgetVariance: 0
    },
    monthly: [],
    categories: []
  };

  useEffect(() => {
    // Wait for auth to finish loading and user to be available
    if (authLoading) return;
    if (!user) {
      setError('You must be signed in to view reports');
      return;
    }

    const loadReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('Not authenticated. Please sign in to view reports.');
          setLoading(false);
          return;
        }
        // financial summary
        const summary = await apiService.getFinancialSummary();

        // expense breakdown (categories)
        const categories = await apiService.getExpenseBreakdown();

        // recent monthly data - we'll request monthly summary for last 6 months
        const now = new Date();
        const monthlyPromises = [];
        const months = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          months.push({ year: d.getFullYear(), month: d.getMonth() + 1, label: d.toLocaleString('default', { month: 'short' }) });
          monthlyPromises.push(apiService.getMonthlyFinancialSummary(d.getFullYear(), d.getMonth() + 1).catch(() => null));
        }

        const monthlyResults = await Promise.all(monthlyPromises);

        const monthly = months.map((m, idx) => {
          const res = monthlyResults[idx];
          return {
            month: m.label,
            income: res?.income || 0,
            expenses: res?.expenses || 0,
            savings: (res?.income || 0) - (res?.expenses || 0)
          };
        });

        setReportsDataState({ summary, monthly, categories });
      } catch (err) {
        const msg = err?.message || String(err);
        // If backend says user not found, force logout and prompt re-login
        if (msg.toLowerCase().includes('user not found') || msg.toLowerCase().includes('user not exist')) {
          showAlert('Session expired or invalid. Please sign in again.', 'error');
          logout();
          setError('Session expired. Redirecting to sign in...');
          // give user a moment to see the message then navigate
          setTimeout(() => navigate('/signin'), 800);
          return;
        }

        setError(msg || 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [authLoading, user]);

  const handleDownloadReport = (format) => {
    showAlert(`Downloading ${selectedReportType} report as ${format.toUpperCase()}...`, 'success');
    // Implement actual download logic here
  };

  const handlePrintReport = () => {
    window.print();
    showAlert('Opening print dialog...', 'info');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const renderSummaryReport = () => (
    <div className="report-content">
      <div className="report-stats-grid">
        <div className="report-stat-card income">
          <div className="stat-icon">
            <span className="emoji-icon">💰</span>
          </div>
          <div className="stat-info">
            <h3>Total Income</h3>
            <span className="stat-value">{formatCurrency(reportsData.summary.totalIncome)}</span>
            <span className="stat-period">Last 6 months</span>
          </div>
        </div>

        <div className="report-stat-card expense">
          <div className="stat-icon">
            <span className="emoji-icon">💸</span>
          </div>
          <div className="stat-info">
            <h3>Total Expenses</h3>
            <span className="stat-value">{formatCurrency(reportsData.summary.totalExpenses)}</span>
            <span className="stat-period">Last 6 months</span>
          </div>
        </div>

        <div className="report-stat-card savings">
          <div className="stat-icon">
            <span className="emoji-icon">🏦</span>
          </div>
          <div className="stat-info">
            <h3>Total Savings</h3>
            <span className="stat-value">{formatCurrency(reportsData.summary.totalSavings)}</span>
            <span className="stat-period">{(reportsData.summary.savingsRate || 0)}% savings rate</span>
          </div>
        </div>

        <div className="report-stat-card rate">
          <div className="stat-icon">
            <span className="emoji-icon">📈</span>
          </div>
          <div className="stat-info">
            <h3>Budget Performance</h3>
            <span className="stat-value">{(reportsData.summary.budgetVariance > 0 ? '+' : '') + (reportsData.summary.budgetVariance || 0)}%</span>
            <span className="stat-period">vs planned budget</span>
          </div>
        </div>
      </div>

      <div className="report-insights">
        <div className="insight-card">
          <h3>💡 Key Insights</h3>
          <ul className="insights-list">
            <li>Your savings rate of {(reportsData.summary.savingsRate || 0)}% is above the recommended 15%</li>
            <li>Highest spending category: {reportsData.summary.topExpenseCategory || 'N/A'}</li>
            <li>You're {Math.abs(reportsData.summary.budgetVariance || 0)}% {(reportsData.summary.budgetVariance || 0) > 0 ? 'over' : 'under'} your planned budget</li>
            <li>Consider setting up automatic savings to maintain consistency</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderMonthlyReport = () => (
    <div className="report-content">
        <div className="monthly-chart">
        <h3>📊 Monthly Income vs Expenses</h3>
        <div className="chart-bars">
          {reportsData.monthly.map((month, index) => (
            <div key={index} className="month-bar">
              <div className="bar-container">
                <div 
                  className="income-bar" 
                  style={{ height: `${(month.income / Math.max(1, Math.max(...reportsData.monthly.map(m=>m.income), 5000))) * 100}%` }}
                  title={`Income: ${formatCurrency(month.income)}`}
                ></div>
                <div 
                  className="expense-bar" 
                  style={{ height: `${(month.expenses / Math.max(1, Math.max(...reportsData.monthly.map(m=>m.income), 5000))) * 100}%` }}
                  title={`Expenses: ${formatCurrency(month.expenses)}`}
                ></div>
              </div>
              <span className="month-label">{month.month}</span>
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color income"></div>
            <span>Income</span>
          </div>
          <div className="legend-item">
            <div className="legend-color expense"></div>
            <span>Expenses</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCategoryReport = () => (
    <div className="report-content">
        <div className="category-report">
        <h3>🥧 Expense Categories Breakdown</h3>
        <div className="category-bars">
          {reportsData.categories.map((category, index) => (
            <div key={index} className="category-bar-item">
              <div className="category-info">
                <span className="category-name">{category.category || category.name}</span>
                <span className="category-amount">{formatCurrency(category.amount || category.amount)}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${Math.round(((category.amount || 0) / Math.max(1, reportsData.summary.totalExpenses || 1)) * 100)}%`,
                    backgroundColor: `hsl(${index * 60}, 70%, 60%)`
                  }}
                ></div>
              </div>
              <span className="category-percentage">{Math.round(((category.amount || 0) / Math.max(1, reportsData.summary.totalExpenses || 1)) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="reports-page">
        <div className="reports-header">
          <div className="header-left">
            <div className="header-title">
              <h1>Financial Reports</h1>
              <p>Loading data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-page">
        <div className="reports-header">
          <div className="header-left">
            <div className="header-title">
              <h1>Financial Reports</h1>
              <p>Error loading reports: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      {/* Header */}
      <div className="reports-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <span style={{ fontSize: '1rem' }}>&#8592;</span>
          </button>
          <div className="header-title">
            <h1>Financial Reports</h1>
            <p>Comprehensive analysis of your financial data</p>
          </div>
        </div>
        <div className="header-actions">
          <select 
            className="period-selector"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))',
              border: '2px solid rgba(102, 126, 234, 0.2)',
              padding: '0.65rem 1.2rem',
              borderRadius: '12px',
              color: '#374151',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '0.9rem',
              minWidth: '140px',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none',
              backgroundImage: `linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95)), url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23667eea' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: '0 0, right 0.75rem center',
              backgroundRepeat: 'no-repeat, no-repeat',
              backgroundSize: '100% 100%, 1.2rem',
              paddingRight: '2.5rem'
            }}
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
            <option value="all">All Time</option>
          </select>
          <button className="action-btn" onClick={handlePrintReport}>
            <i className="fas fa-print"></i>
            Print
          </button>
          <button className="action-btn" onClick={() => handleDownloadReport('pdf')}>
            <i className="fas fa-download"></i>
            Export PDF
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="report-nav">
        <button 
          className={`report-nav-btn ${selectedReportType === 'summary' ? 'active' : ''}`}
          onClick={() => setSelectedReportType('summary')}
        >
          <span className="emoji-icon">📋</span>
          Summary Report
        </button>
        <button 
          className={`report-nav-btn ${selectedReportType === 'monthly' ? 'active' : ''}`}
          onClick={() => setSelectedReportType('monthly')}
        >
          <span className="emoji-icon">📅</span>
          Monthly Analysis
        </button>
        <button 
          className={`report-nav-btn ${selectedReportType === 'category' ? 'active' : ''}`}
          onClick={() => setSelectedReportType('category')}
        >
          <span className="emoji-icon">🏷️</span>
          Category Breakdown
        </button>
      </div>

      {/* Report Content */}
      <div className="report-container">
        <div className="report-header-info">
          <h2>
            {selectedReportType === 'summary' && '📋 Financial Summary Report'}
            {selectedReportType === 'monthly' && '📅 Monthly Analysis Report'}
            {selectedReportType === 'category' && '🏷️ Category Breakdown Report'}
          </h2>
          <p>Generated on {new Date().toLocaleDateString()}</p>
        </div>

        {selectedReportType === 'summary' && renderSummaryReport()}
        {selectedReportType === 'monthly' && renderMonthlyReport()}
        {selectedReportType === 'category' && renderCategoryReport()}
      </div>
    </div>
  );
};

export default Reports;
