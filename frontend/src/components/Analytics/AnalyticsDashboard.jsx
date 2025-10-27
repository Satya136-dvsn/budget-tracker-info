import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorBoundary from '../Common/ErrorBoundary';
import MonthlyTrendsChart from './MonthlyTrendsChart';
import CategoryBreakdownChart from './CategoryBreakdownChart';
import BudgetVsActualChart from './BudgetVsActualChart';
import SavingsProgressChart from './SavingsProgressChart';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(6);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [budgetMonth, setBudgetMonth] = useState(new Date().getMonth() + 1);
  const [budgetYear, setBudgetYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Generate mock analytics data
      const fallbackData = {
        financialHealth: {
          healthScore: 75,
          healthTrend: 'improving',
          factorScores: {
            savingsRate: 65,
            emergencyFund: 45,
            expenseRatio: 80
          },
          recommendations: [
            'Build an emergency fund covering 3-6 months of expenses',
            'Consider increasing your savings rate to 20%',
            'Review and optimize your monthly subscriptions'
          ]
        }
      };
      
      setAnalyticsData(fallbackData);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (e) => {
    const months = parseInt(e.target.value);
    setSelectedPeriod(months);
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    
    setDateRange({
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    });
  };

  if (loading) {
    return (
      <div className="analytics-dashboard">
        <div className="dashboard-header">
          <h1>📊 Analytics Dashboard</h1>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-dashboard">
        <div className="dashboard-header">
          <h1>📊 Analytics Dashboard</h1>
        </div>
        <div className="dashboard-error">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h2>Unable to Load Analytics</h2>
            <p>{error}</p>
            <button className="retry-button" onClick={fetchAnalyticsData}>
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="analytics-dashboard">
        <div className="dashboard-header">
          <h1>📊 Analytics Dashboard</h1>
          <div className="dashboard-controls">
            <label htmlFor="period-select">Time Period:</label>
            <select 
              id="period-select"
              value={selectedPeriod} 
              onChange={handlePeriodChange}
              className="period-selector"
            >
              <option value={3}>Last 3 months</option>
              <option value={6}>Last 6 months</option>
              <option value={12}>Last 12 months</option>
            </select>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Financial Health Score - Full Width, Clean Layout */}
          {analyticsData?.financialHealth && (
            <div className="dashboard-section">
              <h2>💚 Financial Health Score</h2>
              <div className="health-score-content">
                <div className="score-display">
                  <div className="score-circle">
                    <span className="score-number">
                      {analyticsData.financialHealth.healthScore}
                    </span>
                    <span className="score-label">/ 100</span>
                  </div>
                  <div className="score-trend">
                    <span className={`trend-indicator ${analyticsData.financialHealth.healthTrend}`}>
                      {analyticsData.financialHealth.healthTrend === 'improving' ? '↗️' : 
                       analyticsData.financialHealth.healthTrend === 'declining' ? '↘️' : '➡️'}
                      {analyticsData.financialHealth.healthTrend}
                    </span>
                  </div>
                </div>
                
                <div className="factor-scores">
                  {analyticsData.financialHealth.factorScores && 
                   Object.entries(analyticsData.financialHealth.factorScores).map(([factor, score]) => (
                    <div key={factor} className="factor-item">
                      <span className="factor-name">
                        {factor.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                      <div className="factor-bar">
                        <div 
                          className="factor-fill" 
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                      <span className="factor-score">{score}</span>
                    </div>
                  ))}
                </div>
              </div>

              {analyticsData.financialHealth.recommendations && 
               analyticsData.financialHealth.recommendations.length > 0 && (
                <div className="recommendations">
                  <h4>💡 Recommendations:</h4>
                  <ul>
                    {analyticsData.financialHealth.recommendations.slice(0, 3).map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Monthly Trends Chart - Full Width, Larger */}
          <div className="dashboard-section">
            <MonthlyTrendsChart 
              months={selectedPeriod}
              height="400px"
              className="dashboard-chart"
            />
          </div>

          {/* Vertical Layout - Category & Budget Charts */}
          <div className="dashboard-section">
            <CategoryBreakdownChart 
              startDate={dateRange.start}
              endDate={dateRange.end}
              height="500px"
              className="dashboard-chart"
              minimal={false}
              showCustomization={false}
            />
          </div>
          
          <div className="dashboard-section">
            <BudgetVsActualChart 
              month={budgetMonth}
              year={budgetYear}
              height="500px"
              className="dashboard-chart"
            />
          </div>

          {/* Savings Progress Chart - Full Width */}
          <div className="dashboard-section">
            <SavingsProgressChart 
              height="400px"
              className="dashboard-chart"
            />
          </div>

          {/* Demo Data Notice - Simple */}
          <div className="dashboard-section">
            <div className="demo-notice-content">
              <div className="notice-icon">ℹ️</div>
              <div className="notice-text">
                <h4>Demo Mode Active</h4>
                <p>You're currently viewing sample analytics data. Connect your financial accounts or add more transactions to see personalized insights.</p>
              </div>
              <button 
                className="connect-btn"
                onClick={() => navigate('/transactions')}
              >
                Add Transactions
              </button>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AnalyticsDashboard;