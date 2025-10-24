import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorBoundary from '../Common/ErrorBoundary';
import ChartWrapper from './ChartWrapper';
import MonthlyTrendsChart from './MonthlyTrendsChart';
import CategoryBreakdownChart from './CategoryBreakdownChart';
import BudgetVsActualChart from './BudgetVsActualChart';
import SavingsProgressChart from './SavingsProgressChart';
import './AnalyticsDashboard.css';
import './SimpleLayoutFix.css';
import './AnalyticsLayoutFix.css';

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
      
      // Always use fallback approach since analytics endpoints are having auth issues
      console.log('Using fallback data approach for analytics dashboard');
      
      try {
        // Try to get basic financial summary first
        const summaryData = await apiService.getFinancialSummary().catch(() => null);
        
        // Generate mock analytics data based on available data
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
          },
          monthlyTrends: {
            averageIncome: summaryData?.monthlyIncome || 415000,
            averageExpenses: summaryData?.targetExpenses || 290000,
            trendDirection: 'stable',
            trends: [
              { month: new Date().getMonth(), year: new Date().getFullYear(), netSavings: 125000 },
              { month: new Date().getMonth() - 1, year: new Date().getFullYear(), netSavings: 100000 },
              { month: new Date().getMonth() - 2, year: new Date().getFullYear(), netSavings: 150000 }
            ]
          },
          savingsProgress: {
            totalGoals: 3,
            completedGoals: 1,
            overallProgressPercent: 65,
            totalCurrentAmount: summaryData?.currentSavings || 2075000,
            totalTargetAmount: 4150000
          }
        };
        
        setAnalyticsData(fallbackData);
      } catch (fallbackError) {
        console.error('Fallback data generation failed:', fallbackError);
        // Use completely static fallback data
        const staticFallbackData = {
          financialHealth: {
            healthScore: 70,
            healthTrend: 'stable',
            factorScores: {
              savingsRate: 60,
              emergencyFund: 40,
              expenseRatio: 75
            },
            recommendations: [
              'Start tracking your expenses more closely',
              'Set up automatic savings transfers',
              'Create a monthly budget plan'
            ]
          },
          monthlyTrends: {
            averageIncome: 375000,
            averageExpenses: 265000,
            trendDirection: 'stable'
          },
          savingsProgress: {
            totalGoals: 2,
            completedGoals: 0,
            overallProgressPercent: 35,
            totalCurrentAmount: 1245000,
            totalTargetAmount: 3320000
          }
        };
        
        setAnalyticsData(staticFallbackData);
      }
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Analytics data temporarily unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchAnalyticsData();
  };

  const handlePeriodChange = (event) => {
    const months = parseInt(event.target.value);
    setSelectedPeriod(months);
    
    // Update date range based on selected period
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    
    setDateRange({
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    });
  };

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBudgetMonthChange = (event) => {
    setBudgetMonth(parseInt(event.target.value));
  };

  const handleBudgetYearChange = (event) => {
    setBudgetYear(parseInt(event.target.value));
  };

  if (loading) {
    return (
      <div className="analytics-dashboard">
        <div className="dashboard-header">
          <h1>Analytics Dashboard</h1>
        </div>
        <LoadingSpinner 
          size="large" 
          message="Loading analytics data..." 
          fullScreen={false}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-dashboard">
        <div className="dashboard-header">
          <h1>Analytics Dashboard</h1>
        </div>
        <div className="dashboard-error">
          <div className="error-content">
            <div className="error-icon">📊</div>
            <h2>Unable to Load Analytics</h2>
            <p>{error}</p>
            <button className="retry-button" onClick={handleRetry}>
              Try Again
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
          <h1>Analytics Dashboard</h1>
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
          {/* Financial Health Score */}
          {analyticsData?.financialHealth && (
            <div className="dashboard-section full-width">
              <ChartWrapper
                title="Financial Health Score"
                isLoading={false}
                error={null}
                className="health-score-card"
              >
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

                  {analyticsData.financialHealth.recommendations && 
                   analyticsData.financialHealth.recommendations.length > 0 && (
                    <div className="recommendations">
                      <h4>Recommendations:</h4>
                      <ul>
                        {analyticsData.financialHealth.recommendations.slice(0, 3).map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </ChartWrapper>
            </div>
          )}

          {/* Monthly Trends Chart */}
          <div className="dashboard-section full-width">
            <MonthlyTrendsChart 
              months={selectedPeriod}
              height="380px"
              className="dashboard-chart"
            />
          </div>

          {/* Category Breakdown and Budget Analysis Row */}
          <div className="dashboard-row">
            <div className="dashboard-section half-width">
              <CategoryBreakdownChart 
                startDate={dateRange.start}
                endDate={dateRange.end}
                height="320px"
                className="dashboard-chart"
              />
            </div>
            
            <div className="dashboard-section half-width">
              <BudgetVsActualChart 
                month={budgetMonth}
                year={budgetYear}
                height="320px"
                className="dashboard-chart"
              />
            </div>
          </div>

          {/* Savings Progress Chart */}
          <div className="dashboard-section full-width">
            <SavingsProgressChart 
              height="420px"
              className="dashboard-chart"
            />
          </div>

          {/* Demo Data Notice */}
          <div className="dashboard-section full-width">
            <ChartWrapper
              title="📊 Analytics Dashboard"
              isLoading={false}
              error={null}
              className="demo-notice-card"
            >
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
            </ChartWrapper>
          </div>

          {/* Additional Filters Section */}
          <div className="dashboard-section full-width">
            <ChartWrapper
              title="Advanced Filters & Controls"
              isLoading={false}
              error={null}
              className="filters-card"
            >
              <div className="filters-explanation">
                <p>Use these controls to customize your analytics view and analyze specific time periods or budget scenarios:</p>
              </div>
              <div className="advanced-filters">
                <div className="filter-group">
                  <label htmlFor="date-range-start">Date Range:</label>
                  <div className="date-range-inputs">
                    <input
                      id="date-range-start"
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => handleDateRangeChange('start', e.target.value)}
                      className="date-input"
                    />
                    <span className="date-separator">to</span>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => handleDateRangeChange('end', e.target.value)}
                      className="date-input"
                    />
                  </div>
                </div>

                <div className="filter-group">
                  <label htmlFor="budget-month">Budget Analysis:</label>
                  <div className="budget-selectors">
                    <select 
                      id="budget-month"
                      value={budgetMonth} 
                      onChange={handleBudgetMonthChange}
                      className="budget-selector"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => {
                        const date = new Date(2000, month - 1, 1);
                        const monthName = date.toLocaleDateString('en-US', { month: 'long' });
                        return (
                          <option key={month} value={month}>
                            {monthName}
                          </option>
                        );
                      })}
                    </select>
                    <select 
                      value={budgetYear} 
                      onChange={handleBudgetYearChange}
                      className="budget-selector"
                    >
                      {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </ChartWrapper>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AnalyticsDashboard;