import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../hooks/useAlert';
import { apiService } from '../../services/api';

const Reports = () => {
  const navigate = useNavigate();
  const { token, loading, isAuthenticated } = useAuth();
  const { showAlert } = useAlert();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedReportType, setSelectedReportType] = useState('summary');

  // live API-backed data
  const [reportsData, setReportsData] = useState({
    summary: null,
    monthly: [],
    categories: []
  });
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    let mounted = true;

    const fetchReports = async () => {
      // Wait until auth finished loading and we have a token
      if (loading) return;
      if (!token && !isAuthenticated) return; // nothing to fetch when not auth'd

      setLoadingData(true);
      setError(null);
      try {
        const [summary, monthly, categories] = await Promise.all([
          apiService.getFinancialSummary(),
          apiService.getMonthlyFinancialSummary(selectedPeriod),
          apiService.getExpenseBreakdown()
        ]);

        if (!mounted) return;
        setReportsData({
          summary: summary || null,
          monthly: monthly || [],
          categories: categories || []
        });
      } catch (err) {
        console.error('Failed to load reports data', err);
        setError(err.message || 'Failed to load reports');
      } finally {
        if (mounted) setLoadingData(false);
      }
    };

    fetchReports();

    return () => { mounted = false; };
  }, [selectedPeriod, loading, token, isAuthenticated]);

  const renderSummaryReport = () => {
    if (!reportsData.summary) {
      return (
        <div className="report-content">
          <div className="no-data">No summary data available.</div>
        </div>
      );
    }

    const summary = reportsData.summary;
    const totalIncome = Number(summary.totalIncome) || 0;
    const totalExpenses = Number(summary.totalExpenses) || 0;
    const balance = Number(summary.balance) || 0;
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;
    
    // Get top expense category from categories data
    const topCategory = reportsData.categories && reportsData.categories.length > 0
      ? reportsData.categories[0].category
      : 'N/A';

    return (
      <div className="report-content">
        <div className="report-stats-grid">
          <div className="report-stat-card income">
            <div className="stat-icon">
              <span className="emoji-icon">💰</span>
            </div>
            <div className="stat-info">
              <h3>Total Income</h3>
              <span className="stat-value">{formatCurrency(totalIncome)}</span>
              <span className="stat-period">All time</span>
            </div>
          </div>

          <div className="report-stat-card expense">
            <div className="stat-icon">
              <span className="emoji-icon">💸</span>
            </div>
            <div className="stat-info">
              <h3>Total Expenses</h3>
              <span className="stat-value">{formatCurrency(totalExpenses)}</span>
              <span className="stat-period">All time</span>
            </div>
          </div>

          <div className="report-stat-card savings">
            <div className="stat-icon">
              <span className="emoji-icon">🏦</span>
            </div>
            <div className="stat-info">
              <h3>Current Balance</h3>
              <span className="stat-value">{formatCurrency(balance)}</span>
              <span className="stat-period">{savingsRate}% savings rate</span>
            </div>
          </div>

          <div className="report-stat-card rate">
            <div className="stat-icon">
              <span className="emoji-icon">�</span>
            </div>
            <div className="stat-info">
              <h3>Transactions</h3>
              <span className="stat-value">{summary.transactionCount || 0}</span>
              <span className="stat-period">Total recorded</span>
            </div>
          </div>
        </div>

        <div className="report-insights">
          <div className="insight-card">
            <h3>💡 Key Insights</h3>
            <ul className="insights-list">
              <li>Your savings rate of {savingsRate}% {savingsRate >= 15 ? 'is above' : 'is below'} the recommended 15%</li>
              <li>Highest spending category: {topCategory}</li>
              <li>Total balance: {formatCurrency(balance)}</li>
              <li>Track your spending regularly to maintain financial health</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderMonthlyReport = () => {
    // For now, show a summary since we don't have monthly breakdown data yet
    if (!reportsData.summary) {
      return (
        <div className="report-content">
          <div className="no-data">No monthly data available.</div>
        </div>
      );
    }

    const summary = reportsData.summary;
    const totalIncome = Number(summary.totalIncome) || 0;
    const totalExpenses = Number(summary.totalExpenses) || 0;

    return (
      <div className="report-content">
        <div className="monthly-chart">
          <h3>📊 Overall Financial Overview</h3>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Monthly breakdown feature coming soon. Here's your overall financial summary:
          </p>
          <div className="report-stats-grid" style={{ marginTop: '2rem' }}>
            <div className="report-stat-card income">
              <div className="stat-icon">
                <span className="emoji-icon">💰</span>
              </div>
              <div className="stat-info">
                <h3>Total Income</h3>
                <span className="stat-value">{formatCurrency(totalIncome)}</span>
              </div>
            </div>
            <div className="report-stat-card expense">
              <div className="stat-icon">
                <span className="emoji-icon">💸</span>
              </div>
              <div className="stat-info">
                <h3>Total Expenses</h3>
                <span className="stat-value">{formatCurrency(totalExpenses)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCategoryReport = () => {
    if (!reportsData.categories || reportsData.categories.length === 0) {
      return (
        <div className="report-content">
          <div className="no-data">No category data available.</div>
        </div>
      );
    }

    // Calculate total and percentages
    const total = reportsData.categories.reduce((sum, cat) => sum + Number(cat.amount || 0), 0);
    const categoriesWithPercentage = reportsData.categories.map(cat => ({
      ...cat,
      percentage: total > 0 ? ((Number(cat.amount) / total) * 100).toFixed(1) : 0
    }));

    return (
      <div className="report-content">
        <div className="category-report">
          <h3>🥧 Expense Categories Breakdown</h3>
          <div className="category-bars">
            {categoriesWithPercentage.map((category, index) => (
              <div key={index} className="category-bar-item">
                <div className="category-info">
                  <span className="category-name">{category.category || 'Uncategorized'}</span>
                  <span className="category-amount">{formatCurrency(category.amount)}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${category.percentage}%`,
                      backgroundColor: `hsl(${index * 60}, 70%, 60%)`
                    }}
                  ></div>
                </div>
                <span className="category-percentage">{category.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

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

        {loadingData && <div className="reports-loading">Loading reports...</div>}
        {error && <div className="reports-error">Error: {error}</div>}
        {!loadingData && !error && (
          <>
            {selectedReportType === 'summary' && renderSummaryReport()}
            {selectedReportType === 'monthly' && renderMonthlyReport()}
            {selectedReportType === 'category' && renderCategoryReport()}
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;
