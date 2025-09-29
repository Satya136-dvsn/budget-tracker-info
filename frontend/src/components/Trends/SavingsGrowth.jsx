import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SavingsGrowth = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  // Sample data - replace with actual API data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const savingsData = [5000, 5420, 5890, 6320, 6750, 7200];
  const goalData = [5000, 5500, 6000, 6500, 7000, 7500]; // Savings goal line
  const monthlyContributions = [420, 470, 430, 430, 450];
  
  const currentSavings = savingsData[savingsData.length - 1];
  const savingsGoal = goalData[goalData.length - 1];
  const progressToGoal = ((currentSavings / savingsGoal) * 100).toFixed(1);
  const averageMonthlyContribution = monthlyContributions.reduce((sum, val) => sum + val, 0) / monthlyContributions.length;

  return (
    <div className="trends-page">
      {/* Header */}
      <div className="trends-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <span style={{ fontSize: '1rem' }}>←</span>
          </button>
          <div className="header-title">
            <h1>Savings Growth</h1>
            <p>Monitor your savings progress and goal achievement</p>
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
            <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>📥</span>
            Export
          </button>
        </div>
      </div>

      <div className="trends-content">
        {/* Main Savings Chart */}
        <div className="trend-card full-width">
          <div className="chart-header">
            <div>
              <h3 style={{ color: '#1f2937', fontWeight: '700', marginBottom: '0.5rem' }}>💹 Savings Growth Trend</h3>
              <p className="chart-subtitle">
                Current: ${currentSavings.toLocaleString()} • Goal: ${savingsGoal.toLocaleString()} • 
                Progress: {progressToGoal}%
              </p>
            </div>
            <div className="chart-summary">
              <span className="current-value">${currentSavings.toLocaleString()}</span>
              <span className="trend-indicator positive">
                <span style={{ fontSize: '0.9rem', marginRight: '0.25rem' }}>📈</span>
                +{(((currentSavings - savingsData[0]) / savingsData[0]) * 100).toFixed(1)}% growth
              </span>
            </div>
          </div>
          
          <div className="chart-container large">
            <div className="line-chart">
              <svg viewBox="0 0 1000 500" className="trend-svg"
                   style={{ width: '100%', height: '100%', minHeight: '500px' }}>
                <defs>
                  <pattern id="grid" width="100" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 100 0 L 0 0 0 50" fill="none" stroke="rgba(102, 126, 234, 0.1)" strokeWidth="1"/>
                  </pattern>
                  <linearGradient id="savingsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#16a34a" />
                  </linearGradient>
                  <linearGradient id="goalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                  <linearGradient id="savingsAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Y-axis labels */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                  const y = 80 + (320 - (ratio * 280)); // Updated for 500px height
                  const value = Math.round((Math.max(...goalData) * ratio));
                  return (
                    <g key={index}>
                      <line 
                        x1="90" 
                        y1={y} 
                        x2="110" 
                        y2={y} 
                        stroke="rgba(102, 126, 234, 0.6)" 
                        strokeWidth="2"
                      />
                      <text
                        x="85"
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
                
                {/* Savings area under curve */}
                <path
                  d={`M ${savingsData.map((value, index) => {
                    const x = 120 + (index * (750 / (months.length - 1))); // Updated for 1000px width
                    const y = 80 + (320 - ((value / Math.max(...goalData)) * 280)); // Updated for 500px height
                    return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                  }).join(' ')} L ${120 + ((months.length - 1) * (750 / (months.length - 1)))},400 L 120,400 Z`}
                  fill="url(#savingsAreaGradient)"
                />
                
                {/* Goal line (dashed) */}
                <path
                  d={goalData.map((value, index) => {
                    const x = 120 + (index * (750 / (months.length - 1))); // Updated for 1000px width
                    const y = 80 + (320 - ((value / Math.max(...goalData)) * 280)); // Updated for 500px height
                    return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeDasharray="8,5"
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))' }}
                />
                
                {/* Actual savings line */}
                <path
                  d={savingsData.map((value, index) => {
                    const x = 120 + (index * (750 / (months.length - 1))); // Updated for 1000px width
                    const y = 80 + (320 - ((value / Math.max(...goalData)) * 280)); // Updated for 500px height
                    return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="trend-line"
                  style={{ 
                    filter: 'drop-shadow(0 3px 6px rgba(139, 92, 246, 0.4))',
                    opacity: 1
                  }}
                />
                
                {/* Data points for savings */}
                {months.map((month, index) => {
                  const x = 120 + (index * (750 / (months.length - 1))); // Updated for 1000px width
                  const y = 80 + (320 - ((savingsData[index] / Math.max(...goalData)) * 280)); // Updated for 500px height
                  return (
                    <g key={index}>
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        fill="#ffffff"
                        stroke="#8b5cf6"
                        strokeWidth="4"
                        className="trend-point"
                        style={{ 
                          filter: 'drop-shadow(0 2px 4px rgba(139, 92, 246, 0.4))',
                          cursor: 'pointer' 
                        }}
                      />
                      <text
                        x={x}
                        y={y - 15}
                        textAnchor="middle"
                        fill="#2d3748"
                        fontSize="14"
                        fontWeight="700"
                      >
                        ${(savingsData[index] / 1000).toFixed(1)}k
                      </text>
                    </g>
                  );
                })}

                {/* Legend */}
                <g>
                  <line x1="750" y1="60" x2="780" y2="60" stroke="#8b5cf6" strokeWidth="4" />
                  <text x="790" y="65" fill="#2d3748" fontSize="14" fontWeight="600">Actual Savings</text>
                  
                  <line x1="750" y1="80" x2="780" y2="80" stroke="#f59e0b" strokeWidth="3" strokeDasharray="8,5" />
                  <text x="790" y="85" fill="#2d3748" fontSize="14" fontWeight="600">Savings Goal</text>
                </g>
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

        {/* Savings Statistics */}
        <div className="stats-grid">
          <div className="stat-card-trend">
            <div className="stat-icon-trend" style={{ backgroundColor: '#22c55e' }}>
              <span style={{ fontSize: '1.2rem' }}>🐷</span>
            </div>
            <div className="stat-content-trend">
              <h4>Current Savings</h4>
              <span className="stat-value">${currentSavings.toLocaleString()}</span>
              <span className="stat-label">Total accumulated</span>
            </div>
          </div>

          <div className="stat-card-trend">
            <div className="stat-icon-trend" style={{ backgroundColor: '#f59e0b' }}>
              <span style={{ fontSize: '1.2rem' }}>🎯</span>
            </div>
            <div className="stat-content-trend">
              <h4>Goal Progress</h4>
              <span className="stat-value">{progressToGoal}%</span>
              <span className="stat-label">Of ${savingsGoal.toLocaleString()} goal</span>
            </div>
          </div>

          <div className="stat-card-trend">
            <div className="stat-icon-trend" style={{ backgroundColor: '#3b82f6' }}>
              <span style={{ fontSize: '1.2rem' }}>📅</span>
            </div>
            <div className="stat-content-trend">
              <h4>Monthly Average</h4>
              <span className="stat-value">${Math.round(averageMonthlyContribution).toLocaleString()}</span>
              <span className="stat-label">Per month</span>
            </div>
          </div>

          <div className="stat-card-trend">
            <div className="stat-icon-trend" style={{ backgroundColor: '#8b5cf6' }}>
              <span style={{ fontSize: '1.2rem' }}>📈</span>
            </div>
            <div className="stat-content-trend">
              <h4>Growth Rate</h4>
              <span className="stat-value">+{(((currentSavings - savingsData[0]) / savingsData[0]) * 100).toFixed(1)}%</span>
              <span className="stat-label">Over {months.length} months</span>
            </div>
          </div>
        </div>

        {/* Monthly Contributions Bar Chart */}
        <div className="trend-card">
          <h3 style={{ color: '#1f2937', fontWeight: '700', marginBottom: '1.5rem' }}>💰 Monthly Contributions</h3>
          <div className="bar-chart-container">
            <div className="bar-chart">
              {monthlyContributions.map((contribution, index) => {
                const height = (contribution / Math.max(...monthlyContributions)) * 250; // Increased height
                const isHighest = contribution === Math.max(...monthlyContributions);
                const barColor = isHighest ? 
                  'linear-gradient(135deg, #22c55e, #16a34a)' : 
                  'linear-gradient(135deg, #667eea, #764ba2)';
                
                return (
                  <div key={index} className="bar-item">
                    <div className="bar-value" style={{ fontWeight: '700', color: '#1f2937' }}>
                      ${contribution}
                    </div>
                    <div 
                      className="bar" 
                      style={{ 
                        height: `${height}px`,
                        background: barColor,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        borderRadius: '4px 4px 0 0'
                      }}
                    ></div>
                    <div className="bar-label" style={{ fontWeight: '600', color: '#64748b' }}>
                      {months[index + 1]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Savings Insights */}
        <div className="trend-card">
          <h3 style={{ color: '#1f2937', fontWeight: '700', marginBottom: '1.5rem' }}>💡 Savings Insights & Recommendations</h3>
          <div className="insights-grid">
            <div className="insight-item">
              <div className="insight-icon positive">
                <span style={{ fontSize: '1.2rem' }}>🏆</span>
              </div>
              <div className="insight-text">
                <h4>Great Progress!</h4>
                <p>You're {progressToGoal}% of the way to your savings goal. Keep up the excellent work!</p>
              </div>
            </div>

            <div className="insight-item">
              <div className="insight-icon info">
                <span style={{ fontSize: '1.2rem' }}>⏰</span>
              </div>
              <div className="insight-text">
                <h4>Goal Timeline</h4>
                <p>At your current pace, you'll reach your ${savingsGoal.toLocaleString()} goal in approximately {Math.ceil((savingsGoal - currentSavings) / averageMonthlyContribution)} months.</p>
              </div>
            </div>

            <div className="insight-item">
              <div className="insight-icon warning">
                <span style={{ fontSize: '1.2rem' }}>🚀</span>
              </div>
              <div className="insight-text">
                <h4>Boost Your Savings</h4>
                <p>Increasing your monthly contribution by $100 could help you reach your goal ${Math.floor((savingsGoal - currentSavings) / averageMonthlyContribution - (savingsGoal - currentSavings) / (averageMonthlyContribution + 100))} months earlier.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsGrowth;