import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Trends = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  // Enhanced mock data matching the sample design
  const getDataForPeriod = (period) => {
    switch(period) {
      case '3months':
        return {
          data: [2200, 2100, 2450],
          months: ['Apr', 'May', 'Jun']
        };
      case '6months':
        return {
          data: [2100, 2300, 1950, 2200, 2800, 2450],
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        };
      case '1year':
        return {
          data: [1800, 2100, 2300, 1950, 2200, 2800, 2450, 2300, 2100, 2400, 2600, 2350],
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        };
      default:
        return {
          data: [2100, 2300, 1950, 2200, 2800, 2450],
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        };
    }
  };

  const { data: monthlySpendingData, months } = getDataForPeriod(selectedPeriod);
  
  // Calculate dynamic statistics
  const totalSpending = monthlySpendingData.reduce((sum, val) => sum + val, 0);
  const averageSpending = totalSpending / monthlySpendingData.length;
  const maxSpending = Math.max(...monthlySpendingData);
  const minSpending = Math.min(...monthlySpendingData);
  const trendPercentage = monthlySpendingData.length > 1 
    ? ((monthlySpendingData[monthlySpendingData.length - 1] - monthlySpendingData[0]) / monthlySpendingData[0] * 100).toFixed(1)
    : 0;

  const spendingBreakdown = [
    { category: 'Food', amount: 450, color: '#8B7355', percentage: 37.5 },
    { category: 'Transport', amount: 320, color: '#A0845C', percentage: 26.7 },
    { category: 'Entertainment', amount: 280, color: '#B8976A', percentage: 23.3 },
    { category: 'Utilities', amount: 150, color: '#D4B896', percentage: 12.5 }
  ];

  const incomeVsExpenses = {
    income: 4200,
    expenses: 2450,
    difference: 1750
  };

  return (
    <div className="trends-page">
      {/* Header */}
      <div className="trends-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="header-title">
            <h1>Financial Trends</h1>
            <p>Analyze your spending patterns and insights</p>
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
          </select>
          <button className="action-btn">
            <i className="fas fa-download"></i>
            Export
          </button>
        </div>
      </div>

      <div className="trends-content">
        {/* Monthly Spending Chart */}
        <div className="trend-card">
          <div className="chart-header">
            <div>
              <h3>Monthly Spending Analysis</h3>
              <p className="chart-subtitle">
                Showing {months.length} months • Total: ${(monthlySpendingData.reduce((sum, val) => sum + val, 0)).toLocaleString()} • 
                Range: ${Math.min(...monthlySpendingData).toLocaleString()} - ${Math.max(...monthlySpendingData).toLocaleString()}
              </p>
            </div>
            <div className="chart-summary">
              <span className="current-value">${Math.round(averageSpending).toLocaleString()}</span>
              <span className="trend-indicator positive">
                <i className="fas fa-arrow-trend-up"></i>
                +12% from start of period
              </span>
            </div>
          </div>
          
          <div className="chart-container">
            <div className="line-chart">
              <svg viewBox="0 0 800 400" className="trend-svg">
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="80" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 80 0 L 0 0 0 40" fill="none" stroke="rgba(102, 126, 234, 0.1)" strokeWidth="1"/>
                  </pattern>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#667eea" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#667eea" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#667eea" stopOpacity="0" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Y-axis labels */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                  const y = 60 + (280 - (ratio * 240));
                  const value = Math.round(maxSpending * ratio);
                  return (
                    <g key={index}>
                      <line 
                        x1="70" 
                        y1={y} 
                        x2="80" 
                        y2={y} 
                        stroke="rgba(102, 126, 234, 0.6)" 
                        strokeWidth="2"
                      />
                      <text
                        x="65"
                        y={y + 5}
                        textAnchor="end"
                        fill="rgba(45, 55, 72, 0.9)"
                        fontSize="12"
                        fontWeight="600"
                      >
                        ${(value / 1000).toFixed(1)}k
                      </text>
                    </g>
                  );
                })}
                
                {/* Area under curve */}
                <path
                  d={`M ${monthlySpendingData.map((value, index) => {
                    const x = 80 + (index * (640 / (months.length - 1)));
                    const y = 60 + (280 - ((value / maxSpending) * 240));
                    return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                  }).join(' ')} L ${80 + ((months.length - 1) * (640 / (months.length - 1)))},340 L 80,340 Z`}
                  fill="url(#areaGradient)"
                />
                
                {/* Main trend line */}
                <path
                  d={monthlySpendingData.map((value, index) => {
                    const x = 80 + (index * (640 / (months.length - 1)));
                    const y = 60 + (280 - ((value / maxSpending) * 240));
                    return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow)"
                  className="trend-line"
                />
                
                {/* Data points */}
                {months.map((month, index) => {
                  const x = 80 + (index * (640 / (months.length - 1)));
                  const normalizedValue = (monthlySpendingData[index] / maxSpending);
                  const y = 60 + (280 - (normalizedValue * 240));
                  return (
                    <g key={index}>
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        fill="#ffffff"
                        stroke="#667eea"
                        strokeWidth="3"
                        className="trend-point"
                        style={{ 
                          filter: 'drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3))',
                          cursor: 'pointer' 
                        }}
                      />
                      <text
                        x={x}
                        y={y - 15}
                        textAnchor="middle"
                        fill="#2d3748"
                        fontSize="12"
                        fontWeight="700"
                      >
                        ${(monthlySpendingData[index] / 1000).toFixed(1)}k
                      </text>
                    </g>
                  );
                })}
              </svg>
              
              {/* Month labels */}
              <div className="chart-labels" style={{ 
                display: 'grid', 
                gridTemplateColumns: `repeat(${months.length}, 1fr)`,
                gap: '0.5rem',
                padding: '0 2rem',
                marginTop: '1rem'
              }}>
                {months.map((month, index) => (
                  <span key={index} className="month-label" style={{textAlign: 'center'}}>{month}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Spending Breakdown Section */}
        <div className="trend-card">
          <div className="chart-header">
            <div>
              <h3>Category Spending</h3>
              <div className="chart-value">$1,200</div>
              <div className="chart-period">This Month <span className="trend-positive">+5%</span></div>
            </div>
          </div>
          
          <div className="bar-chart">
            {spendingBreakdown.map((item, index) => (
              <div key={index} className="bar-item">
                <div className="bar-container">
                  <div 
                    className="bar" 
                    style={{ 
                      height: `${(item.percentage / 37.5) * 100}%`,
                      background: `linear-gradient(135deg, #667eea, #764ba2)`,
                      animationDelay: `${index * 0.2}s`
                    }}
                  >
                    <div className="bar-value">${item.amount}</div>
                  </div>
                </div>
                <div className="bar-label">{item.category}</div>
                <div className="bar-percentage">{item.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Income vs Expenses Section */}
        <div className="trend-card">
          <div className="chart-header">
            <div>
              <h3>Income vs. Expenses</h3>
              <div className="chart-value">$3,500</div>
              <div className="chart-period">This Month <span className="trend-negative">-3%</span></div>
            </div>
          </div>
          
          <div className="comparison-chart">
            <div className="comparison-item">
              <div className="comparison-header">
                <div className="comparison-label">
                  <i className="fas fa-arrow-up income-icon"></i>
                  Income
                </div>
                <div className="comparison-value">${incomeVsExpenses.income.toLocaleString()}</div>
              </div>
              <div className="comparison-bar">
                <div 
                  className="comparison-bar-fill income-bar" 
                  style={{ 
                    width: '100%',
                    animationDelay: '0.3s'
                  }}
                >
                  <div className="bar-shine"></div>
                </div>
              </div>
            </div>
            
            <div className="comparison-item">
              <div className="comparison-header">
                <div className="comparison-label">
                  <i className="fas fa-arrow-down expenses-icon"></i>
                  Expenses
                </div>
                <div className="comparison-value">${incomeVsExpenses.expenses.toLocaleString()}</div>
              </div>
              <div className="comparison-bar">
                <div 
                  className="comparison-bar-fill expenses-bar" 
                  style={{ 
                    width: `${(incomeVsExpenses.expenses / incomeVsExpenses.income) * 100}%`,
                    animationDelay: '0.5s'
                  }}
                >
                  <div className="bar-shine"></div>
                </div>
              </div>
            </div>
            
            <div className="savings-summary">
              <div className="savings-card">
                <div className="savings-icon">
                  <i className="fas fa-piggy-bank"></i>
                </div>
                <div className="savings-info">
                  <div className="savings-label">Net Savings</div>
                  <div className="savings-amount">${incomeVsExpenses.difference.toLocaleString()}</div>
                  <div className="savings-percentage">
                    {Math.round((incomeVsExpenses.difference / incomeVsExpenses.income) * 100)}% of income
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trends;