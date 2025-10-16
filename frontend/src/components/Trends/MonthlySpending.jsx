import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import './Trends.css';

const MonthlySpending = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState([]);
  const [monthlySpendingData, setMonthlySpendingData] = useState([]);
  const [maxSpending, setMaxSpending] = useState(0);
  const [averageSpending, setAverageSpending] = useState(0);

  // Fetch and aggregate transaction data using new analytics endpoints
  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        setLoading(true);
        
        // Get number of months based on selected period
        const periodMonths = selectedPeriod === '3months' ? 3 : 
                            selectedPeriod === '6months' ? 6 : 12;
        
        // Use new analytics endpoint for monthly trends
        const monthlyTrends = await apiService.getMonthlyTrends(periodMonths);
        console.log('Monthly trends data:', monthlyTrends);
        
        if (monthlyTrends && monthlyTrends.length > 0) {
          // Process the analytics data
          const monthsArray = [];
          const dataArray = [];
          
          // Sort by year and month
          monthlyTrends.sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            return a.month - b.month;
          });
          
          monthlyTrends.forEach(trend => {
            const monthName = new Date(trend.year, trend.month - 1).toLocaleDateString('en-US', { month: 'short' });
            monthsArray.push(monthName);
            dataArray.push(Math.round(parseFloat(trend.totalExpenses) || 0));
          });
          
          setMonths(monthsArray);
          setMonthlySpendingData(dataArray);
          
          const max = Math.max(...dataArray, 100); // Minimum 100 for better visualization
          const avg = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
          
          setMaxSpending(max);
          setAverageSpending(avg);
        } else {
          // Fallback to manual calculation if no analytics data
          const transactions = await apiService.getUserTransactions();
          
          // Filter only expense transactions
          const expenses = transactions.filter(t => t.type === 'EXPENSE');
          
          // Create array of last N months
          const monthsArray = [];
          const dataArray = [];
          const now = new Date();
          
          for (let i = periodMonths - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = date.toLocaleDateString('en-US', { month: 'short' });
            monthsArray.push(monthName);
            
            // Calculate total spending for this month
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
            
            const monthTotal = expenses
              .filter(t => {
                const transactionDate = new Date(t.date || t.transactionDate);
                return transactionDate >= monthStart && transactionDate <= monthEnd;
              })
              .reduce((sum, t) => sum + Math.abs(t.amount), 0);
            
            dataArray.push(Math.round(monthTotal));
          }
          
          setMonths(monthsArray);
          setMonthlySpendingData(dataArray);
          
          const max = Math.max(...dataArray, 100);
          const avg = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
          
          setMaxSpending(max);
          setAverageSpending(avg);
        }
        
      } catch (error) {
        console.error('Error fetching monthly spending data:', error);
        // Set default empty data on error
        setMonths(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']);
        setMonthlySpendingData([0, 0, 0, 0, 0, 0]);
        setMaxSpending(100);
        setAverageSpending(0);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMonthlyData();
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
              <h1>Monthly Spending Analysis</h1>
              <p>Loading your spending data...</p>
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

  // Find highest and lowest month info
  const highestIndex = monthlySpendingData.indexOf(Math.max(...monthlySpendingData));
  const lowestIndex = monthlySpendingData.indexOf(Math.min(...monthlySpendingData));
  const highestMonth = months[highestIndex] || 'N/A';
  const lowestMonth = months[lowestIndex] || 'N/A';

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
            <h1>Monthly Spending Analysis</h1>
            <p>Track your spending patterns and trends over time</p>
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
        {/* Main Spending Chart */}
        <div className="trend-card full-width">
          <div className="chart-header">
            <div>
              <h3>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}>
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
                Monthly Spending Trends
              </h3>
              <p className="chart-subtitle">
                Showing {months.length} months • Total: ₹{(monthlySpendingData.reduce((sum, val) => sum + val, 0)).toLocaleString('en-IN')} • 
                Average: ₹{Math.round(averageSpending).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="chart-summary">
              <span className="current-value">₹{Math.round(averageSpending).toLocaleString('en-IN')}</span>
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
                border: '2px solid #10b981'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
                <span style={{ color: '#000000' }}>+12% from previous period</span>
              </span>
            </div>
          </div>
          
          <div className="chart-container large">
            <div className="line-chart">
              <svg viewBox="0 0 900 500" className="trend-svg">
                <defs>
                  <pattern id="grid-monthly" width="90" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 90 0 L 0 0 0 50" fill="none" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="1"/>
                  </pattern>
                  <linearGradient id="lineGradient-monthly" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                  <linearGradient id="areaGradient-monthly" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#10b981" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                  <filter id="glow-monthly">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-monthly)" />
                
                {/* Y-axis labels */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                  const y = 80 + (340 - (ratio * 280));
                  const value = Math.round(maxSpending * ratio);
                  return (
                    <g key={index}>
                      <line 
                        x1="80" 
                        y1={y} 
                        x2="820" 
                        y2={y} 
                        stroke="#e2e8f0" 
                        strokeWidth="1"
                        opacity="0.5"
                        className="y-axis-line"
                      />
                      <text
                        x="75"
                        y={y + 5}
                        textAnchor="end"
                        fill="#64748b"
                        fontSize="14"
                        fontWeight="600"
                        className="y-label"
                      >
                        ₹{(value / 1000).toFixed(1)}k
                      </text>
                    </g>
                  );
                })}
                
                {/* Area under curve */}
                <path
                  d={`M ?${monthlySpendingData.map((value, index) => {
                    const x = 100 + (index * (700 / (months.length - 1)));
                    const y = 80 + (340 - ((value / maxSpending) * 280));
                    return `?${index === 0 ? 'M' : 'L'} ?${x},?${y}`;
                  }).join(' ')} L ?${100 + ((months.length - 1) * (700 / (months.length - 1)))},420 L 100,420 Z`}
                  fill="url(#areaGradient-monthly)"
                />
                
                {/* Main trend line */}
                <path
                  d={monthlySpendingData.map((value, index) => {
                    const x = 100 + (index * (700 / (months.length - 1)));
                    const y = 80 + (340 - ((value / maxSpending) * 280));
                    return `?${index === 0 ? 'M' : 'L'} ?${x},?${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="url(#lineGradient-monthly)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow-monthly)"
                  className="trend-line"
                  style={{ opacity: 0.95 }}
                />
                
                {/* Data points with professional hover effects */}
                {months.map((month, index) => {
                  const x = 100 + (index * (700 / (months.length - 1)));
                  const normalizedValue = (monthlySpendingData[index] / maxSpending);
                  const y = 80 + (340 - (normalizedValue * 280));
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
                        stroke="#10b981"
                        strokeWidth="2"
                        className="data-point-ring"
                        style={{ opacity: 0, transition: 'all 0.3s ease' }}
                      />
                      {/* Inner glow */}
                      <circle
                        cx={x}
                        cy={y}
                        r="11"
                        fill="#10b981"
                        className="data-point-glow"
                        style={{ opacity: 0, transition: 'all 0.3s ease' }}
                      />
                      {/* Main data point */}
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        fill="#10b981"
                        stroke="#ffffff"
                        strokeWidth="4"
                        className="data-point"
                        style={{ 
                          filter: 'drop-shadow(0 4px 12px rgba(16, 185, 129, 0.5))',
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
                        fill="#10b981"
                        rx="6"
                        className="value-label-bg"
                        style={{ opacity: 0, transition: 'all 0.3s ease' }}
                      />
                      {/* Value label */}
                      <text
                        x={x}
                        y={y - 28}
                        textAnchor="middle"
                        fill="#1e293b"
                        fontSize="15"
                        fontWeight="700"
                        className="value-label"
                        style={{ 
                          opacity: 0.85,
                          transition: 'all 0.3s ease',
                          pointerEvents: 'none'
                        }}
                      >
                        ₹{(monthlySpendingData[index] / 1000).toFixed(1)}k
                      </text>
                      {/* Month label background */}
                      <rect
                        x={x - 30}
                        y={y + 18}
                        width="60"
                        height="26"
                        fill="#10b981"
                        rx="6"
                        className="month-label-bg"
                        style={{ opacity: 0, transition: 'all 0.3s ease' }}
                      />
                      {/* Month label */}
                      <text
                        x={x}
                        y={y + 37}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="14"
                        fontWeight="700"
                        className="month-hover-label"
                        style={{ 
                          opacity: 0,
                          transition: 'all 0.3s ease',
                          pointerEvents: 'none'
                        }}
                      >
                        {month}
                      </text>
                    </g>
                  );
                })}
              </svg>
              
              {/* Month labels */}
              <div className="chart-labels" style={{ 
                display: 'grid', 
                gridTemplateColumns: `repeat(?${months.length}, 1fr)`,
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
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="16 7 22 7 22 13"></polyline>
              </svg>
            </div>
            <div className="stat-content-trend">
              <h4>Highest Month</h4>
              <span className="stat-value">₹{Math.max(...monthlySpendingData).toLocaleString('en-IN')}</span>
              <span className="stat-label">{highestMonth} {new Date().getFullYear()}</span>
            </div>
          </div>

          <div className="stat-card-trend">
            <div className="stat-icon-trend">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 17 13.5 8.5 8.5 13.5 1 6"></polyline>
                <polyline points="16 17 22 17 22 11"></polyline>
              </svg>
            </div>
            <div className="stat-content-trend">
              <h4>Lowest Month</h4>
              <span className="stat-value">₹{Math.min(...monthlySpendingData).toLocaleString('en-IN')}</span>
              <span className="stat-label">{lowestMonth} {new Date().getFullYear()}</span>
            </div>
          </div>

          <div className="stat-card-trend">
            <div className="stat-icon-trend">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            </div>
            <div className="stat-content-trend">
              <h4>Average Spending</h4>
              <span className="stat-value">₹{Math.round(averageSpending).toLocaleString('en-IN')}</span>
              <span className="stat-label">Per month</span>
            </div>
          </div>

          <div className="stat-card-trend">
            <div className="stat-icon-trend">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
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
          <h3>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            Spending Insights
          </h3>
          <div className="insights-grid">
            <div className="insight-item">
              <div className="insight-icon positive">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
              </div>
              <div className="insight-text">
                <h4>Consistent Spending</h4>
                <p>Your spending has remained relatively stable over the past {months.length} months, showing good budget control.</p>
              </div>
            </div>

            <div className="insight-item">
              <div className="insight-icon warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <div className="insight-text">
                <h4>March Spike</h4>
                <p>March showed a significant increase in spending. Consider reviewing what caused this spike.</p>
              </div>
            </div>

            <div className="insight-item">
              <div className="insight-icon info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                </svg>
              </div>
              <div className="insight-text">
                <h4>Optimization Opportunity</h4>
                <p>You could save approximately ₹{Math.round((averageSpending - Math.min(...monthlySpendingData)) * months.length).toLocaleString('en-IN')} annually by maintaining your lowest spending level.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlySpending;