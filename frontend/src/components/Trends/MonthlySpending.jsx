import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MonthlySpending = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  // Sample data - replace with actual API data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const monthlySpendingData = [2400, 1398, 3200, 2800, 1890, 2390];
  const maxSpending = Math.max(...monthlySpendingData);
  const averageSpending = monthlySpendingData.reduce((sum, val) => sum + val, 0) / months.length;

  return (
    <div className="trends-page">
      {/* Header */}
      <div className="trends-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <span style={{ fontSize: '1rem' }}>&#8592;</span>
          </button>
          <div className="header-title">
            <h1>Monthly Spending Analysis</h1>
            <p>Track your spending patterns and trends over time</p>
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
        {/* Main Spending Chart */}
        <div className="trend-card full-width">
          <div className="chart-header">
            <div>
              <h3>Monthly Spending Trends</h3>
              <p className="chart-subtitle">
                Showing {months.length} months • Total: ${(monthlySpendingData.reduce((sum, val) => sum + val, 0)).toLocaleString()} • 
                Average: ${Math.round(averageSpending).toLocaleString()}
              </p>
            </div>
            <div className="chart-summary">
              <span className="current-value">${Math.round(averageSpending).toLocaleString()}</span>
              <span className="trend-indicator positive">
                <i className="fas fa-arrow-trend-up"></i>
                +12% from previous period
              </span>
            </div>
          </div>
          
          <div className="chart-container large">
            <div className="line-chart">
              <svg viewBox="0 0 900 500" className="trend-svg">
                <defs>
                  <pattern id="grid" width="90" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 90 0 L 0 0 0 50" fill="none" stroke="rgba(102, 126, 234, 0.1)" strokeWidth="1"/>
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
                  const y = 80 + (340 - (ratio * 280));
                  const value = Math.round(maxSpending * ratio);
                  return (
                    <g key={index}>
                      <line 
                        x1="80" 
                        y1={y} 
                        x2="90" 
                        y2={y} 
                        stroke="rgba(102, 126, 234, 0.6)" 
                        strokeWidth="2"
                      />
                      <text
                        x="75"
                        y={y + 5}
                        textAnchor="end"
                        fill="rgba(45, 55, 72, 0.9)"
                        fontSize="14"
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
                    const x = 100 + (index * (700 / (months.length - 1)));
                    const y = 80 + (340 - ((value / maxSpending) * 280));
                    return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                  }).join(' ')} L ${100 + ((months.length - 1) * (700 / (months.length - 1)))},360 L 100,360 Z`}
                  fill="url(#areaGradient)"
                />
                
                {/* Main trend line */}
                <path
                  d={monthlySpendingData.map((value, index) => {
                    const x = 100 + (index * (700 / (months.length - 1)));
                    const y = 80 + (340 - ((value / maxSpending) * 280));
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
                  const x = 100 + (index * (700 / (months.length - 1)));
                  const normalizedValue = (monthlySpendingData[index] / maxSpending);
                  const y = 80 + (340 - (normalizedValue * 280));
                  return (
                    <g key={index}>
                      <circle
                        cx={x}
                        cy={y}
                        r="10"
                        fill="#ffffff"
                        stroke="#667eea"
                        strokeWidth="4"
                        className="trend-point"
                        style={{ 
                          filter: 'drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3))',
                          cursor: 'pointer' 
                        }}
                      />
                      <text
                        x={x}
                        y={y - 20}
                        textAnchor="middle"
                        fill="#2d3748"
                        fontSize="14"
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
                padding: '0 3rem',
                marginTop: '1rem'
              }}>
                {months.map((month, index) => (
                  <span key={index} className="month-label" style={{textAlign: 'center', fontSize: '1rem', fontWeight: '600'}}>{month}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card-trend">
            <div className="stat-icon-trend">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="stat-content-trend">
              <h4>Highest Month</h4>
              <span className="stat-value">${Math.max(...monthlySpendingData).toLocaleString()}</span>
              <span className="stat-label">March 2025</span>
            </div>
          </div>

          <div className="stat-card-trend">
            <div className="stat-icon-trend">
              <i className="fas fa-chart-line-down"></i>
            </div>
            <div className="stat-content-trend">
              <h4>Lowest Month</h4>
              <span className="stat-value">${Math.min(...monthlySpendingData).toLocaleString()}</span>
              <span className="stat-label">February 2025</span>
            </div>
          </div>

          <div className="stat-card-trend">
            <div className="stat-icon-trend">
              <i className="fas fa-calculator"></i>
            </div>
            <div className="stat-content-trend">
              <h4>Average Spending</h4>
              <span className="stat-value">${Math.round(averageSpending).toLocaleString()}</span>
              <span className="stat-label">Per month</span>
            </div>
          </div>

          <div className="stat-card-trend">
            <div className="stat-icon-trend">
              <i className="fas fa-percentage"></i>
            </div>
            <div className="stat-content-trend">
              <h4>Variance</h4>
              <span className="stat-value">±{Math.round(((Math.max(...monthlySpendingData) - Math.min(...monthlySpendingData)) / averageSpending) * 100)}%</span>
              <span className="stat-label">From average</span>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="trend-card">
          <h3>💡 Spending Insights</h3>
          <div className="insights-grid">
            <div className="insight-item">
              <div className="insight-icon positive">
                <i className="fas fa-thumbs-up"></i>
              </div>
              <div className="insight-text">
                <h4>Consistent Spending</h4>
                <p>Your spending has remained relatively stable over the past {months.length} months, showing good budget control.</p>
              </div>
            </div>

            <div className="insight-item">
              <div className="insight-icon warning">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div className="insight-text">
                <h4>March Spike</h4>
                <p>March showed a significant increase in spending. Consider reviewing what caused this spike.</p>
              </div>
            </div>

            <div className="insight-item">
              <div className="insight-icon info">
                <i className="fas fa-lightbulb"></i>
              </div>
              <div className="insight-text">
                <h4>Optimization Opportunity</h4>
                <p>You could save approximately ${Math.round((averageSpending - Math.min(...monthlySpendingData)) * months.length).toLocaleString()} annually by maintaining your lowest spending level.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlySpending;