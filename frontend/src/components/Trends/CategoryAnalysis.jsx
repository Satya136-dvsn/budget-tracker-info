import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

const CategoryAnalysis = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [categories, setCategories] = useState([]);
  const [totalSpending, setTotalSpending] = useState(0);
  const [loading, setLoading] = useState(true);

  // Category icon mapping
  const categoryIcons = {
    'Food & Dining': '🍽️',
    'Food': '🍽️',
    'Dining': '🍽️',
    'Transportation': '🚗',
    'Transport': '🚗',
    'Shopping': '🛍️',
    'Entertainment': '🎬',
    'Bills & Utilities': '📋',
    'Bills': '📋',
    'Utilities': '📋',
    'Healthcare': '⚕️',
    'Health': '⚕️',
    'Education': '📚',
    'Groceries': '🛒',
    'Salary': '💰',
    'Income': '💰',
    'Investment': '📈',
    'Other': '📦'
  };

  // Category color palette
  const categoryColors = [
    '#667eea', '#764ba2', '#22c55e', '#f59e0b', 
    '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899',
    '#64748b', '#14b8a6', '#f97316', '#a855f7'
  ];

  // Fetch category breakdown data
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        
        // Fetch expense breakdown from backend
        const breakdown = await apiService.getExpenseBreakdown();
        console.log('Received breakdown data:', breakdown);
        
        // Validate API response
        if (!Array.isArray(breakdown)) {
          console.warn('Invalid breakdown data received:', breakdown);
          setCategories([]);
          setTotalSpending(0);
          return;
        }

        // Transform API data to component format
        const categoriesWithDetails = breakdown.map((item, index) => ({
          name: item.category || item.categoryName || 'Other',
          amount: Math.abs(parseFloat(item.totalAmount || item.amount || 0)),
          color: categoryColors[index % categoryColors.length],
          icon: categoryIcons[item.category || item.categoryName] || categoryIcons['Other']
        })).filter(item => item.amount > 0); // Filter out zero amounts
        
        // Sort by amount descending
        categoriesWithDetails.sort((a, b) => b.amount - a.amount);
        
        const total = categoriesWithDetails.reduce((sum, cat) => sum + cat.amount, 0);
        
        setCategories(categoriesWithDetails);
        setTotalSpending(total);
        
      } catch (error) {
        console.error('Error fetching category data:', error);
        // Set empty data on error
        setCategories([]);
        setTotalSpending(0);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategoryData();
  }, [selectedPeriod]);

  // Calculate pie chart segments
  const calculatePieSegments = () => {
    if (!categories.length || totalSpending === 0) {
      return [];
    }
    
    let cumulativePercentage = 0;
    return categories.map((category) => {
      const percentage = (category.amount / totalSpending) * 100;
      const startAngle = cumulativePercentage * 3.6; // Convert to degrees
      const endAngle = (cumulativePercentage + percentage) * 3.6;
      
      cumulativePercentage += percentage;
      
      return {
        ...category,
        percentage: percentage.toFixed(1),
        startAngle,
        endAngle,
        path: createArcPath(250, 250, 120, startAngle, endAngle)
      };
    });
  };

  const createArcPath = (centerX, centerY, radius, startAngle, endAngle) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", centerX, centerY,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  // Calculate tooltip position based on segment center
  const getTooltipPosition = (startAngle, endAngle) => {
    const midAngle = (startAngle + endAngle) / 2;
    const tooltipRadius = 180; // Further outside the pie chart
    const center = polarToCartesian(250, 250, tooltipRadius, midAngle);
    
    // Adjust position to avoid overlapping with chart
    let adjustedX = center.x;
    let adjustedY = center.y;
    
    // Push tooltips further out based on quadrant
    if (midAngle >= 0 && midAngle < 90) {
      // Top-right quadrant
      adjustedX += 40;
      adjustedY -= 20;
    } else if (midAngle >= 90 && midAngle < 180) {
      // Top-left quadrant  
      adjustedX -= 40;
      adjustedY -= 20;
    } else if (midAngle >= 180 && midAngle < 270) {
      // Bottom-left quadrant
      adjustedX -= 40;
      adjustedY += 20;
    } else {
      // Bottom-right quadrant
      adjustedX += 40;
      adjustedY += 20;
    }
    
    return { x: adjustedX, y: adjustedY };
  };

  // Calculate line connection point
  const getLineEndPoint = (startAngle, endAngle) => {
    const midAngle = (startAngle + endAngle) / 2;
    const lineRadius = 125; // Edge of the pie chart
    return polarToCartesian(250, 250, lineRadius, midAngle);
  };

  const handleSegmentHover = (segment, index) => {
    const tooltipPos = getTooltipPosition(segment.startAngle, segment.endAngle);
    setHoveredSegment(index);
    setTooltipPosition(tooltipPos);
  };

  const handleSegmentLeave = () => {
    setHoveredSegment(null);
  };

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
              <h1>Category Analysis</h1>
              <p>Loading your category breakdown...</p>
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

  // Handle empty data case
  if (categories.length === 0 && !loading) {
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
              <h1>Category Analysis</h1>
              <p>No spending data available</p>
            </div>
          </div>
        </div>
        <div className="trends-content">
          <div className="trend-card full-width" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
            <h3 style={{ color: '#64748b', marginBottom: '1rem' }}>No Expense Data Found</h3>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>
              Start adding expense transactions to see your category breakdown and spending patterns.
            </p>
            <button 
              onClick={() => navigate('/transactions')} 
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              Add Your First Transaction
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pieSegments = calculatePieSegments();

  // Safety check for pie segments
  if (!Array.isArray(pieSegments) || pieSegments.length === 0) {
    console.warn('No pie segments calculated, showing empty state');
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
              <h1>Category Analysis</h1>
              <p>Unable to generate chart data</p>
            </div>
          </div>
        </div>
        <div className="trends-content">
          <div className="trend-card full-width" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
            <h3 style={{ color: '#64748b', marginBottom: '1rem' }}>Chart Data Unavailable</h3>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>
              There was an issue processing your expense data. Please try refreshing the page.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Refresh Page
            </button>
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
              <h1>Category Analysis</h1>
              <p>See where your money goes across different spending categories</p>
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
          {/* Main Category Breakdown - Side by Side Layout */}
          <div className="category-analysis-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Pie Chart */}
            <div className="trend-card">
              <div className="chart-header">
                <h3>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                  Spending Distribution
                </h3>
                <p className="chart-subtitle">Total: ${totalSpending.toLocaleString()}</p>
              </div>
              <div className="pie-chart-container">
                <svg viewBox="0 0 500 500" className="pie-chart">
                <defs>
                  {categories.map((category, index) => (
                    <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={category.color} stopOpacity="0.9" />
                      <stop offset="100%" stopColor={category.color} stopOpacity="0.7" />
                    </linearGradient>
                  ))}
                  {/* Enhanced gradients for hover state */}
                  {categories.map((category, index) => (
                    <linearGradient key={`hover-${index}`} id={`gradient-hover-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={category.color} stopOpacity="1" />
                      <stop offset="100%" stopColor={category.color} stopOpacity="0.9" />
                    </linearGradient>
                  ))}
                </defs>
                
                {/* Pie segments */}
                {pieSegments.map((segment, index) => {
                  const isHovered = hoveredSegment === index;
                  const lineEnd = getLineEndPoint(segment.startAngle, segment.endAngle);
                  
                  return (
                    <g key={index}>
                      <path
                        d={segment.path}
                        fill={isHovered ? `url(#gradient-hover-${index})` : `url(#gradient-${index})`}
                        stroke="white"
                        strokeWidth="3"
                        className="pie-segment"
                        style={{
                          filter: isHovered 
                            ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' 
                            : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                          cursor: 'pointer',
                          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                          transformOrigin: '250px 250px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={() => handleSegmentHover(segment, index)}
                        onMouseLeave={handleSegmentLeave}
                      />
                      
                      {/* Simple straight line to tooltip */}
                      {isHovered && (
                        <line
                          x1={lineEnd.x}
                          y1={lineEnd.y}
                          x2={tooltipPosition.x}
                          y2={tooltipPosition.y}
                          stroke="#000000"
                          strokeWidth="1.5"
                          style={{
                            opacity: 0.7
                          }}
                        />
                      )}
                    </g>
                  );
                })}
                
                {/* Center circle */}
                <circle cx="250" cy="250" r="60" fill="white" stroke="#e2e8f0" strokeWidth="2" />
                <text x="250" y="240" textAnchor="middle" className="pie-center-text">Total</text>
                <text x="250" y="260" textAnchor="middle" className="pie-center-value">${(totalSpending/1000).toFixed(1)}k</text>
                
                {/* Callout-style tooltip */}
                {hoveredSegment !== null && (
                  <g className="pie-tooltip">
                    {/* Tooltip background */}
                    <rect
                      x={tooltipPosition.x - 70}
                      y={tooltipPosition.y - 25}
                      width="140"
                      height="50"
                      rx="4"
                      fill="white"
                      stroke="#cccccc"
                      strokeWidth="1"
                      style={{
                        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))'
                      }}
                    />
                    
                    {/* Category name */}
                    <text
                      x={tooltipPosition.x}
                      y={tooltipPosition.y - 8}
                      textAnchor="middle"
                      className="tooltip-category-name"
                      style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        fill: '#333333',
                        fontFamily: 'Arial, sans-serif'
                      }}
                    >
                      {pieSegments[hoveredSegment].name}
                    </text>
                    
                    {/* Percentage */}
                    <text
                      x={tooltipPosition.x}
                      y={tooltipPosition.y + 8}
                      textAnchor="middle"
                      className="tooltip-percentage"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fill: '#333333',
                        fontFamily: 'Arial, sans-serif'
                      }}
                    >
                      {pieSegments[hoveredSegment].percentage}%
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Category List */}
          <div className="trend-card full-width">
            <h3 style={{ color: '#1f2937', fontWeight: '700', marginBottom: '1.5rem' }}>📊 Category Breakdown</h3>
            <div className="category-grid">
              {categories.map((category, index) => {
                const percentage = ((category.amount / totalSpending) * 100).toFixed(1);
                return (
                  <div key={index} className="category-box">
                    <div className="category-box-header">
                      <div className="category-icon" style={{ backgroundColor: category.color }}>
                        <span style={{ fontSize: '1.5rem' }}>{category.icon}</span>
                      </div>
                      <h4>{category.name}</h4>
                    </div>
                    <div className="category-box-content">
                      <div className="category-amount-large">${category.amount.toLocaleString()}</div>
                      <div className="category-percentage">{percentage}% of total</div>
                      <div className="progress-bar-horizontal">
                        <div 
                          className="progress-fill-animated" 
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: category.color 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Categories Stats */}
        {categories.length > 0 && (
        <div className="stats-grid">
          <div className="stat-card-trend">
            <div className="stat-icon-trend" style={{ backgroundColor: categories[0]?.color || '#10b981' }}>
              <span style={{ fontSize: '1.2rem' }}>{categories[0]?.icon || '📊'}</span>
            </div>
            <div className="stat-content-trend">
              <h4>Highest Category</h4>
              <span className="stat-value">${categories[0]?.amount?.toLocaleString() || '0'}</span>
              <span className="stat-label">{categories[0]?.name || 'N/A'}</span>
            </div>
          </div>

          <div className="stat-card-trend">
            <div className="stat-icon-trend" style={{ backgroundColor: categories[categories.length-1]?.color || '#10b981' }}>
              <span style={{ fontSize: '1.2rem' }}>{categories[categories.length-1]?.icon || '📊'}</span>
            </div>
            <div className="stat-content-trend">
              <h4>Lowest Category</h4>
              <span className="stat-value">${categories[categories.length-1]?.amount?.toLocaleString() || '0'}</span>
              <span className="stat-label">{categories[categories.length-1]?.name || 'N/A'}</span>
            </div>
          </div>

          <div className="stat-card-trend">
            <div className="stat-icon-trend">
              <span style={{ fontSize: '1.2rem' }}>📊</span>
            </div>
            <div className="stat-content-trend">
              <h4>Categories</h4>
              <span className="stat-value">{categories.length}</span>
              <span className="stat-label">Active categories</span>
            </div>
          </div>

          <div className="stat-card-trend">
            <div className="stat-icon-trend">
              <span style={{ fontSize: '1.2rem' }}>🧮</span>
            </div>
            <div className="stat-content-trend">
              <h4>Average per Category</h4>
              <span className="stat-value">${Math.round(totalSpending / categories.length).toLocaleString()}</span>
              <span className="stat-label">Per category</span>
            </div>
          </div>
        </div>
        )}

        {/* Spending Recommendations */}
        {categories.length > 0 && (
        <div className="trend-card">
          <h3 style={{ color: '#1f2937', fontWeight: '700', marginBottom: '1.5rem' }}>💡 Category Insights & Recommendations</h3>
          <div className="insights-grid">
            <div className="insight-item">
              <div className="insight-icon warning">
                <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              </div>
              <div className="insight-text">
                <h4>{categories[0]?.name || 'Top Category'}: {categories[0] && totalSpending > 0 ? ((categories[0].amount / totalSpending) * 100).toFixed(1) : '0'}%</h4>
                <p>This is your largest expense category. Consider ways to optimize spending in this area.</p>
              </div>
            </div>

            <div className="insight-item">
              <div className="insight-icon info">
                <span style={{ fontSize: '1.2rem' }}>⚖️</span>
              </div>
              <div className="insight-text">
                <h4>Budget Balance</h4>
                <p>Your spending is distributed across {categories.length} categories. Consider setting individual category budgets.</p>
              </div>
            </div>

            {categories.length >= 3 && (
            <div className="insight-item">
              <div className="insight-icon positive">
                <span style={{ fontSize: '1.2rem' }}>🎯</span>
              </div>
              <div className="insight-text">
                <h4>Optimization Goal</h4>
                <p>Reducing your top 3 categories by 10% could save you ${Math.round((categories[0]?.amount + categories[1]?.amount + categories[2]?.amount) * 0.1).toLocaleString()} monthly.</p>
              </div>
            </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default CategoryAnalysis;