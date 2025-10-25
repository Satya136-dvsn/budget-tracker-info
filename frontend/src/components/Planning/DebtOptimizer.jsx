import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../Common/Card';
import { Button } from '../Common/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Common/Tabs';
import './DebtOptimizer.css';

const DebtOptimizer = () => {
  const [debts, setDebts] = useState([]);
  const [strategies, setStrategies] = useState(null);
  const [consolidationAnalysis, setConsolidationAnalysis] = useState(null);
  const [paymentComparison, setPaymentComparison] = useState(null);
  const [extraPayment, setExtraPayment] = useState(100);
  const [consolidationRate, setConsolidationRate] = useState(5.0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('strategies');

  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/debts/active', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const debtData = await response.json();
        setDebts(debtData);
        
        if (debtData.length > 0) {
          await analyzeStrategies(extraPayment);
        }
      }
    } catch (error) {
      console.error('Error fetching debts:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeStrategies = async (payment = extraPayment) => {
    if (debts.length === 0) return;

    try {
      const token = localStorage.getItem('token');
      
      // Compare debt strategies
      const strategiesResponse = await fetch('/api/debt-optimization/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ extraPaymentAmount: payment })
      });

      if (strategiesResponse.ok) {
        const strategiesData = await strategiesResponse.json();
        setStrategies(strategiesData);
      }

      // Analyze consolidation
      const consolidationResponse = await fetch(`/api/debt-optimization/consolidation?consolidationRate=${consolidationRate / 100}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (consolidationResponse.ok) {
        const consolidationData = await consolidationResponse.json();
        setConsolidationAnalysis(consolidationData);
      }

      // Compare payment strategies
      const paymentResponse = await fetch(`/api/debt-optimization/payment-comparison?extraPayment=${payment}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (paymentResponse.ok) {
        const paymentData = await paymentResponse.json();
        setPaymentComparison(paymentData);
      }
    } catch (error) {
      console.error('Error analyzing strategies:', error);
    }
  };

  const handleExtraPaymentChange = (value) => {
    setExtraPayment(value);
    if (debts.length > 0) {
      analyzeStrategies(value);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatMonths = (months) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) return `${months} months`;
    if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`;
    return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="debt-optimizer">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Analyzing your debt optimization strategies...</p>
        </div>
      </div>
    );
  }

  if (debts.length === 0) {
    return (
      <div className="debt-optimizer">
        <div className="no-debts">
          <h2>🎉 Congratulations! You're debt-free!</h2>
          <p>You don't have any active debts to optimize. Keep up the great work!</p>
          <Button onClick={() => window.location.href = '/debts'}>
            Manage Debts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="debt-optimizer">
      <div className="optimizer-header">
        <h2>Debt Optimization Strategies</h2>
        <p>Compare different approaches to pay off your debts faster and save money</p>
      </div>

      {/* Extra Payment Input */}
      <Card className="payment-input-card">
        <CardHeader>
          <CardTitle>Extra Payment Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="payment-input">
            <label htmlFor="extraPayment">How much extra can you pay monthly?</label>
            <div className="input-group">
              <span className="input-prefix">$</span>
              <input
                id="extraPayment"
                type="number"
                value={extraPayment}
                onChange={(e) => handleExtraPaymentChange(Number(e.target.value))}
                min="0"
                step="25"
                className="payment-amount-input"
              />
            </div>
            <div className="payment-suggestions">
              {[50, 100, 200, 500].map(amount => (
                <Button
                  key={amount}
                  onClick={() => handleExtraPaymentChange(amount)}
                  className={`suggestion-btn ${extraPayment === amount ? 'active' : ''}`}
                  variant="outline"
                >
                  ${amount}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="optimizer-tabs">
          <TabsTrigger value="strategies">Strategy Comparison</TabsTrigger>
          <TabsTrigger value="consolidation">Consolidation Analysis</TabsTrigger>
          <TabsTrigger value="payment-impact">Payment Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="strategies">
          {strategies && (
            <div className="strategies-comparison">
              {/* Recommendation */}
              <Card className="recommendation-card">
                <CardHeader>
                  <CardTitle>💡 Recommended Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="recommendation">
                    <h3>{strategies.recommendedStrategy === 'AVALANCHE' ? 'Debt Avalanche' : 'Debt Snowball'}</h3>
                    <p>{strategies.recommendationReason}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Strategy Comparison */}
              <div className="strategy-cards">
                <Card className={`strategy-card ${strategies.recommendedStrategy === 'AVALANCHE' ? 'recommended' : ''}`}>
                  <CardHeader>
                    <CardTitle>
                      🏔️ Debt Avalanche
                      {strategies.recommendedStrategy === 'AVALANCHE' && <span className="recommended-badge">Recommended</span>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="strategy-stats">
                      <div className="stat">
                        <span className="stat-label">Total Interest</span>
                        <span className="stat-value">{formatCurrency(strategies.avalancheStrategy.totalInterestPaid)}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Payoff Time</span>
                        <span className="stat-value">{formatMonths(strategies.avalancheStrategy.payoffTimeMonths)}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Strategy</span>
                        <span className="stat-description">Pay highest interest rate first</span>
                      </div>
                    </div>
                    
                    <div className="payoff-plan">
                      <h4>Payoff Order:</h4>
                      <div className="debt-list">
                        {strategies.avalancheStrategy.payoffPlan.map((debt, index) => (
                          <div key={debt.debtId} className="debt-item">
                            <span className="debt-order">{debt.payoffOrder}</span>
                            <div className="debt-info">
                              <span className="debt-name">{debt.debtName}</span>
                              <span className="debt-details">
                                {formatCurrency(debt.currentBalance)} at {(debt.interestRate * 100).toFixed(2)}%
                              </span>
                            </div>
                            <span className="debt-payment">{formatCurrency(debt.recommendedPayment)}/mo</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`strategy-card ${strategies.recommendedStrategy === 'SNOWBALL' ? 'recommended' : ''}`}>
                  <CardHeader>
                    <CardTitle>
                      ⛄ Debt Snowball
                      {strategies.recommendedStrategy === 'SNOWBALL' && <span className="recommended-badge">Recommended</span>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="strategy-stats">
                      <div className="stat">
                        <span className="stat-label">Total Interest</span>
                        <span className="stat-value">{formatCurrency(strategies.snowballStrategy.totalInterestPaid)}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Payoff Time</span>
                        <span className="stat-value">{formatMonths(strategies.snowballStrategy.payoffTimeMonths)}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Strategy</span>
                        <span className="stat-description">Pay smallest balance first</span>
                      </div>
                    </div>
                    
                    <div className="payoff-plan">
                      <h4>Payoff Order:</h4>
                      <div className="debt-list">
                        {strategies.snowballStrategy.payoffPlan.map((debt, index) => (
                          <div key={debt.debtId} className="debt-item">
                            <span className="debt-order">{debt.payoffOrder}</span>
                            <div className="debt-info">
                              <span className="debt-name">{debt.debtName}</span>
                              <span className="debt-details">
                                {formatCurrency(debt.currentBalance)} at {(debt.interestRate * 100).toFixed(2)}%
                              </span>
                            </div>
                            <span className="debt-payment">{formatCurrency(debt.recommendedPayment)}/mo</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Savings Comparison */}
              <Card className="savings-comparison">
                <CardHeader>
                  <CardTitle>💰 Potential Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="savings-stats">
                    <div className="savings-item">
                      <span>Interest Savings (Avalanche vs Snowball)</span>
                      <span className="savings-amount">
                        {formatCurrency(strategies.snowballStrategy.totalInterestPaid - strategies.avalancheStrategy.totalInterestPaid)}
                      </span>
                    </div>
                    <div className="savings-item">
                      <span>Time Savings (Avalanche vs Snowball)</span>
                      <span className="savings-amount">
                        {formatMonths(strategies.snowballStrategy.payoffTimeMonths - strategies.avalancheStrategy.payoffTimeMonths)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="consolidation">
          {consolidationAnalysis && (
            <div className="consolidation-analysis">
              <Card className="consolidation-input">
                <CardHeader>
                  <CardTitle>Consolidation Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rate-input">
                    <label htmlFor="consolidationRate">What interest rate can you get for consolidation?</label>
                    <div className="input-group">
                      <input
                        id="consolidationRate"
                        type="number"
                        value={consolidationRate}
                        onChange={(e) => setConsolidationRate(Number(e.target.value))}
                        min="0"
                        max="30"
                        step="0.1"
                        className="rate-input-field"
                      />
                      <span className="input-suffix">%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`consolidation-result ${consolidationAnalysis.isConsolidationBeneficial ? 'beneficial' : 'not-beneficial'}`}>
                <CardHeader>
                  <CardTitle>
                    {consolidationAnalysis.isConsolidationBeneficial ? '✅ Consolidation Recommended' : '❌ Consolidation Not Recommended'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="consolidation-comparison">
                    <div className="current-situation">
                      <h4>Current Situation</h4>
                      <div className="situation-stats">
                        <div className="stat">
                          <span>Total Debt</span>
                          <span>{formatCurrency(consolidationAnalysis.totalCurrentDebt)}</span>
                        </div>
                        <div className="stat">
                          <span>Monthly Payments</span>
                          <span>{formatCurrency(consolidationAnalysis.totalCurrentMinimumPayments)}</span>
                        </div>
                        <div className="stat">
                          <span>Total Interest</span>
                          <span>{formatCurrency(consolidationAnalysis.totalCurrentInterestPaid)}</span>
                        </div>
                        <div className="stat">
                          <span>Payoff Time</span>
                          <span>{formatMonths(consolidationAnalysis.currentPayoffTimeMonths)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="consolidated-situation">
                      <h4>After Consolidation</h4>
                      <div className="situation-stats">
                        <div className="stat">
                          <span>Loan Amount</span>
                          <span>{formatCurrency(consolidationAnalysis.consolidatedLoanAmount)}</span>
                        </div>
                        <div className="stat">
                          <span>Interest Rate</span>
                          <span>{(consolidationAnalysis.consolidatedInterestRate * 100).toFixed(2)}%</span>
                        </div>
                        <div className="stat">
                          <span>Total Interest</span>
                          <span>{formatCurrency(consolidationAnalysis.consolidatedTotalInterest)}</span>
                        </div>
                        <div className="stat">
                          <span>Payoff Time</span>
                          <span>{formatMonths(consolidationAnalysis.consolidatedPayoffTimeMonths)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="consolidation-savings">
                    <div className="savings-summary">
                      <div className="savings-item">
                        <span>Interest Savings</span>
                        <span className={consolidationAnalysis.totalInterestSavings > 0 ? 'positive' : 'negative'}>
                          {formatCurrency(consolidationAnalysis.totalInterestSavings)}
                        </span>
                      </div>
                      <div className="savings-item">
                        <span>Time Savings</span>
                        <span className={consolidationAnalysis.timeSavingsMonths > 0 ? 'positive' : 'negative'}>
                          {consolidationAnalysis.timeSavingsMonths > 0 ? 
                            formatMonths(consolidationAnalysis.timeSavingsMonths) : 
                            `+${formatMonths(Math.abs(consolidationAnalysis.timeSavingsMonths))}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="recommendation-text">
                    <p>{consolidationAnalysis.recommendation}</p>
                  </div>

                  {consolidationAnalysis.benefits && consolidationAnalysis.benefits.length > 0 && (
                    <div className="benefits-considerations">
                      <div className="benefits">
                        <h5>Benefits:</h5>
                        <ul>
                          {consolidationAnalysis.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {consolidationAnalysis.considerations && consolidationAnalysis.considerations.length > 0 && (
                    <div className="considerations">
                      <h5>Considerations:</h5>
                      <ul>
                        {consolidationAnalysis.considerations.map((consideration, index) => (
                          <li key={index}>{consideration}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="payment-impact">
          {paymentComparison && (
            <div className="payment-impact">
              <Card className="payment-comparison">
                <CardHeader>
                  <CardTitle>💪 Impact of Extra Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="comparison-grid">
                    <div className="scenario">
                      <h4>Minimum Payments Only</h4>
                      <div className="scenario-stats">
                        <div className="stat">
                          <span>Monthly Payment</span>
                          <span>{formatCurrency(paymentComparison.minimumPaymentScenario.monthlyPayment)}</span>
                        </div>
                        <div className="stat">
                          <span>Payoff Time</span>
                          <span>{formatMonths(paymentComparison.minimumPaymentScenario.payoffTimeMonths)}</span>
                        </div>
                        <div className="stat">
                          <span>Total Interest</span>
                          <span>{formatCurrency(paymentComparison.minimumPaymentScenario.totalInterestPaid)}</span>
                        </div>
                        <div className="stat">
                          <span>Total Amount Paid</span>
                          <span>{formatCurrency(paymentComparison.minimumPaymentScenario.totalAmountPaid)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="scenario accelerated">
                      <h4>With ${extraPayment} Extra Monthly</h4>
                      <div className="scenario-stats">
                        <div className="stat">
                          <span>Monthly Payment</span>
                          <span>{formatCurrency(paymentComparison.acceleratedPaymentScenario.monthlyPayment)}</span>
                        </div>
                        <div className="stat">
                          <span>Payoff Time</span>
                          <span>{formatMonths(paymentComparison.acceleratedPaymentScenario.payoffTimeMonths)}</span>
                        </div>
                        <div className="stat">
                          <span>Total Interest</span>
                          <span>{formatCurrency(paymentComparison.acceleratedPaymentScenario.totalInterestPaid)}</span>
                        </div>
                        <div className="stat">
                          <span>Total Amount Paid</span>
                          <span>{formatCurrency(paymentComparison.acceleratedPaymentScenario.totalAmountPaid)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="savings-summary">
                    <h4>Your Savings with Extra Payments</h4>
                    <div className="savings-grid">
                      <div className="savings-item">
                        <span className="savings-label">Interest Savings</span>
                        <span className="savings-value positive">{formatCurrency(paymentComparison.savings.interestSavings)}</span>
                      </div>
                      <div className="savings-item">
                        <span className="savings-label">Time Savings</span>
                        <span className="savings-value positive">{formatMonths(paymentComparison.savings.timeSavingsMonths)}</span>
                      </div>
                      <div className="savings-item">
                        <span className="savings-label">Total Savings</span>
                        <span className="savings-value positive">{formatCurrency(paymentComparison.savings.totalSavings)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="recommendation">
                    <p>{paymentComparison.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DebtOptimizer;