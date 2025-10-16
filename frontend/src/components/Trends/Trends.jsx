import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import ErrorBoundary from '../Common/ErrorBoundary';
import './Trends.css';

const Trends = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [spendingPatterns, setSpendingPatterns] = useState(null);
  const [comparative, setComparative] = useState(null);

  useEffect(() => {
    const fetchTrendsData = async () => {
      try {
        setLoading(true);
        
        // Fetch all analytics data
        const [insightsData, trendsData, patternsData, comparativeData] = await Promise.all([
          apiService.getFinancialInsights(),
          apiService.getMonthlyTrends(6),
          apiService.getSpendingPatterns(),
          apiService.getComparativeAnalysis('month')
        ]);
        
        setInsights(insightsData);
        setMonthlyTrends(trendsData);
        setSpendingPatterns(patternsData);
        setComparative(comparativeData);
        
      } catch (error) {
        console.error('Error fetching trends data:', error);
        // Set default empty data on error
        setInsights({
          savingsRate: 0,
          recommendations: ['Unable to load insights. Please ensure you have transaction data.'],
          totalIncome: 0,
          totalExpenses: 0,
          netSavings: 0
        });
        setMonthlyTrends([]);
        setSpendingPatterns({ categoryAverages: [], dayOfWeekSpending: [] });
        setComparative(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrendsData();
  }, []);

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
              <h1>Financial Trends & Analytics</h1>
              <p>Loading your financial insights...</p>
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
            <h1>Financial Trends & Analytics</h1>
            <p>Comprehensive insights into your financial patterns and trends</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="action-btn" onClick={() => navigate('/trends/monthly-spending')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}>
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            Monthly Trends
          </button>
          <button className="action-btn" onClick={() => navigate('/trends/category-analysis')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v6l4 2"></path>
            </svg>
            Category Analysis
          </button>
        </div>
      </div>

      <div className="trends-content">
        {/* Financial Overview Cards */}
        <div className="stats-grid">
          <div className="stat-card-trend">
            <div className="stat-icon-trend" style={{ backgroundColor: '#10b981' }}>
              <span style={{ fontSize: '1.5rem' }}>💰</span>
            </div>
            <div className="stat-content-trend">
              <h4>Savings Rate</h4>
              <span className="stat-value">{insights?.savingsRate ? Math.round(insights.savingsRate) : 0}%</span>
              <span className="stat-label">Last 3 months</span>
            </div>
          </div>

          <div className="stat-card-trend">
            <div className="stat-icon-trend" style={{ backgroundColor: '#3b82f6' }}>
              <span style={{ fontSize: '1.5rem' }}>📈</span>
            </div>
            <div className="stat-content-trend">
              <h4>Total Income</h4>
              <span className="stat-value">${insights?.totalIncome ? Math.round(insights.totalIncome).toLocaleString() : '0'}</span>
              <span className="stat-label">Last 3 months</span>
            </div>
          </div>

          <div className="stat-card-trend">
            <div className="stat-icon-trend" style={{ backgroundColor: '#ef4444' }}>
              <span style={{ fontSize: '1.5rem' }}>📉</span>
            </div>
            <div className="stat-content-trend">
              <h4>Total Expenses</h4>
              <span className="stat-value">${insights?.totalExpenses ? Math.round(insights.totalExpenses).toLocaleString() : '0'}</span>
              <span className="stat-label">Last 3 months</span>
            </div>
          </div>

          <div className="stat-card-trend">
            <div className="stat-icon-trend" style={{ backgroundColor: '#8b5cf6' }}>
              <span style={{ fontSize: '1.5rem' }}>💎</span>
            </div>
            <div className="stat-content-trend">
              <h4>Net Savings</h4>
              <span className="stat-value">${insights?.netSavings ? Math.round(insights.netSavings).toLocaleString() : '0'}</span>
              <span className="stat-label">Last 3 months</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="trend-card">
          <h3 style={{ color: '#1f2937', fontWeight: '700', marginBottom: '1.5rem' }}>📊 Detailed Analytics</h3>
          <div className="category-grid">
            <div className="category-box" onClick={() => navigate('/trends/monthly-spending')} style={{ cursor: 'pointer' }}>
              <div className="category-box-header">
                <div className="category-icon" style={{ backgroundColor: '#10b981' }}>
                  <span style={{ fontSize: '1.5rem' }}>📈</span>
                </div>
                <h4>Monthly Spending Trends</h4>
              </div>
              <div className="category-box-content">
                <div className="category-amount-large">Track Patterns</div>
                <div className="category-percentage">View spending trends over time</div>
              </div>
            </div>

            <div className="category-box" onClick={() => navigate('/trends/category-analysis')} style={{ cursor: 'pointer' }}>
              <div className="category-box-header">
                <div className="category-icon" style={{ backgroundColor: '#3b82f6' }}>
                  <span style={{ fontSize: '1.5rem' }}>🎯</span>
                </div>
                <h4>Category Breakdown</h4>
              </div>
              <div className="category-box-content">
                <div className="category-amount-large">Analyze Spending</div>
                <div className="category-percentage">See where your money goes</div>
              </div>
            </div>

            <div className="category-box" onClick={() => navigate('/transactions')} style={{ cursor: 'pointer' }}>
              <div className="category-box-header">
                <div className="category-icon" style={{ backgroundColor: '#f59e0b' }}>
                  <span style={{ fontSize: '1.5rem' }}>💳</span>
                </div>
                <h4>Transaction History</h4>
              </div>
              <div className="category-box-content">
                <div className="category-amount-large">View Details</div>
                <div className="category-percentage">All your transactions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Insights */}
        {insights && insights.recommendations && insights.recommendations.length > 0 && (
        <div className="trend-card">
          <h3 style={{ color: '#1f2937', fontWeight: '700', marginBottom: '1.5rem' }}>💡 Financial Insights & Recommendations</h3>
          <div className="insights-grid">
            {insights.recommendations.map((recommendation, index) => (
              <div key={index} className="insight-item">
                <div className="insight-icon info">
                  <span style={{ fontSize: '1.2rem' }}>💡</span>
                </div>
                <div className="insight-text">
                  <h4>Recommendation {index + 1}</h4>
                  <p>{recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Spending Patterns */}
        {spendingPatterns && spendingPatterns.categoryAverages && spendingPatterns.categoryAverages.length > 0 && (
        <div className="trend-card">
          <h3 style={{ color: '#1f2937', fontWeight: '700', marginBottom: '1.5rem' }}>📊 Spending Patterns</h3>
          <div className="category-grid">
            {spendingPatterns.categoryAverages.slice(0, 6).map((category, index) => (
              <div key={index} className="category-box">
                <div className="category-box-header">
                  <div className="category-icon" style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}>
                    <span style={{ fontSize: '1.2rem' }}>📦</span>
                  </div>
                  <h4>{category.category}</h4>
                </div>
                <div className="category-box-content">
                  <div className="category-amount-large">${Math.round(category.averageAmount).toLocaleString()}</div>
                  <div className="category-percentage">Average per transaction</div>
                  <div className="progress-bar-horizontal">
                    <div 
                      className="progress-fill-animated" 
                      style={{ 
                        width: `${Math.min((category.averageAmount / Math.max(...spendingPatterns.categoryAverages.map(c => c.averageAmount))) * 100, 100)}%`,
                        backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                      }}
                    ></div>
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

export default Trends;