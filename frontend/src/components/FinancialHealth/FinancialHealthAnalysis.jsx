import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import './FinancialHealthAnalysis.css';

const FinancialHealthAnalysis = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState('current');
  const [activeTab, setActiveTab] = useState('overview');
  const [insights, setInsights] = useState(null);
  const [spendingPatterns, setSpendingPatterns] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchInsightsData();
    }
  }, [user]);

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

  // Enhanced financial calculations using real data
  const monthlyIncome = user?.monthlyIncome || 0;
  const currentSavings = user?.currentSavings || 0;
  const targetExpenses = user?.targetExpenses || 0;
  const monthlyDebt = user?.monthlyDebt || 0;
  
  const savingsRate = monthlyIncome ? ((currentSavings / monthlyIncome) * 100).toFixed(1) : 0;
  const expenseRatio = monthlyIncome ? ((targetExpenses / monthlyIncome) * 100).toFixed(1) : 0;
  const debtToIncomeRatio = monthlyIncome ? ((monthlyDebt / monthlyIncome) * 100).toFixed(1) : 0;
  const emergencyFundMonths = monthlyIncome ? (currentSavings / monthlyIncome).toFixed(1) : 0;
  
  // Format currency in Indian Rupees
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Additional metrics - use real data when available
  const creditScore = insights?.creditScore || 0;
  const creditUtilization = insights?.creditUtilization || 0;
  const netWorthGrowth = insights?.netWorthGrowth || 0;
  const budgetAdherence = insights?.budgetAdherence || 0;

  // Enhanced scoring algorithm
  const calculateDetailedHealthScore = () => {
    const factors = [
      {
        name: 'Savings Rate',
        icon: '💰',
        current: parseFloat(savingsRate),
        target: 20,
        weight: 0.25,
        description: 'Percentage of income saved monthly',
        calculation: (value) => {
          if (value >= 20) return 100;
          if (value >= 15) return 80;
          if (value >= 10) return 60;
          if (value >= 5) return 40;
          return 20;
        }
      },
      {
        name: 'Emergency Fund',
        icon: '🛡️',
        current: parseFloat(emergencyFundMonths),
        target: 6,
        weight: 0.20,
        description: 'Months of expenses covered by savings',
        calculation: (value) => {
          if (value >= 6) return 100;
          if (value >= 3) return 75;
          if (value >= 1) return 50;
          return 25;
        }
      },
      {
        name: 'Expense Control',
        icon: '💸',
        current: parseFloat(expenseRatio),
        target: 50,
        weight: 0.15,
        description: 'Percentage of income spent on expenses',
        calculation: (value) => {
          if (value <= 50) return 100;
          if (value <= 70) return 75;
          if (value <= 85) return 50;
          return 25;
        }
      },
      {
        name: 'Debt Management',
        icon: '💳',
        current: parseFloat(debtToIncomeRatio),
        target: 10,
        weight: 0.15,
        description: 'Debt payments as percentage of income',
        calculation: (value) => {
          if (value <= 10) return 100;
          if (value <= 20) return 75;
          if (value <= 36) return 50;
          return 25;
        }
      },
      {
        name: 'Credit Health',
        icon: '📊',
        current: creditScore,
        target: 750,
        weight: 0.10,
        description: 'Credit score and utilization',
        calculation: (value) => {
          if (value >= 750) return 100;
          if (value >= 700) return 80;
          if (value >= 650) return 60;
          if (value >= 600) return 40;
          return 20;
        }
      },
      {
        name: 'Wealth Growth',
        icon: '📈',
        current: netWorthGrowth,
        target: 10,
        weight: 0.10,
        description: 'Annual net worth growth percentage',
        calculation: (value) => {
          if (value >= 10) return 100;
          if (value >= 5) return 75;
          if (value >= 0) return 50;
          return 25;
        }
      },
      {
        name: 'Budget Discipline',
        icon: '🎯',
        current: budgetAdherence,
        target: 90,
        weight: 0.05,
        description: 'Adherence to monthly budget',
        calculation: (value) => {
          if (value >= 90) return 100;
          if (value >= 80) return 75;
          if (value >= 70) return 50;
          return 25;
        }
      }
    ];

    let totalScore = 0;
    const detailedBreakdown = factors.map(factor => {
      const score = factor.calculation(factor.current);
      const weightedScore = score * factor.weight;
      totalScore += weightedScore;
      
      return {
        ...factor,
        score,
        weightedScore,
        status: score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor'
      };
    });

    return {
      totalScore: Math.round(totalScore),
      breakdown: detailedBreakdown
    };
  };

  const healthAnalysis = calculateDetailedHealthScore();
  
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreStatus = (score) => {
    if (score >= 80) return { text: 'Excellent', emoji: '🌟', color: '#10b981', icon: '🌟', status: 'Excellent' };
    if (score >= 60) return { text: 'Good', emoji: '👍', color: '#3b82f6', icon: '👍', status: 'Good' };
    if (score >= 40) return { text: 'Fair', emoji: '⚠️', color: '#f59e0b', icon: '⚠️', status: 'Fair' };
    return { text: 'Needs Work', emoji: '⚠️', color: '#ef4444', icon: '⚠️', status: 'Needs Work' };
  };

  const status = getScoreStatus(healthAnalysis.totalScore);

  // Improvement recommendations
  const getRecommendations = () => {
    const recommendations = [];
    
    healthAnalysis.breakdown.forEach(factor => {
      if (factor.score < 60) {
        switch (factor.name) {
          case 'Savings Rate':
            recommendations.push({
              priority: 'high',
              title: 'Increase Your Savings Rate',
              description: `Try to save at least 15-20% of your income. Consider automating savings transfers.`,
              action: 'Set up automatic savings'
            });
            break;
          case 'Emergency Fund':
            recommendations.push({
              priority: 'high',
              title: 'Build Emergency Fund',
              description: `Aim for 3-6 months of expenses. Start with ₹10000 as a mini-emergency fund.`,
              action: 'Create emergency fund goal'
            });
            break;
          case 'Expense Control':
            recommendations.push({
              priority: 'medium',
              title: 'Reduce Monthly Expenses',
              description: `Review subscriptions, dining out, and discretionary spending.`,
              action: 'Analyze spending categories'
            });
            break;
          case 'Debt Management':
            recommendations.push({
              priority: 'high',
              title: 'Reduce Debt Burden',
              description: `Focus on paying down high-interest debt first using debt avalanche method.`,
              action: 'Create debt payoff plan'
            });
            break;
          case 'Credit Health':
            recommendations.push({
              priority: 'medium',
              title: 'Improve Credit Score',
              description: `Pay bills on time, reduce credit utilization below 30%.`,
              action: 'Monitor credit report'
            });
            break;
          default:
            break;
        }
      }
    });

    // If no improvement needed, show maintenance recommendations
    if (recommendations.length === 0) {
      recommendations.push(
        {
          priority: 'medium',
          title: 'Maintain Your Excellent Progress',
          description: 'Continue your current financial habits and review your goals monthly to stay on track.',
          action: 'Review monthly goals'
        },
        {
          priority: 'medium',
          title: 'Consider Investment Diversification',
          description: 'Explore additional investment opportunities to maximize returns and manage risk effectively.',
          action: 'Explore investments'
        },
        {
          priority: 'medium',
          title: 'Plan for Long-term Goals',
          description: 'Set up retirement accounts, college funds, or other long-term financial objectives.',
          action: 'Set long-term goals'
        },
        {
          priority: 'medium',
          title: 'Review Insurance Coverage',
          description: 'Ensure you have adequate life, health, and property insurance for your situation.',
          action: 'Check insurance'
        }
      );
    }

    return recommendations.slice(0, 4); // Return top 4 recommendations
  };

  const recommendations = getRecommendations();

  // Community tips data
  const communityTips = [
    {
      id: 1,
      title: "50/30/20 Rule",
      description: "Allocate 50% for needs, 30% for wants, and 20% for savings and debt repayment.",
      category: "Budgeting",
      likes: 245,
      author: "Financial Expert",
      icon: "💰"
    },
    {
      id: 2,
      title: "Emergency Fund Priority",
      description: "Build an emergency fund covering 3-6 months of expenses before investing.",
      category: "Savings",
      likes: 189,
      author: "Community Member",
      icon: "🛡️"
    },
    {
      id: 3,
      title: "Track Small Expenses",
      description: "Small daily expenses like coffee can add up to significant amounts over time.",
      category: "Spending",
      likes: 156,
      author: "Budget Coach",
      icon: "☕"
    },
    {
      id: 4,
      title: "Automate Savings",
      description: "Set up automatic transfers to savings accounts to build wealth consistently.",
      category: "Automation",
      likes: 203,
      author: "Financial Advisor",
      icon: "🤖"
    },
    {
      id: 5,
      title: "Review Monthly Subscriptions",
      description: "Cancel unused subscriptions and negotiate better rates for services you use.",
      category: "Spending",
      likes: 178,
      author: "Money Saver",
      icon: "📱"
    },
    {
      id: 6,
      title: "Invest in Index Funds",
      description: "Low-cost index funds provide diversified exposure to the market with minimal fees.",
      category: "Investment",
      likes: 234,
      author: "Investment Advisor",
      icon: "📈"
    }
  ];

  if (loading) {
    return (
      <div className="financial-health-page">
        <div className="health-header">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              <span style={{ fontSize: '1rem' }}>&#8592;</span>
            </button>
            <div className="header-title">
              <h1>💚 Financial Health Analysis</h1>
              <p>Loading your financial insights...</p>
            </div>
          </div>
        </div>
        <div className="health-content">
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
      <div className="financial-health-page">
        <div className="health-header">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              <span style={{ fontSize: '1rem' }}>&#8592;</span>
            </button>
            <div className="header-title">
              <h1>💚 Financial Health Analysis</h1>
              <p>Error loading insights</p>
            </div>
          </div>
        </div>
        <div className="health-content">
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
                🔄 Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="financial-health-page">
      {/* Header */}
      <div className="health-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <span style={{ fontSize: '1rem' }}>&#8592;</span>
          </button>
          <div className="header-title">
            <h1>💚 Financial Health Analysis</h1>
            <p>Comprehensive analysis of your financial wellness</p>
          </div>
        </div>
        <div className="header-actions">
          <select 
            className="period-selector-custom"
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
          >
            <option value="current">Current Status</option>
            <option value="3months">3 Month Trend</option>
            <option value="6months">6 Month Trend</option>
            <option value="1year">1 Year Trend</option>
          </select>
        </div>
      </div>
      <div className="health-content">
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
        {activeTab === 'overview' && (
          <>
            {/* Overall Score */}
            <div className="health-score-card">
          <div className="score-display">
            <div className="score-circle-large">
              <div className="score-number-large">
                {healthAnalysis.totalScore}
              </div>
              <div className="score-label-large">Financial Health Score</div>
            </div>
            <div className="score-status-large">
              <span className="status-emoji">{status.icon}</span>
              <span className="status-text" style={{ color: status.color }}>
                {status.status}
              </span>
            </div>
          </div>
          
          {/* Color Legend */}
          <div className="color-legend">
            <h4>Score Guide:</h4>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
                <span>80-100: Excellent</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
                <span>60-79: Good</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
                <span>40-59: Fair</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
                <span>0-39: Needs Work</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="health-factors">
          <h3>📊 Factor Breakdown</h3>
          <div className="factors-grid">
            {healthAnalysis.breakdown.map((factor, index) => (
              <div key={index} className="factor-card">
                <div className="factor-header">
                  <span className="factor-icon">{factor.icon}</span>
                  <div className="factor-info">
                    <h4>{factor.name}</h4>
                    <p>{factor.description}</p>
                  </div>
                  <div className="factor-score" style={{ color: getScoreColor(factor.score) }}>
                    {factor.score}/100
                  </div>
                </div>
                <div className="factor-details">
                  <div className="current-vs-target">
                    <span>Current: <strong>{factor.current}{factor.name === 'Credit Health' ? '' : factor.name.includes('Rate') || factor.name.includes('Control') || factor.name.includes('Growth') || factor.name.includes('Discipline') ? '%' : factor.name.includes('Emergency') ? ' months' : '%'}</strong></span>
                    <span>Target: <strong>{factor.target}{factor.name === 'Credit Health' ? '+' : factor.name.includes('Rate') || factor.name.includes('Control') || factor.name.includes('Growth') || factor.name.includes('Discipline') ? '%' : factor.name.includes('Emergency') ? ' months' : '%'}</strong></span>
                  </div>
                  <div className="factor-progress">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${factor.score}%`,
                        backgroundColor: getScoreColor(factor.score)
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="health-recommendations">
          <h3>💡 Personalized Recommendations</h3>
          <div className="recommendations-grid">
            {recommendations.map((rec, index) => (
              <div key={index} className={`recommendation-card ${rec.priority}`}>
                <div className="rec-header">
                  <span className={`priority-badge ${rec.priority}`}>
                    {rec.priority === 'high' ? '🔥 High Priority' : '⚡ Medium Priority'}
                  </span>
                  <h4>{rec.title}</h4>
                </div>
                <p>{rec.description}</p>
                <button className="rec-action-btn">
                  {rec.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Health Trends */}
        <div className="health-trends">
          <h3>📈 Health Score Trends</h3>
          <div className="trends-chart">
            <div className="trend-placeholder">
              <div className="placeholder-icon">📊</div>
              <h4>Historical Trends Coming Soon</h4>
              <p>Track your financial health score progress over time</p>
              <p>View monthly comparisons and improvement patterns</p>
              <button className="placeholder-btn" onClick={() => alert('Feature coming soon!')}>
                🚀 Enable Tracking
              </button>
            </div>
          </div>
        </div>
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
                        <div className="day-amount">{formatCurrency(day.totalAmount)}</div>
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
                    <div className="tip-icon">{tip.icon}</div>
                    <div>
                      <h4>{tip.title}</h4>
                      <span className="tip-category">{tip.category}</span>
                    </div>
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

export default FinancialHealthAnalysis;