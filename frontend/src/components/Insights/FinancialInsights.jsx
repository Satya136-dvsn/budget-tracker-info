import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import './FinancialInsights.css';

const FinancialInsights = () => {
  const navigate = useNavigate();
  const [insights, setInsights] = useState(null);
  const [spendingPatterns, setSpendingPatterns] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchInsightsData();
  }, []);

  const fetchInsightsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [insightsData, patternsData] = await Promise.all([
        apiService.getFinancialInsights(),
        apiService.getSpendingPatterns()
      ]);
      
      setInsights(insightsData);
      setSpendingPatterns(patternsData);
    } catch (error) {
      console.error('Error fetching insights:', error);
      setError('Failed to load financial insights');
    } finally {
      setLoading(false);
    }
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const getHealthScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const communityTips = [
    {
      id: 1,
      title: "50/30/20 Rule",
      description: "Allocate 50% for needs, 30% for wants, and 20% for savings and debt repayment.",
      category: "Budgeting",
      likes: 245,
      author: "Financial Expert"
    },
    {
      id: 2,
      title: "Emergency Fund Priority",
      description: "Build an emergency fund covering 3-6 months of expenses before investing.",
      category: "Savings",
      likes: 189,
      author: "Community Member"
    },
    {
      id: 3,
      title: "Track Small Expenses",
      description: "Small daily expenses like coffee can add up to significant amounts over time.",
      category: "Spending",
      likes: 156,
      author: "Budget Coach"
    },
    {
      id: 4,
      title: "Automate Savings",
      description: "Set up automatic transfers to savings accounts to build wealth consistently.",
      category: "Automation",
      likes: 203,
      author: "Financial Advisor"
    }
  ];

  if (loading) {
    return (
      <div className="insights-page">
        <div className="insights-header">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div className="header-title">
              <h1>Financial Insights</h1>
              <p>Loading your personalized insights...</p>
            </div>
          </div>
        </div>
        <div className="insights-content">
          <div className="insight-card full-width" style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading-spinner"></div>
            <p>Analyzing your financial data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="insights-page">
        <div className="insights-header">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div className="header-title">
              <h1>Financial Insights</h1>
              <p>Error loading insights</p>
            </div>
          </div>
        </div>
        <div className="insights-content">
          <div className="insight-card full-width error-card">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
              <h3 style={{ color: '#ef4444', marginBottom: '1rem' }}>Unable to Load Insights</h3>
              <p style={{ color: '#64748b', marginBottom: '2rem' }}>{error}</p>
              <button 
                onClick={fetchInsightsData}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  cursor: 'pointer'
                }}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="insights-page">
      <div className="insights-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="header-title">
            <h1>Financial Insights</h1>
            <p>AI-powered analysis and community tips</p>
          </div>
        </div>
      </div>

      <div className="insights-content">
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'patterns' ? 'active' : ''}`}
            onClick={() => setActiveTab('patterns')}
          >
            📈 Patterns
          </button>
          <button 
            className={`tab-btn ${activeTab === 'community' ? 'active' : ''}`}
            onClick={() => setActiveTab('community')}
          >
            👥 Community Tips
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && insights && (
          <>
            {/* Financial Health Score */}
            <div className="insight-card health-score-card">
              <h3>🎯 Financial Health Score</h3>
              <div className="health-score-display">
                <div className="score-circle">
                  <div 
                    className="score-progress"
                    style={{
                      background: `conic-gradient(${getHealthScoreColor(insights.healthScore)} ${insights.healthScore * 3.6}deg, #f1f5f9 0deg)`
                    }}
                  >
                    <div className="score-inner">
                      <span className="score-number">{insights.healthScore}</span>
                      <span className="score-label">{getHealthScoreLabel(insights.healthScore)}</span>
                    </div>
                  </div>
                </div>
                <div className="score-details">
                  <div className="score-metric">
                    <span className="metric-label">Savings Rate</span>
                    <span className="metric-value">{parseFloat(insights.savingsRate).toFixed(1)}%</span>
                  </div>
                  <div className="score-metric">
                    <span className="metric-label">Balance</span>
                    <span className="metric-value">{formatCurrency(insights.balance)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon" style={{ backgroundColor: '#22c55e' }}>💰</div>
                <div className="metric-content">
                  <h4>Total Income</h4>
                  <span className="metric-amount">{formatCurrency(insights.totalIncome)}</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon" style={{ backgroundColor: '#ef4444' }}>💸</div>
                <div className="metric-content">
                  <h4>Total Expenses</h4>
                  <span className="metric-amount">{formatCurrency(insights.totalExpenses)}</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon" style={{ backgroundColor: '#3b82f6' }}>📊</div>
                <div className="metric-content">
                  <h4>Monthly Average</h4>
                  <span className="metric-amount">
                    {insights.monthlyAverages ? formatCurrency(insights.monthlyAverages.avgExpense || 0) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="insight-card">
              <h3>🤖 AI Recommendations</h3>
              <div className="recommendations-list">
                {insights.recommendations && insights.recommendations.map((recommendation, index) => (
                  <div key={index} className="recommendation-item">
                    <div className="recommendation-icon">💡</div>
                    <p>{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Spending Categories */}
            {insights.topCategories && insights.topCategories.length > 0 && (
              <div className="insight-card">
                <h3>🏷️ Top Spending Categories</h3>
                <div className="category-list">
                  {insights.topCategories.map((category, index) => (
                    <div key={index} className="category-item">
                      <div className="category-info">
                        <span className="category-name">{category.category}</span>
                        <span className="category-amount">{formatCurrency(category.totalAmount)}</span>
                      </div>
                      <div className="category-bar">
                        <div 
                          className="category-progress"
                          style={{
                            width: `${(category.totalAmount / insights.topCategories[0].totalAmount) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Patterns Tab */}
        {activeTab === 'patterns' && spendingPatterns && (
          <>
            {/* Spending by Day of Week */}
            {spendingPatterns.dayOfWeekSpending && (
              <div className="insight-card">
                <h3>📅 Spending by Day of Week</h3>
                <div className="day-spending-chart">
                  {spendingPatterns.dayOfWeekSpending.map((day, index) => {
                    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    const maxAmount = Math.max(...spendingPatterns.dayOfWeekSpending.map(d => d.totalAmount));
                    return (
                      <div key={index} className="day-bar">
                        <div className="day-label">{dayNames[day.dayOfWeek - 1]}</div>
                        <div className="day-bar-container">
                          <div 
                            className="day-bar-fill"
                            style={{
                              height: `${(day.totalAmount / maxAmount) * 100}%`
                            }}
                          ></div>
                        </div>
                        <div className="day-amount">${day.totalAmount.toFixed(0)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Largest Transactions */}
            {spendingPatterns.largestTransactions && (
              <div className="insight-card">
                <h3>💳 Largest Transactions</h3>
                <div className="large-transactions-list">
                  {spendingPatterns.largestTransactions.slice(0, 5).map((transaction, index) => (
                    <div key={index} className="large-transaction-item">
                      <div className="transaction-info">
                        <span className="transaction-title">{transaction.title}</span>
                        <span className="transaction-category">{transaction.category}</span>
                      </div>
                      <div className="transaction-amount">{formatCurrency(transaction.amount)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category Distribution */}
            {spendingPatterns.categoryDistribution && (
              <div className="insight-card">
                <h3>🥧 Category Distribution</h3>
                <div className="category-distribution">
                  {spendingPatterns.categoryDistribution.slice(0, 6).map((category, index) => (
                    <div key={index} className="distribution-item">
                      <div className="distribution-info">
                        <span className="distribution-category">{category.category}</span>
                        <span className="distribution-percentage">{parseFloat(category.percentage).toFixed(1)}%</span>
                      </div>
                      <div className="distribution-amount">{formatCurrency(category.totalAmount)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Community Tips Tab */}
        {activeTab === 'community' && (
          <div className="insight-card">
            <h3>👥 Community Financial Tips</h3>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>
              Learn from the community's best financial practices and tips
            </p>
            <div className="community-tips-grid">
              {communityTips.map((tip) => (
                <div key={tip.id} className="tip-card">
                  <div className="tip-header">
                    <h4>{tip.title}</h4>
                    <span className="tip-category">{tip.category}</span>
                  </div>
                  <p className="tip-description">{tip.description}</p>
                  <div className="tip-footer">
                    <span className="tip-author">by {tip.author}</span>
                    <div className="tip-likes">
                      <span>👍 {tip.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialInsights;