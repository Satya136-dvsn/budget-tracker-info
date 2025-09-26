import React from 'react';
import { useNavigate } from 'react-router-dom';

const Trends = () => {
  const navigate = useNavigate();

  // Mock data matching the design
  const monthlySpendingData = [2100, 2300, 1950, 2200, 2800, 2450];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  const spendingBreakdown = [
    { category: 'Food', amount: 450, color: '#8B4513' },
    { category: 'Transport', amount: 320, color: '#4169E1' },
    { category: 'Entertainment', amount: 280, color: '#32CD32' },
    { category: 'Utilities', amount: 150, color: '#FFD700' }
  ];

  const maxSpending = Math.max(...monthlySpendingData);
  const maxCategory = Math.max(...spendingBreakdown.map(item => item.amount));

  return (
    <div className="trends-page">
      <div className="trends-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1>Trends</h1>
        <div className="header-spacer"></div>
      </div>

      <div className="trends-content">
        {/* Section Header */}
        <div className="section-header">
          <h2>Spending</h2>
        </div>

        {/* Monthly Spending Chart */}
        <div className="trend-card">
          <div className="card-header">
            <h3>Monthly Spending</h3>
          </div>
          <div className="trend-main-value">
            <span className="main-amount">$2,450</span>
          </div>
          <div className="trend-subtitle">
            <span className="period-text">Last 6 Months</span>
            <span className="trend-percentage positive">+12%</span>
          </div>
          <div className="chart-container">
            <div className="line-chart-smooth">
              <svg viewBox="0 0 300 120" className="trend-svg">
                {/* Smooth line path */}
                <path
                  d="M 30,80 Q 60,70 90,75 Q 120,60 150,65 Q 180,50 210,45 Q 240,60 270,55"
                  fill="none"
                  stroke="#D4A574"
                  strokeWidth="2"
                  className="trend-line"
                />
                {/* Data points */}
                {months.map((month, index) => (
                  <circle
                    key={index}
                    cx={30 + (index * 48)}
                    cy={80 - ((monthlySpendingData[index] / maxSpending) * 40)}
                    r="3"
                    fill="#D4A574"
                    className="trend-point"
                  />
                ))}
              </svg>
              {/* Month labels */}
              <div className="month-labels">
                {months.map((month, index) => (
                  <span key={index} className="month-label">{month}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="section-header">
          <h2>Spending Breakdown</h2>
        </div>

        {/* Category Spending Chart */}
        <div className="trend-card">
          <div className="card-header">
            <h3>Category Spending</h3>
          </div>
          <div className="trend-main-value">
            <span className="main-amount">$1,200</span>
          </div>
          <div className="trend-subtitle">
            <span className="period-text">This Month</span>
            <span className="trend-percentage positive">+5%</span>
          </div>
          <div className="chart-container">
            <div className="bar-chart-categories">
              {spendingBreakdown.map((item, index) => (
                <div key={index} className="category-bar">
                  <div 
                    className="bar-column" 
                    style={{
                      height: `${(item.amount / maxCategory) * 100}px`,
                      backgroundColor: item.color
                    }}
                  ></div>
                  <span className="category-label">{item.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="section-header">
          <h2>Income vs. Expenses</h2>
        </div>

        {/* Income vs Expenses Chart */}
        <div className="trend-card">
          <div className="card-header">
            <h3>Income vs. Expenses</h3>
          </div>
          <div className="trend-main-value">
            <span className="main-amount">$3,500</span>
          </div>
          <div className="trend-subtitle">
            <span className="period-text">This Month</span>
            <span className="trend-percentage negative">-3%</span>
          </div>
          <div className="chart-container">
            <div className="comparison-bars">
              <div className="comparison-row">
                <span className="comparison-label">Income</span>
                <div className="comparison-bar-container">
                  <div className="comparison-bar income-bar" style={{width: '85%'}}></div>
                </div>
              </div>
              <div className="comparison-row">
                <span className="comparison-label">Expenses</span>
                <div className="comparison-bar-container">
                  <div className="comparison-bar expense-bar" style={{width: '65%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div className="nav-item active" onClick={() => navigate('/dashboard')}>
          <i className="fas fa-home"></i>
          <span>Dashboard</span>
        </div>
        <div className="nav-item" onClick={() => navigate('/transactions')}>
          <i className="fas fa-list"></i>
          <span>Transactions</span>
        </div>
        <div className="nav-item" onClick={() => navigate('/budget')}>
          <i className="fas fa-chart-pie"></i>
          <span>Budget</span>
        </div>
        <div className="nav-item" onClick={() => navigate('/profile')}>
          <i className="fas fa-user"></i>
          <span>Profile</span>
        </div>
      </div>
    </div>
  );
};

export default Trends;