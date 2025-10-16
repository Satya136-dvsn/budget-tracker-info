import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

const SavingsGrowth = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState([]);
  const [savingsData, setSavingsData] = useState([]);
  const [goalData, setGoalData] = useState([]);
  const [monthlyContributions, setMonthlyContributions] = useState([]);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [savingsGoal, setSavingsGoal] = useState(0);
  const [progressToGoal, setProgressToGoal] = useState(0);
  const [averageMonthlyContribution, setAverageMonthlyContribution] = useState(0);

  // Fetch savings data
  useEffect(() => {
    const fetchSavingsData = async () => {
      try {
        setLoading(true);
        
        // Get number of months based on selected period
        const periodMonths = selectedPeriod === '3months' ? 3 : 
                            selectedPeriod === '6months' ? 6 : 12;
        
        // Fetch savings goals and transactions
        const [savingsGoals, transactions, userProfile] = await Promise.all([
          apiService.getAllSavingsGoals(),
          apiService.getUserTransactions(),
          apiService.getUserProfile()
        ]);
        
        // Calculate active savings goal (use the first active goal or create a default)
        const activeGoal = savingsGoals.find(g => g.status === 'ACTIVE') || 
                          savingsGoals.find(g => g.status === 'IN_PROGRESS') ||
                          savingsGoals[0];
        
        const targetAmount = activeGoal?.targetAmount || userProfile?.savingsGoal || 10000;
        
        // Create array of last N months
        const monthsArray = [];
        const savingsArray = [];
        const goalArray = [];
        const contributionsArray = [];
        const now = new Date();
        
        // Get user's current savings from profile
        let runningBalance = userProfile?.currentSavings || 0;
        
        for (let i = periodMonths - 1; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthName = date.toLocaleDateString('en-US', { month: 'short' });
          monthsArray.push(monthName);
          
          // Calculate month boundaries
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
          
          // Calculate net income for this month (income - expenses)
          const monthTransactions = transactions.filter(t => {
            const transactionDate = new Date(t.date || t.transactionDate);
            return transactionDate >= monthStart && transactionDate <= monthEnd;
          });
          
          const monthIncome = monthTransactions
            .filter(t => t.type === 'INCOME' || t.amount > 0)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
          
          const monthExpenses = monthTransactions
            .filter(t => t.type === 'EXPENSE' || t.amount < 0)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
          
          const monthlyContribution = monthIncome - monthExpenses;
          contributionsArray.push(Math.max(0, Math.round(monthlyContribution)));
          
          // Calculate savings progression (starting from current and working backwards)
          if (i === 0) {
            // Most recent month - use current savings
            savingsArray.push(Math.round(runningBalance));
          } else {
            // Earlier months - subtract contributions to estimate previous balance
            const futureSavings = savingsArray[0] || runningBalance;
            const estimatedPastSavings = futureSavings - (contributionsArray.slice(0, periodMonths - i).reduce((sum, val) => sum + val, 0));
            savingsArray.unshift(Math.max(0, Math.round(estimatedPastSavings)));
          }
          
          // Goal progression (linear towards target)
          const goalProgress = targetAmount * ((periodMonths - i) / periodMonths);
          goalArray.push(Math.round(goalProgress));
        }
        
        setMonths(monthsArray);
        setSavingsData(savingsArray);
        setGoalData(goalArray);
        setMonthlyContributions(contributionsArray);
        
        const current = savingsArray[savingsArray.length - 1] || 0;
        const goal = targetAmount;
        const progress = goal > 0 ? ((current / goal) * 100).toFixed(1) : 0;
        const avgContribution = contributionsArray.reduce((sum, val) => sum + val, 0) / contributionsArray.length;
        
        setCurrentSavings(current);
        setSavingsGoal(goal);
        setProgressToGoal(progress);
        setAverageMonthlyContribution(Math.round(avgContribution));
        
      } catch (error) {
        console.error('Error fetching savings data:', error);
        // Set default empty data on error
        const defaultMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        setMonths(defaultMonths);
        setSavingsData(Array(6).fill(0));
        setGoalData(Array(6).fill(0));
        setMonthlyContributions(Array(6).fill(0));
        setCurrentSavings(0);
        setSavingsGoal(0);
        setProgressToGoal(0);
        setAverageMonthlyContribution(0);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavingsData();
  }, [selectedPeriod]);

  if (loading) {
    return (
      <div className="trends-page">
        <div className="trends-header">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div className="header-title">
              <h1>Savings Growth</h1>
              <p>Loading your savings data...</p>
            </div>
          </div>
        </div>
        <div className="trends-content">
          <div className="trend-card full-width" style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="shimmer" style={{ height: '400px', borderRadius: '12px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="trends-page">
      {/* Header */}
      <div className="trends-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="header-title">
            <h1>Savings Growth</h1>
            <p>Monitor your savings progress and goal achievement</p>
          </div>
        </div>
        <div className="header-actions">
          <select 
            className="period-selector-custom"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button className="action-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export
          </button>
        </div>
      </div>

      <div className="trends-content">
        {/* Main Savings Chart */}
        <div className="trend-card full-width">
          <div className="chart-header">
            <div>
              <h3>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
                Savings Growth Trend
              </h3>
              <p className="chart-subtitle">
                Current: ₹{currentSavings.toLocaleString()} • Goal: ₹{savingsGoal.toLocaleString()} • 
                Progress: {progressToGoal}%
              </p>
            </div>
            <div className="chart-summary">
              <span className="current-value">₹{currentSavings.toLocaleString()}</span>
              <span className="trend-indicator-custom" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#000000 !important',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                border: '2px solid #22c55e'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
                <span style={{ color: '#000000' }}>+{(((currentSavings - savingsData[0]) / savingsData[0]) * 100).toFixed(1)}% growth</span>
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
                        ₹{(value / 1000).toFixed(1)}k
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
                  const x = 120 + (index * (750 / (months.length - 1)));
                  const y = 80 + (320 - ((savingsData[index] / Math.max(...goalData)) * 280));
                  return (
                    <g key={index} className="data-point-group">
                      {/* Large hover area */}
                      <circle
                        cx={x}
                        cy={y}
                        r="30"
                        fill="transparent"
                        className="hover-area"
                        style={{ cursor: 'pointer' }}
                      />
                      {/* Outer ring - animated on hover */}
                      <circle
                        cx={x}
                        cy={y}
                        r="15"
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="2"
                        className="data-point-ring"
                        style={{ opacity: 0, transition: 'all 0.3s ease' }}
                      />
                      {/* Inner glow */}
                      <circle
                        cx={x}
                        cy={y}
                        r="11"
                        fill="#8b5cf6"
                        className="data-point-glow"
                        style={{ opacity: 0, transition: 'all 0.3s ease' }}
                      />
                      {/* Main data point */}
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        fill="#8b5cf6"
                        stroke="#ffffff"
                        strokeWidth="4"
                        className="data-point"
                        style={{ 
                          filter: 'drop-shadow(0 4px 12px rgba(139, 92, 246, 0.5))',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      />
                      {/* Value label background */}
                      <rect
                        x={x - 40}
                        y={y - 50}
                        width="80"
                        height="28"
                        fill="#8b5cf6"
                        rx="6"
                        className="value-label-bg"
                        style={{ opacity: 0, transition: 'all 0.3s ease' }}
                      />
                      {/* Value label */}
                      <text
                        x={x}
                        y={y - 28}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="15"
                        fontWeight="700"
                        className="value-label"
                        style={{ 
                          opacity: 0,
                          transition: 'all 0.3s ease',
                          pointerEvents: 'none'
                        }}
                      >
                        ₹{(savingsData[index] / 1000).toFixed(1)}k
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
              <span className="stat-value">₹{currentSavings.toLocaleString()}</span>
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
              <span className="stat-label">Of ₹{savingsGoal.toLocaleString()} goal</span>
            </div>
          </div>

          <div className="stat-card-trend">
            <div className="stat-icon-trend" style={{ backgroundColor: '#3b82f6' }}>
              <span style={{ fontSize: '1.2rem' }}>📅</span>
            </div>
            <div className="stat-content-trend">
              <h4>Monthly Average</h4>
              <span className="stat-value">₹{Math.round(averageMonthlyContribution).toLocaleString()}</span>
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
                  <div key={index} className="bar-item" style={{ position: 'relative' }}>
                    <div className="bar-value" style={{ fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
                      ₹{contribution}
                    </div>
                    <div 
                      className="bar" 
                      style={{ 
                        height: `${height}px`,
                        background: barColor,
                        boxShadow: isHighest 
                          ? '0 8px 16px rgba(34, 197, 94, 0.4), 0 4px 8px rgba(0, 0, 0, 0.1)' 
                          : '0 6px 12px rgba(102, 126, 234, 0.3), 0 4px 8px rgba(0, 0, 0, 0.1)',
                        borderRadius: '8px 8px 0 0',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                        e.currentTarget.style.boxShadow = isHighest 
                          ? '0 12px 24px rgba(34, 197, 94, 0.5), 0 6px 12px rgba(0, 0, 0, 0.15)' 
                          : '0 10px 20px rgba(102, 126, 234, 0.4), 0 6px 12px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = isHighest 
                          ? '0 8px 16px rgba(34, 197, 94, 0.4), 0 4px 8px rgba(0, 0, 0, 0.1)' 
                          : '0 6px 12px rgba(102, 126, 234, 0.3), 0 4px 8px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      {/* Shine effect */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        animation: 'shine 3s infinite',
                      }}></div>
                    </div>
                    <div className="bar-label" style={{ fontWeight: '600', color: '#64748b', marginTop: '0.5rem' }}>
                      {months[index]}
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
                <p>At your current pace, you'll reach your ₹{savingsGoal.toLocaleString()} goal in approximately {Math.ceil((savingsGoal - currentSavings) / averageMonthlyContribution)} months.</p>
              </div>
            </div>

            <div className="insight-item">
              <div className="insight-icon warning">
                <span style={{ fontSize: '1.2rem' }}>🚀</span>
              </div>
              <div className="insight-text">
                <h4>Boost Your Savings</h4>
                <p>Increasing your monthly contribution by ₹1000 could help you reach your goal ₹{Math.floor((savingsGoal - currentSavings) / averageMonthlyContribution - (savingsGoal - currentSavings) / (averageMonthlyContribution + 100))} months earlier.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsGrowth;