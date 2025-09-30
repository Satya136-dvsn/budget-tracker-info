import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../hooks/useAlert';

const Reports = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedReportType, setSelectedReportType] = useState('summary');

  // Sample data - replace with actual API data
  const reportsData = {
    summary: {
      totalIncome: 15000,
      totalExpenses: 12500,
      totalSavings: 2500,
      savingsRate: 16.7,
      topExpenseCategory: 'Food & Dining',
      budgetVariance: -8.5
    },
    monthly: [
      { month: 'Jan', income: 5000, expenses: 4200, savings: 800 },
      { month: 'Feb', income: 5000, expenses: 4100, savings: 900 },
      { month: 'Mar', income: 5000, expenses: 4200, savings: 800 },
      { month: 'Apr', income: 5000, expenses: 4000, savings: 1000 },
      { month: 'May', income: 5000, expenses: 4300, savings: 700 },
      { month: 'Jun', income: 5000, expenses: 4100, savings: 900 }
    ],
    categories: [
      { name: 'Food & Dining', amount: 3750, percentage: 30 },
      { name: 'Transportation', amount: 2675, percentage: 21.4 },
      { name: 'Bills & Utilities', amount: 2340, percentage: 18.7 },
      { name: 'Shopping', amount: 1950, percentage: 15.6 },
      { name: 'Entertainment', amount: 1260, percentage: 10.1 },
      { name: 'Other', amount: 525, percentage: 4.2 }
    ]
  };

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
            <span className="stat-period">{reportsData.summary.savingsRate}% savings rate</span>
          </div>
        </div>

        <div className="report-stat-card rate">
          <div className="stat-icon">
            <span className="emoji-icon">📈</span>
          </div>
          <div className="stat-info">
            <h3>Budget Performance</h3>
            <span className="stat-value">{reportsData.summary.budgetVariance > 0 ? '+' : ''}{reportsData.summary.budgetVariance}%</span>
            <span className="stat-period">vs planned budget</span>
          </div>
        </div>
      </div>

      <div className="report-insights">
        <div className="insight-card">
          <h3>💡 Key Insights</h3>
          <ul className="insights-list">
            <li>Your savings rate of {reportsData.summary.savingsRate}% is above the recommended 15%</li>
            <li>Highest spending category: {reportsData.summary.topExpenseCategory}</li>
            <li>You're {Math.abs(reportsData.summary.budgetVariance)}% {reportsData.summary.budgetVariance > 0 ? 'over' : 'under'} your planned budget</li>
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
                  style={{ height: `${(month.income / 5000) * 100}%` }}
                  title={`Income: ${formatCurrency(month.income)}`}
                ></div>
                <div 
                  className="expense-bar" 
                  style={{ height: `${(month.expenses / 5000) * 100}%` }}
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
                <span className="category-name">{category.name}</span>
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

  return (
    <div className="reports-page">
      {/* Header */}
      <div className="reports-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <span style={{ fontSize: '1rem' }}>&#8592;</span>
          </button>
          <div className="header-title">
            <h1>📊 Financial Reports</h1>
            <p>Comprehensive analysis of your financial data</p>
          </div>
        </div>
        <div className="header-actions">
          <select 
            className="period-selector"
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
