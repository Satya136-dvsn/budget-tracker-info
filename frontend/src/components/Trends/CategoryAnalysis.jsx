import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryAnalysis = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Sample data - replace with actual API data
  const categories = [
    { name: 'Food & Dining', amount: 1250, color: '#667eea', icon: '🍽️' },
    { name: 'Transportation', amount: 890, color: '#764ba2', icon: '🚗' },
    { name: 'Shopping', amount: 650, color: '#22c55e', icon: '🛍️' },
    { name: 'Entertainment', amount: 420, color: '#f59e0b', icon: '🎬' },
    { name: 'Bills & Utilities', amount: 780, color: '#ef4444', icon: '📋' },
    { name: 'Healthcare', amount: 320, color: '#8b5cf6', icon: '⚕️' },
    { name: 'Education', amount: 180, color: '#06b6d4', icon: '📚' },
    { name: 'Other', amount: 290, color: '#64748b', icon: '📦' }
  ];

  const totalSpending = categories.reduce((sum, cat) => sum + cat.amount, 0);

  // Calculate pie chart segments
  const calculatePieSegments = () => {
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

  const pieSegments = calculatePieSegments();

  return (
    <div className="trends-page">
      {/* Header */}
      <div className="trends-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <span style={{ fontSize: '1rem' }}>&#8592;</span>
          </button>
          <div className="header-title">
            <h1>Category Analysis</h1>
            <p>See where your money goes across different spending categories</p>
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
        {/* Main Category Breakdown */}
        <div className="category-analysis-grid">
          {/* Pie Chart */}
          <div className="trend-card">
            <div className="chart-header">
              <h3 style={{ color: '#1f2937', fontWeight: '700', marginBottom: '0.5rem' }}>📈 Spending Distribution</h3>
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
          <div className="trend-card">
            <h3 style={{ color: '#1f2937', fontWeight: '700', marginBottom: '1.5rem' }}>📊 Category Breakdown</h3>
            <div className="category-list">
              {categories.map((category, index) => {
                const percentage = ((category.amount / totalSpending) * 100).toFixed(1);
                return (
                  <div key={index} className="category-item">
                    <div className="category-info">
                      <div className="category-icon" style={{ backgroundColor: category.color }}>
                        <span style={{ fontSize: '1.2rem' }}>{category.icon}</span>
                      </div>
                      <div className="category-details">
                        <h4>{category.name}</h4>
                        <p>{percentage}% of total spending</p>
                      </div>
                    </div>
                    <div className="category-amount">
                      <span className="amount">${category.amount.toLocaleString()}</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
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
        <div className="stats-grid">
          <div className="stat-card-trend">
            <div className="stat-icon-trend" style={{ backgroundColor: categories[0].color }}>
              <span style={{ fontSize: '1.2rem' }}>{categories[0].icon}</span>
            </div>
            <div className="stat-content-trend">
              <h4>Highest Category</h4>
              <span className="stat-value">${categories[0].amount.toLocaleString()}</span>
              <span className="stat-label">{categories[0].name}</span>
            </div>
          </div>

          <div className="stat-card-trend">
            <div className="stat-icon-trend" style={{ backgroundColor: categories[categories.length-1].color }}>
              <span style={{ fontSize: '1.2rem' }}>{categories[categories.length-1].icon}</span>
            </div>
            <div className="stat-content-trend">
              <h4>Lowest Category</h4>
              <span className="stat-value">${categories[categories.length-1].amount.toLocaleString()}</span>
              <span className="stat-label">{categories[categories.length-1].name}</span>
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

        {/* Spending Recommendations */}
        <div className="trend-card">
          <h3 style={{ color: '#1f2937', fontWeight: '700', marginBottom: '1.5rem' }}>💡 Category Insights & Recommendations</h3>
          <div className="insights-grid">
            <div className="insight-item">
              <div className="insight-icon warning">
                <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              </div>
              <div className="insight-text">
                <h4>Food & Dining: {((categories[0].amount / totalSpending) * 100).toFixed(1)}%</h4>
                <p>This is your largest expense category. Consider meal planning and cooking at home to reduce costs.</p>
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

            <div className="insight-item">
              <div className="insight-icon positive">
                <span style={{ fontSize: '1.2rem' }}>🎯</span>
              </div>
              <div className="insight-text">
                <h4>Optimization Goal</h4>
                <p>Reducing your top 3 categories by 10% could save you ${Math.round((categories[0].amount + categories[1].amount + categories[2].amount) * 0.1).toLocaleString()} monthly.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryAnalysis;