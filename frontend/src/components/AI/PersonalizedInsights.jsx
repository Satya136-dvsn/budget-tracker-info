import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../Common/Card';
import { Button } from '../Common/Button';
import './PersonalizedInsights.css';

const PersonalizedInsights = ({ userId }) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, [userId]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      // Mock insights data
      const mockInsights = [
        {
          id: 1,
          type: 'spending_pattern',
          title: 'Dining Out Trend',
          description: 'You\'ve spent 23% more on dining out this month compared to last month. Consider cooking at home more often to save money.',
          impact: 'high',
          savings: 150,
          confidence: 0.85
        },
        {
          id: 2,
          type: 'budget_optimization',
          title: 'Entertainment Budget',
          description: 'Your entertainment spending is consistently under budget. You could reallocate $50 to your savings goal.',
          impact: 'medium',
          savings: 50,
          confidence: 0.92
        },
        {
          id: 3,
          type: 'savings_opportunity',
          title: 'Subscription Review',
          description: 'You have 3 unused subscriptions totaling $45/month. Consider canceling services you don\'t use.',
          impact: 'medium',
          savings: 45,
          confidence: 0.78
        },
        {
          id: 4,
          type: 'goal_progress',
          title: 'Emergency Fund Goal',
          description: 'Great progress! You\'re 67% towards your emergency fund goal. Keep up the consistent saving.',
          impact: 'positive',
          savings: 0,
          confidence: 0.95
        }
      ];

      setInsights(mockInsights);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'positive': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'high': return '⚠️';
      case 'medium': return '💡';
      case 'positive': return '✅';
      default: return 'ℹ️';
    }
  };

  if (loading) {
    return (
      <div className="personalized-insights">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Analyzing your financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="personalized-insights">
      <div className="insights-header">
        <h2>🧠 Personalized Insights</h2>
        <p>AI-powered recommendations based on your spending patterns</p>
        <Button onClick={fetchInsights} className="refresh-btn">
          🔄 Refresh Insights
        </Button>
      </div>

      <div className="insights-grid">
        {insights.map((insight) => (
          <Card key={insight.id} className="insight-card">
            <CardHeader>
              <CardTitle className="insight-title">
                <span className="insight-icon">{getImpactIcon(insight.impact)}</span>
                {insight.title}
              </CardTitle>
              <div className="insight-meta">
                <span 
                  className="impact-badge"
                  style={{ backgroundColor: getImpactColor(insight.impact) }}
                >
                  {insight.impact}
                </span>
                <span className="confidence">
                  {Math.round(insight.confidence * 100)}% confidence
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="insight-description">{insight.description}</p>
              {insight.savings > 0 && (
                <div className="savings-potential">
                  <span className="savings-label">Potential Monthly Savings:</span>
                  <span className="savings-amount">${insight.savings}</span>
                </div>
              )}
              <div className="insight-actions">
                <Button className="action-btn primary">Apply Suggestion</Button>
                <Button className="action-btn secondary">Learn More</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="insights-summary">
        <Card>
          <CardHeader>
            <CardTitle>💰 Total Savings Potential</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-value">
                  ${insights.reduce((sum, insight) => sum + insight.savings, 0)}
                </span>
                <span className="stat-label">Monthly Savings</span>
              </div>
              <div className="stat">
                <span className="stat-value">
                  ${insights.reduce((sum, insight) => sum + insight.savings, 0) * 12}
                </span>
                <span className="stat-label">Annual Savings</span>
              </div>
              <div className="stat">
                <span className="stat-value">{insights.length}</span>
                <span className="stat-label">Active Insights</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonalizedInsights;