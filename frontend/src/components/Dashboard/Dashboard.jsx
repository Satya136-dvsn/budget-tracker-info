import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../hooks/useAlert';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

const Dashboard = () => {
  const { user, loadUserProfile } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [goalForm, setGoalForm] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    deadline: ''
  });

  useEffect(() => {
    if (!user) {
      loadUserProfile();
    }
  }, [user, loadUserProfile]);

  // Load categories and recent transactions when user is available
  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [expenseCategories, transactions] = await Promise.all([
        apiService.getExpenseCategories(),
        apiService.getUserTransactions()
      ]);
      
      setCategories(expenseCategories || []);
      // Get the 5 most recent transactions
      const sortedTransactions = transactions.sort((a, b) => 
        new Date(b.transactionDate) - new Date(a.transactionDate)
      );
      setRecentTransactions(sortedTransactions.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Don't show error alert, just log it
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!expenseForm.amount || !expenseForm.category || !expenseForm.description) {
      showAlert('Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const transactionData = {
        title: expenseForm.description,
        description: expenseForm.description,
        amount: parseFloat(expenseForm.amount),
        type: 'EXPENSE',
        category: expenseForm.category,
        transactionDate: new Date(expenseForm.date).toISOString()
      };

      await apiService.createTransaction(transactionData);
      showAlert('Expense added successfully!', 'success');
      
      // Reset form and close modal
      setShowExpenseModal(false);
      setExpenseForm({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });

      // Reload dashboard data to show the new transaction
      loadDashboardData();
      // Reload user profile to update financial stats
      loadUserProfile();
    } catch (err) {
      console.error('Error adding expense:', err);
      showAlert(`Failed to add expense: ${err.message || 'Unknown error'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSetGoal = async (e) => {
    e.preventDefault();
    try {
      // API call would go here
      showAlert('Goal set successfully!', 'success');
      setShowGoalModal(false);
      setGoalForm({
        title: '',
        targetAmount: '',
        currentAmount: '',
        deadline: ''
      });
    } catch (err) {
      console.error('Error setting goal:', err);
      showAlert('Failed to set goal', 'error');
    }
  };

  const handleExpenseInputChange = (e) => {
    setExpenseForm({
      ...expenseForm,
      [e.target.name]: e.target.value
    });
  };

  const handleGoalInputChange = (e) => {
    setGoalForm({
      ...goalForm,
      [e.target.name]: e.target.value
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  if (!user) {
    return (
      <section className="dashboard-container">
        <div className="dashboard-content">
          <div className="loading-state">
            <div className="spinner"></div>
            <h2>Loading your dashboard...</h2>
          </div>
        </div>
      </section>
    );
  }

  const savingsRate = user.monthlyIncome ? ((user.currentSavings / user.monthlyIncome) * 100).toFixed(1) : 0;
  const expenseRatio = user.monthlyIncome ? ((user.targetExpenses / user.monthlyIncome) * 100).toFixed(1) : 0;
  
  // Enhanced Financial Health Calculations
  const debtToIncomeRatio = user.monthlyIncome ? ((user.monthlyDebt || 0) / user.monthlyIncome * 100).toFixed(1) : 0;
  const emergencyFundMonths = user.monthlyIncome ? (user.currentSavings / user.monthlyIncome).toFixed(1) : 0;
  const netWorthGrowth = 5.2; // Sample data - should come from API
  const creditUtilization = 25; // Sample data - should come from API
  
  // Enhanced Financial Health Score (0-100) with more factors
  const calculateHealthScore = () => {
    let score = 0;
    
    // Savings rate (25% weight)
    if (savingsRate >= 20) score += 25;
    else if (savingsRate >= 15) score += 20;
    else if (savingsRate >= 10) score += 15;
    else if (savingsRate >= 5) score += 10;
    else score += 5;
    
    // Expense ratio (20% weight)
    if (expenseRatio <= 50) score += 20;
    else if (expenseRatio <= 70) score += 16;
    else if (expenseRatio <= 85) score += 12;
    else score += 6;
    
    // Emergency fund (20% weight)
    if (emergencyFundMonths >= 6) score += 20;
    else if (emergencyFundMonths >= 3) score += 16;
    else if (emergencyFundMonths >= 1) score += 12;
    else score += 6;
    
    // Debt-to-income ratio (15% weight)
    if (debtToIncomeRatio <= 10) score += 15;
    else if (debtToIncomeRatio <= 20) score += 12;
    else if (debtToIncomeRatio <= 36) score += 8;
    else score += 4;
    
    // Net worth growth (10% weight)
    if (netWorthGrowth >= 10) score += 10;
    else if (netWorthGrowth >= 5) score += 8;
    else if (netWorthGrowth >= 0) score += 6;
    else score += 2;
    
    // Credit utilization (10% weight)
    if (creditUtilization <= 10) score += 10;
    else if (creditUtilization <= 30) score += 8;
    else if (creditUtilization <= 50) score += 6;
    else score += 3;
    
    return Math.min(score, 100);
  };
  
  const healthScore = calculateHealthScore();
  const getHealthStatus = () => {
    if (healthScore >= 80) return { status: 'Excellent', color: '#22c55e', icon: 'fas fa-check-circle' };
    if (healthScore >= 60) return { status: 'Good', color: '#3b82f6', icon: 'fas fa-thumbs-up' };
    if (healthScore >= 40) return { status: 'Fair', color: '#f59e0b', icon: 'fas fa-exclamation-triangle' };
    return { status: 'Needs Improvement', color: '#ef4444', icon: 'fas fa-exclamation-circle' };
  };
  
  const healthStatus = getHealthStatus();

  return (
    <section className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, {user.username || 'User'}!</h1>
            <p>Here's your complete financial overview</p>
          </div>
        </div>
        
        <div className="dashboard-stats">
          <div className="stat-card primary">
            <div className="stat-icon">
              <span className="emoji-icon">💵</span>
            </div>
            <div className="stat-content">
              <h3>Monthly Income</h3>
              <span className="stat-amount">{formatCurrency(user.monthlyIncome)}</span>
              <span className="stat-label">Total Income</span>
            </div>
          </div>
          
          <div className="stat-card warning">
            <div className="stat-icon">
              <span className="emoji-icon">🛒</span>
            </div>
            <div className="stat-content">
              <h3>Target Expenses</h3>
              <span className="stat-amount">{formatCurrency(user.targetExpenses)}</span>
              <span className="stat-label">{expenseRatio}% of income</span>
            </div>
          </div>
          
          <div className="stat-card success">
            <div className="stat-icon">
              <span className="emoji-icon">🏦</span>
            </div>
            <div className="stat-content">
              <h3>Current Savings</h3>
              <span className="stat-amount">{formatCurrency(user.currentSavings)}</span>
              <span className="stat-label">{savingsRate}% savings rate</span>
            </div>
          </div>
        </div>

        {/* Quick Actions and View Trends Row */}
        <div className="dashboard-actions">
          <div className="insight-card">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button className="action-btn" onClick={() => setShowExpenseModal(true)}>
                <i className="fas fa-plus"></i>
                Add Expense
              </button>
              <button className="action-btn" onClick={() => setShowGoalModal(true)}>
                <i className="fas fa-target"></i>
                Set Goal
              </button>
              <button className="action-btn" onClick={() => navigate('/reports')}>
                <i className="fas fa-chart-bar"></i>
                View Reports
              </button>
            </div>
          </div>

          <div className="insight-card">
            <h3>View Trends</h3>
            <div className="trends-preview">
              <div 
                className="trend-item" 
                onClick={() => navigate('/trends/monthly-spending')}
                style={{
                  background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                  border: '1px solid #d8b4fe'
                }}
              >
                <div className="trend-icon">
                  <span className="emoji-icon">📈</span>
                </div>
                <div className="trend-info">
                  <h4 style={{ color: '#6b21a8' }}>Monthly Spending</h4>
                  <p style={{ color: '#7c3aed' }}>Track your spending patterns over time</p>
                </div>
              </div>
              <div 
                className="trend-item" 
                onClick={() => navigate('/trends/category-analysis')}
                style={{
                  background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                  border: '1px solid #d8b4fe'
                }}
              >
                <div className="trend-icon">
                  <span className="emoji-icon">🥧</span>
                </div>
                <div className="trend-info">
                  <h4 style={{ color: '#6b21a8' }}>Category Analysis</h4>
                  <p style={{ color: '#7c3aed' }}>See where your money goes</p>
                </div>
              </div>
              <div 
                className="trend-item" 
                onClick={() => navigate('/trends/savings-growth')}
                style={{
                  background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                  border: '1px solid #d8b4fe'
                }}
              >
                <div className="trend-icon">
                  <span className="emoji-icon">📊</span>
                </div>
                <div className="trend-info">
                  <h4 style={{ color: '#6b21a8' }}>Savings Growth</h4>
                  <p style={{ color: '#7c3aed' }}>Monitor your savings progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Health Section */}
        <div className="dashboard-insights">
          <div className="insight-card financial-health-card">
            <h3>Financial Health Score</h3>
            <div className="health-score-container">
              <div className="score-circle">
                <div className="score-number" style={{ color: healthStatus.color }}>
                  {healthScore}
                </div>
                <div className="score-label">out of 100</div>
              </div>
              <div className="health-status">
                <i className={healthStatus.icon} style={{ color: healthStatus.color }}></i>
                <span style={{ color: healthStatus.color }}>{healthStatus.status}</span>
              </div>
            </div>
            
            <div className="health-breakdown">
              <div className="health-metric">
                <div className="metric-label">
                  <i className="fas fa-piggy-bank"></i>
                  Savings Rate
                </div>
                <div className="metric-value">{savingsRate}%</div>
                <div className="metric-bar">
                  <div className="metric-fill" style={{width: `${Math.min(savingsRate * 5, 100)}%`, backgroundColor: '#22c55e'}}></div>
                </div>
              </div>
              
              <div className="health-metric">
                <div className="metric-label">
                  <i className="fas fa-shield-alt"></i>
                  Emergency Fund
                </div>
                <div className="metric-value">{emergencyFundMonths} months</div>
                <div className="metric-bar">
                  <div className="metric-fill" style={{width: `${Math.min(emergencyFundMonths * 16.67, 100)}%`, backgroundColor: '#3b82f6'}}></div>
                </div>
              </div>
              
              <div className="health-metric">
                <div className="metric-label">
                  <i className="fas fa-chart-pie"></i>
                  Expense Ratio
                </div>
                <div className="metric-value">{expenseRatio}%</div>
                <div className="metric-bar">
                  <div className="metric-fill" style={{width: `${Math.min(expenseRatio, 100)}%`, backgroundColor: expenseRatio > 80 ? '#ef4444' : expenseRatio > 60 ? '#f59e0b' : '#22c55e'}}></div>
                </div>
              </div>
            </div>
            
            <div className="health-tips">
              <h4>💡 Improvement Tips:</h4>
              <ul>
                {savingsRate < 15 && <li>Try to save at least 15-20% of your income</li>}
                {emergencyFundMonths < 3 && <li>Build an emergency fund covering 3-6 months of expenses</li>}
                {expenseRatio > 70 && <li>Consider reducing non-essential expenses</li>}
                {debtToIncomeRatio > 20 && <li>Focus on paying down high-interest debt</li>}
              </ul>
            </div>
            
            <div className="health-action">
              <button 
                className="detailed-analysis-btn"
                onClick={() => navigate('/financial-health')}
              >
                📊 View Detailed Analysis
              </button>
            </div>
          </div>
        </div>

        {/* Recent Transactions Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Recent Transactions</h3>
            <button 
              className="view-all-btn"
              onClick={() => navigate('/transactions')}
            >
              View All
            </button>
          </div>
          <div className="transactions-list">
            {loading ? (
              <div className="loading-transactions">
                <div className="spinner-small"></div>
                <p>Loading transactions...</p>
              </div>
            ) : recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-icon">
                    <span className={transaction.type === 'EXPENSE' ? 'expense-icon' : 'income-icon'}>
                      {transaction.type === 'EXPENSE' ? '📤' : '📥'}
                    </span>
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-title">{transaction.title}</div>
                    <div className="transaction-meta">
                      <span className="transaction-category">{transaction.category}</span>
                      <span className="transaction-date">
                        {new Date(transaction.transactionDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className={`transaction-amount ${transaction.type.toLowerCase()}`}>
                    {transaction.type === 'EXPENSE' ? '-' : '+'}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-transactions">
                <span className="empty-icon">📊</span>
                <p>No transactions yet</p>
                <button 
                  className="add-first-transaction-btn"
                  onClick={() => setShowExpenseModal(true)}
                >
                  Add Your First Expense
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Add Expense Modal */}
        {showExpenseModal && (
          <div className="modal-overlay" onClick={() => setShowExpenseModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add New Expense</h3>
                <button className="close-btn" onClick={() => setShowExpenseModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleAddExpense} className="expense-form">
                <div className="form-group">
                  <label htmlFor="amount">Amount ($)</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={expenseForm.amount}
                    onChange={handleExpenseInputChange}
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={expenseForm.category}
                    onChange={handleExpenseInputChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Food & Dining">Food & Dining</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Bills & Utilities">Bills & Utilities</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Other">Other</option>
                      </>
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={expenseForm.description}
                    onChange={handleExpenseInputChange}
                    placeholder="What did you spend on?"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={expenseForm.date}
                    onChange={handleExpenseInputChange}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowExpenseModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Add Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Set Goal Modal */}
        {showGoalModal && (
          <div className="modal-overlay" onClick={() => setShowGoalModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Set New Goal</h3>
                <button className="close-btn" onClick={() => setShowGoalModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleSetGoal} className="goal-form">
                <div className="form-group">
                  <label htmlFor="title">Goal Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={goalForm.title}
                    onChange={handleGoalInputChange}
                    placeholder="e.g., Emergency Fund, Vacation, New Car"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="targetAmount">Target Amount ($)</label>
                  <input
                    type="number"
                    id="targetAmount"
                    name="targetAmount"
                    value={goalForm.targetAmount}
                    onChange={handleGoalInputChange}
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="currentAmount">Current Amount ($)</label>
                  <input
                    type="number"
                    id="currentAmount"
                    name="currentAmount"
                    value={goalForm.currentAmount}
                    onChange={handleGoalInputChange}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="deadline">Target Date</label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={goalForm.deadline}
                    onChange={handleGoalInputChange}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowGoalModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Set Goal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;