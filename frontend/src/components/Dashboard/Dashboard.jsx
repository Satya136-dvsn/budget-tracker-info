import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../hooks/useAlert';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { calculateFinancialHealthScore, getHealthScoreStatus } from '../../utils/financialHealthCalculator';
// Using fallback hooks to prevent import errors
import { useDashboardRealTime, useTransactionRealTime, useNotificationRealTime } from '../../hooks/useRealTimeFallback';
import MonthlyTrendsChart from '../Analytics/MonthlyTrendsChart';
import CategoryBreakdownChart from '../Analytics/CategoryBreakdownChart';
import PureMonthlyChart from './PureMonthlyChart';
import PureCategoryChart from './PureCategoryChart';
import ErrorBoundary from '../Common/ErrorBoundary';
import './Dashboard.css';

const Dashboard = () => {
  const { user, loadUserProfile } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
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

  // Real-time dashboard updates (using fallback hooks for now)
  useDashboardRealTime((update) => {
    console.log('Dashboard real-time update:', update);
    if (update.type === 'DASHBOARD_REFRESH') {
      loadDashboardData();
    }
  });

  // Real-time transaction updates
  useTransactionRealTime((update) => {
    console.log('Transaction real-time update:', update);
    if (update.type === 'TRANSACTION_UPDATE') {
      loadDashboardData(); // Refresh dashboard data when transactions change
      showAlert('Transaction updated in real-time!', 'success');
    }
  });

  // Real-time notifications
  useNotificationRealTime((update) => {
    console.log('Notification real-time update:', update);
    if (update.type === 'NOTIFICATION') {
      const { title, message, priority } = update.data;
      showAlert(`${title}: ${message}`, priority === 'HIGH' ? 'error' : 'info');
    }
  });

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

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setExpenseForm({
      amount: transaction.amount.toString(),
      category: transaction.category,
      description: transaction.title,
      date: new Date(transaction.transactionDate).toISOString().split('T')[0]
    });
    setShowExpenseModal(true);
  };

  const handleUpdateTransaction = async (e) => {
    e.preventDefault();
    if (!editingTransaction) return;

    setLoading(true);
    try {
      const transactionData = {
        title: expenseForm.description,
        amount: parseFloat(expenseForm.amount),
        type: editingTransaction.type,
        category: expenseForm.category,
        transactionDate: new Date(expenseForm.date).toISOString()
      };

      await apiService.updateTransaction(editingTransaction.id, transactionData);
      showAlert('Transaction updated successfully!', 'success');
      
      // Reset form and close modal
      setShowExpenseModal(false);
      setEditingTransaction(null);
      setExpenseForm({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });

      // Reload dashboard data
      loadDashboardData();
      loadUserProfile();
    } catch (err) {
      console.error('Error updating transaction:', err);
      showAlert(`Failed to update transaction: ${err.message || 'Unknown error'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await apiService.deleteTransaction(transactionId);
      showAlert('Transaction deleted successfully!', 'success');
      
      // Reload dashboard data
      loadDashboardData();
      loadUserProfile();
    } catch (err) {
      console.error('Error deleting transaction:', err);
      showAlert(`Failed to delete transaction: ${err.message || 'Unknown error'}`, 'error');
    }
  };

  const handleSetGoal = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!goalForm.title || !goalForm.targetAmount) {
      showAlert('Please fill in goal title and target amount', 'error');
      return;
    }

    try {
      const goalData = {
        name: goalForm.title,
        description: `Goal created from dashboard quick action`,
        targetAmount: parseFloat(goalForm.targetAmount),
        targetDate: goalForm.deadline || null
      };

      await apiService.createSavingsGoal(goalData);
      showAlert('Goal created successfully!', 'success');
      
      setShowGoalModal(false);
      setGoalForm({
        title: '',
        targetAmount: '',
        currentAmount: '',
        deadline: ''
      });
    } catch (err) {
      console.error('Error setting goal:', err);
      showAlert(`Failed to create goal: ${err.message || 'Unknown error'}`, 'error');
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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
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
  const debtToIncomeRatio = user.monthlyIncome ? (((user.monthlyDebt || 0) / user.monthlyIncome) * 100).toFixed(1) : 0;
  const emergencyFundMonths = user.monthlyIncome ? ((user.currentSavings || 0) / (user.targetExpenses || user.monthlyIncome || 1)).toFixed(1) : 0;
  
  // Calculate financial health score using centralized calculator
  let healthAnalysis, healthScore, healthStatus;
  try {
    healthAnalysis = calculateFinancialHealthScore(user, recentTransactions);
    healthScore = healthAnalysis?.score || 0;
    healthStatus = getHealthScoreStatus(healthScore);
  } catch (error) {
    console.error('Error calculating health score:', error);
    healthAnalysis = { score: 0, factors: [], recommendations: [] };
    healthScore = 0;
    healthStatus = { status: 'Unknown', color: '#64748b', icon: '❓' };
  }
  
  // Calculate real net worth growth from transaction history
  const calculateNetWorthGrowth = () => {
    try {
      if (!recentTransactions || recentTransactions.length === 0) return 0;
      
      // Get transactions from last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const last6MonthsTransactions = recentTransactions.filter(t => {
        const transactionDate = new Date(t.date || t.transactionDate);
        return transactionDate >= sixMonthsAgo;
      });
      
      if (last6MonthsTransactions.length === 0) return 0;
      
      // Calculate net change (income - expenses)
      const netChange = last6MonthsTransactions.reduce((sum, t) => {
        if (t.type === 'INCOME' || t.amount > 0) {
          return sum + Math.abs(t.amount);
        } else {
          return sum - Math.abs(t.amount);
        }
      }, 0);
      
      // Calculate as percentage of current savings (or use arbitrary base if no savings)
      const base = user.currentSavings || 10000;
      const growthRate = (netChange / base) * 100;
      
      return parseFloat(growthRate.toFixed(1));
    } catch (error) {
      console.error('Error calculating net worth growth:', error);
      return 0;
    }
  };
  
  const netWorthGrowth = calculateNetWorthGrowth();
  
  // Credit utilization - simplified (can be enhanced if credit card data is available)
  // For now, use debt to income as a proxy
  const creditUtilization = parseFloat(debtToIncomeRatio) || 0;
  


  return (
    <section className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, {user.username || 'User'}!</h1>
            <p>Here's your complete financial overview</p>
          </div>
          <div className="dashboard-header-actions">
            <button 
              className="professional-btn professional-btn-primary export-btn"
              onClick={() => navigate('/export')}
              title="Export Financial Data"
            >
              📊 Export Data
            </button>
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
              <button 
                className="professional-btn professional-btn-primary action-btn" 
                onClick={() => setShowExpenseModal(true)}
                title="Add a new expense transaction"
              >
                ➕ Add Expense
              </button>
              <button 
                className="professional-btn professional-btn-success action-btn" 
                onClick={() => setShowGoalModal(true)}
                title="Set a new savings goal"
              >
                🎯 Set Goal
              </button>
              <button 
                className="professional-btn professional-btn-secondary action-btn" 
                onClick={() => navigate('/financial-health')}
                title="View detailed financial health analysis"
              >
                📊 View Reports
              </button>
            </div>
          </div>

          <div className="insight-card">
            <h3>View Trends</h3>
            <div className="trends-preview">
              <div 
                className="trend-item" 
                onClick={() => navigate('/trends/monthly-spending')}
                title="View monthly spending trends and patterns"
                style={{
                  background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                  border: '1px solid #d8b4fe',
                  cursor: 'pointer'
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
                title="Analyze spending by categories"
                style={{
                  background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                  border: '1px solid #d8b4fe',
                  cursor: 'pointer'
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
                title="Track your savings growth over time"
                style={{
                  background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                  border: '1px solid #d8b4fe',
                  cursor: 'pointer'
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
                <span className="health-icon">{healthStatus.icon}</span>
                <span className="health-label" style={{ color: healthStatus.color }}>{healthStatus.status}</span>
              </div>
            </div>
            
            <div className="health-breakdown">
              <div className="health-metric">
                <div className="metric-label">
                  🐷 Savings Rate
                </div>
                <div className="metric-value">{savingsRate}%</div>
                <div className="metric-bar">
                  <div className="metric-fill" style={{width: `${Math.min(savingsRate * 5, 100)}%`, backgroundColor: '#22c55e'}}></div>
                </div>
              </div>
              
              <div className="health-metric">
                <div className="metric-label">
                  🛡️ Emergency Fund
                </div>
                <div className="metric-value">{emergencyFundMonths} months</div>
                <div className="metric-bar">
                  <div className="metric-fill" style={{width: `${Math.min(emergencyFundMonths * 16.67, 100)}%`, backgroundColor: '#3b82f6'}}></div>
                </div>
              </div>
              
              <div className="health-metric">
                <div className="metric-label">
                  📊 Expense Ratio
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

        {/* Professional Chart Cards */}
        <div className="professional-chart-grid">
          <div className="chart-card">
            <div className="chart-card-header">
              <h3>Monthly Trends</h3>
              <button 
                className="chart-view-btn"
                onClick={() => navigate('/analytics')}
              >
                View Full Analytics
              </button>
            </div>
            <div className="pure-chart-container">
              <ErrorBoundary>
                <PureMonthlyChart months={3} />
              </ErrorBoundary>
            </div>
          </div>
          
          <div className="chart-card">
            <div className="chart-card-header">
              <h3>Spending Categories</h3>
              <button 
                className="chart-view-btn"
                onClick={() => navigate('/analytics')}
              >
                View Details
              </button>
            </div>
            <div className="pure-chart-container">
              <ErrorBoundary>
                <PureCategoryChart />
              </ErrorBoundary>
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
                  <div className="transaction-right">
                    <div className={`transaction-amount ${transaction.type.toLowerCase()}`}>
                      {transaction.type === 'EXPENSE' ? '-' : '+'}
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div className="transaction-actions">
                      <button 
                        className="action-btn edit-btn" 
                        onClick={() => handleEditTransaction(transaction)}
                        title="Edit transaction"
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-btn delete-btn" 
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        title="Delete transaction"
                      >
                        🗑️
                      </button>
                    </div>
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

        {/* Add/Edit Expense Modal */}
        {showExpenseModal && (
          <div className="modal-overlay" onClick={() => {
            setShowExpenseModal(false);
            setEditingTransaction(null);
            setExpenseForm({
              amount: '',
              category: '',
              description: '',
              date: new Date().toISOString().split('T')[0]
            });
          }}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingTransaction ? 'Edit Transaction' : 'Add New Expense'}</h3>
                <button className="close-btn" onClick={() => {
                  setShowExpenseModal(false);
                  setEditingTransaction(null);
                  setExpenseForm({
                    amount: '',
                    category: '',
                    description: '',
                    date: new Date().toISOString().split('T')[0]
                  });
                }} title="Close">
                  ×
                </button>
              </div>
              <form onSubmit={editingTransaction ? handleUpdateTransaction : handleAddExpense} className="expense-form">
                <div className="form-group">
                  <label htmlFor="amount">Amount (₹)</label>
                  <input
                    type="text"
                    id="amount"
                    name="amount"
                    value={expenseForm.amount}
                    onChange={handleExpenseInputChange}
                    placeholder="0.00"
                    pattern="^\d+(\.\d{1,2})?$"
                    title="Please enter a valid amount (e.g., 100 or 100.50)"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    className="professional-dropdown"
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
                  <button type="button" className="btn-secondary" onClick={() => {
                    setShowExpenseModal(false);
                    setEditingTransaction(null);
                    setExpenseForm({
                      amount: '',
                      category: '',
                      description: '',
                      date: new Date().toISOString().split('T')[0]
                    });
                  }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingTransaction ? 'Update Transaction' : 'Add Expense'}
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
                <button className="close-btn" onClick={() => setShowGoalModal(false)} title="Close">
                  ×
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
                  <label htmlFor="targetAmount">Target Amount (₹)</label>
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
                  <label htmlFor="currentAmount">Current Amount (₹)</label>
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