import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../Common/Card';
import { Button } from '../Common/Button';
import './RetirementCalculator.css';

const RetirementCalculator = () => {
  const [retirementPlan, setRetirementPlan] = useState(null);
  const [calculation, setCalculation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRetirementPlan();
  }, []);

  const fetchRetirementPlan = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/retirement/plan', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const planData = await response.json();
        setRetirementPlan(planData);
        await calculateRetirement(planData);
      }
    } catch (error) {
      console.error('Error fetching retirement plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRetirement = async (plan = retirementPlan) => {
    if (!plan) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/retirement/calculate', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const calculationData = await response.json();
        setCalculation(calculationData);
      }
    } catch (error) {
      console.error('Error calculating retirement:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (rate) => {
    return `${(rate * 100).toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="retirement-calculator">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading retirement calculation...</p>
        </div>
      </div>
    );
  }

  if (!retirementPlan) {
    return (
      <div className="retirement-calculator">
        <div className="no-plan">
          <h3>No Retirement Plan Found</h3>
          <p>Create a retirement plan to see your projections and optimization opportunities.</p>
          <Button onClick={() => window.location.href = '/retirement'}>
            Create Retirement Plan
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="retirement-calculator">
      <div className="calculator-header">
        <h3>Retirement Planning Calculator</h3>
        <p>Interactive scenario modeling and projections</p>
      </div>

      {/* Current Plan Summary */}
      <Card className="plan-summary-card">
        <CardHeader>
          <CardTitle>Current Retirement Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="plan-summary-grid">
            <div className="summary-item">
              <span className="label">Current Age</span>
              <span className="value">{retirementPlan.currentAge}</span>
            </div>
            <div className="summary-item">
              <span className="label">Retirement Age</span>
              <span className="value">{retirementPlan.retirementAge}</span>
            </div>
            <div className="summary-item">
              <span className="label">Years to Retirement</span>
              <span className="value">{retirementPlan.retirementAge - retirementPlan.currentAge}</span>
            </div>
            <div className="summary-item">
              <span className="label">Annual Income</span>
              <span className="value">{formatCurrency(retirementPlan.currentAnnualIncome)}</span>
            </div>
            <div className="summary-item">
              <span className="label">Current 401(k) Balance</span>
              <span className="value">{formatCurrency(retirementPlan.current401kBalance)}</span>
            </div>
            <div className="summary-item">
              <span className="label">Current IRA Balance</span>
              <span className="value">{formatCurrency(retirementPlan.currentIraBalance)}</span>
            </div>
            <div className="summary-item">
              <span className="label">Monthly 401(k) Contribution</span>
              <span className="value">{formatCurrency(retirementPlan.monthly401kContribution)}</span>
            </div>
            <div className="summary-item">
              <span className="label">Monthly IRA Contribution</span>
              <span className="value">{formatCurrency(retirementPlan.monthlyIraContribution)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {calculation && (
        <>
          {/* Retirement Readiness */}
          <Card className={`readiness-card ${calculation.retirementReadiness.toLowerCase().replace('_', '-')}`}>
            <CardHeader>
              <CardTitle>Retirement Readiness Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="readiness-content">
                <div className="readiness-status">
                  <span className="status-icon">
                    {calculation.retirementReadiness === 'ON_TRACK' ? '✅' : 
                     calculation.retirementReadiness === 'NEEDS_IMPROVEMENT' ? '⚠️' : '❌'}
                  </span>
                  <span className="status-text">
                    {calculation.retirementReadiness.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="readiness-metrics">
                  <div className="metric">
                    <span className="metric-label">Projected Balance at Retirement</span>
                    <span className="metric-value">{formatCurrency(calculation.projectedRetirementBalance)}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Monthly Retirement Income</span>
                    <span className="metric-value">{formatCurrency(calculation.monthlyRetirementIncome)}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Required Monthly Income</span>
                    <span className="metric-value">{formatCurrency(calculation.requiredMonthlyIncome)}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Income Replacement Ratio</span>
                    <span className="metric-value">{formatPercentage(calculation.replacementRatio)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Retirement Breakdown */}
          <Card className="breakdown-card">
            <CardHeader>
              <CardTitle>Retirement Balance Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="breakdown-grid">
                <div className="breakdown-item">
                  <span className="breakdown-label">401(k) Balance</span>
                  <span className="breakdown-value">{formatCurrency(calculation.breakdown.total401kBalance)}</span>
                  <div className="breakdown-bar">
                    <div 
                      className="breakdown-fill breakdown-401k"
                      style={{ 
                        width: `${(calculation.breakdown.total401kBalance / calculation.projectedRetirementBalance) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="breakdown-item">
                  <span className="breakdown-label">IRA Balance</span>
                  <span className="breakdown-value">{formatCurrency(calculation.breakdown.totalIraBalance)}</span>
                  <div className="breakdown-bar">
                    <div 
                      className="breakdown-fill breakdown-ira"
                      style={{ 
                        width: `${(calculation.breakdown.totalIraBalance / calculation.projectedRetirementBalance) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="breakdown-item">
                  <span className="breakdown-label">Other Savings</span>
                  <span className="breakdown-value">{formatCurrency(calculation.breakdown.totalOtherSavings)}</span>
                  <div className="breakdown-bar">
                    <div 
                      className="breakdown-fill breakdown-other"
                      style={{ 
                        width: `${(calculation.breakdown.totalOtherSavings / calculation.projectedRetirementBalance) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="breakdown-item total">
                  <span className="breakdown-label">Total Projected Balance</span>
                  <span className="breakdown-value">{formatCurrency(calculation.projectedRetirementBalance)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Yearly Projections Chart */}
          {calculation.yearlyProjections && calculation.yearlyProjections.length > 0 && (
            <Card className="projections-card">
              <CardHeader>
                <CardTitle>Retirement Savings Projection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="projections-chart">
                  <div className="chart-container">
                    {calculation.yearlyProjections.slice(0, 10).map((projection, index) => {
                      const maxBalance = Math.max(...calculation.yearlyProjections.map(p => p.totalBalance));
                      const height = (projection.totalBalance / maxBalance) * 100;
                      
                      return (
                        <div key={projection.year} className="chart-bar">
                          <div 
                            className="bar-fill"
                            style={{ height: `${height}%` }}
                            title={`Year ${projection.year}: ${formatCurrency(projection.totalBalance)}`}
                          ></div>
                          <span className="bar-label">{projection.year}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="projections-table">
                    <div className="table-header">
                      <span>Year</span>
                      <span>Age</span>
                      <span>401(k) Balance</span>
                      <span>IRA Balance</span>
                      <span>Total Balance</span>
                    </div>
                    {calculation.yearlyProjections.slice(0, 5).map(projection => (
                      <div key={projection.year} className="table-row">
                        <span>{projection.year}</span>
                        <span>{retirementPlan.currentAge + (projection.year - new Date().getFullYear())}</span>
                        <span>{formatCurrency(projection.balance401k)}</span>
                        <span>{formatCurrency(projection.balanceIra)}</span>
                        <span>{formatCurrency(projection.totalBalance)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Items */}
          <Card className="action-items-card">
            <CardHeader>
              <CardTitle>Recommended Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="action-items">
                {calculation.retirementReadiness !== 'ON_TRACK' && (
                  <div className="action-item priority-high">
                    <span className="action-icon">🎯</span>
                    <div className="action-content">
                      <h4>Increase Retirement Contributions</h4>
                      <p>Consider increasing your monthly contributions to reach your retirement goals.</p>
                    </div>
                  </div>
                )}
                
                <div className="action-item priority-medium">
                  <span className="action-icon">📊</span>
                  <div className="action-content">
                    <h4>Review Investment Allocation</h4>
                    <p>Ensure your portfolio is properly diversified for your age and risk tolerance.</p>
                  </div>
                </div>
                
                <div className="action-item priority-medium">
                  <span className="action-icon">💰</span>
                  <div className="action-content">
                    <h4>Maximize Employer Match</h4>
                    <p>Make sure you're contributing enough to get the full employer 401(k) match.</p>
                  </div>
                </div>
                
                <div className="action-item priority-low">
                  <span className="action-icon">📅</span>
                  <div className="action-content">
                    <h4>Annual Plan Review</h4>
                    <p>Review and update your retirement plan annually or when life circumstances change.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Quick Actions */}
      <Card className="quick-actions-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="quick-actions">
            <Button onClick={() => window.location.href = '/retirement'}>
              Update Retirement Plan
            </Button>
            <Button onClick={fetchRetirementPlan} variant="outline">
              Refresh Calculation
            </Button>
            <Button onClick={() => window.location.href = '/investments'} variant="outline">
              View Investments
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RetirementCalculator;