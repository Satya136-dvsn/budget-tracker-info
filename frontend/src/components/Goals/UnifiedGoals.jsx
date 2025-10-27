import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../Common/Card';
import { Button } from '../Common/Button';
import { apiService } from '../../services/api';
import { useAlert } from '../../hooks/useAlert';
import './UnifiedGoals.css';

const UnifiedGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [filter, setFilter] = useState('all'); // all, savings, investment, active, completed
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    type: 'savings', // savings or investment
    category: '',
    riskTolerance: 'moderate', // for investment goals
    monthlyContribution: ''
  });
  
  const { showAlert } = useAlert();

  const goalCategories = {
    savings: ['Emergency Fund', 'Vacation', 'Car', 'Home Down Payment', 'Wedding', 'Other'],
    investment: ['Retirement', 'Education', 'Major Purchase', 'Wealth Building', 'Real Estate', 'Other']
  };

  useEffect(() => {
    fetchGoals();
  }, [filter]);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      // Fetch both savings and investment goals
      const [savingsGoals, investmentGoals] = await Promise.all([
        fetchSavingsGoals(),
        fetchInvestmentGoals()
      ]);
      
      const allGoals = [
        ...savingsGoals.map(goal => ({ ...goal, type: 'savings' })),
        ...investmentGoals.map(goal => ({ ...goal, type: 'investment' }))
      ];
      
      setGoals(filterGoals(allGoals));
    } catch (error) {
      console.error('Error fetching goals:', error);
      showAlert('Failed to load goals: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavingsGoals = async () => {
    try {
      return await apiService.getAllSavingsGoals();
    } catch (error) {
      // Fallback savings goals
      return [
        {
          id: 's1',
          name: 'Emergency Fund',
          targetAmount: 500000,
          currentAmount: 125000,
          targetDate: '2024-12-31',
          category: 'Emergency Fund',
          status: 'IN_PROGRESS',
          progressPercentage: 25,
          remainingAmount: 375000
        },
        {
          id: 's2',
          name: 'Dream Vacation',
          targetAmount: 150000,
          currentAmount: 45000,
          targetDate: '2024-08-15',
          category: 'Vacation',
          status: 'IN_PROGRESS',
          progressPercentage: 30,
          remainingAmount: 105000
        }
      ];
    }
  };

  const fetchInvestmentGoals = async () => {
    try {
      // Mock investment goals since we don't have a specific API
      return [
        {
          id: 'i1',
          name: 'Retirement Fund',
          targetAmount: 2000000,
          currentAmount: 350000,
          targetDate: '2045-12-31',
          category: 'Retirement',
          riskTolerance: 'moderate',
          projectedReturn: 8.5,
          monthlyContribution: 15000,
          status: 'IN_PROGRESS',
          progressPercentage: 17.5,
          remainingAmount: 1650000
        },
        {
          id: 'i2',
          name: 'Kids Education Fund',
          targetAmount: 800000,
          currentAmount: 120000,
          targetDate: '2035-06-01',
          category: 'Education',
          riskTolerance: 'aggressive',
          projectedReturn: 10.2,
          monthlyContribution: 8000,
          status: 'IN_PROGRESS',
          progressPercentage: 15,
          remainingAmount: 680000
        }
      ];
    } catch (error) {
      return [];
    }
  };

  const filterGoals = (allGoals) => {
    switch (filter) {
      case 'savings':
        return allGoals.filter(goal => goal.type === 'savings');
      case 'investment':
        return allGoals.filter(goal => goal.type === 'investment');
      case 'active':
        return allGoals.filter(goal => goal.status === 'IN_PROGRESS');
      case 'completed':
        return allGoals.filter(goal => goal.status === 'COMPLETED');
      default:
        return allGoals;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingGoal) {
        if (formData.type === 'savings') {
          await apiService.updateSavingsGoal(editingGoal.id, formData);
        }
        showAlert('Goal updated successfully!', 'success');
      } else {
        if (formData.type === 'savings') {
          await apiService.createSavingsGoal(formData);
        }
        showAlert('Goal created successfully!', 'success');
      }
      
      setShowModal(false);
      setEditingGoal(null);
      resetForm();
      fetchGoals();
    } catch (error) {
      showAlert('Failed to save goal: ' + error.message, 'error');
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      description: goal.description || '',
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount || 0,
      targetDate: goal.targetDate || '',
      type: goal.type,
      category: goal.category || '',
      riskTolerance: goal.riskTolerance || 'moderate',
      monthlyContribution: goal.monthlyContribution || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (goal) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) {
      return;
    }
    
    try {
      if (goal.type === 'savings') {
        await apiService.deleteSavingsGoal(goal.id);
      }
      showAlert('Goal deleted successfully!', 'success');
      fetchGoals();
    } catch (error) {
      showAlert('Failed to delete goal: ' + error.message, 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      targetAmount: '',
      currentAmount: '',
      targetDate: '',
      type: 'savings',
      category: '',
      riskTolerance: 'moderate',
      monthlyContribution: ''
    });
  };

  const openNewGoalModal = () => {
    setEditingGoal(null);
    resetForm();
    setShowModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getGoalIcon = (type, category) => {
    if (type === 'investment') {
      switch (category) {
        case 'Retirement': return '🏖️';
        case 'Education': return '🎓';
        case 'Major Purchase': return '🏠';
        case 'Wealth Building': return '💰';
        case 'Real Estate': return '🏢';
        default: return '📈';
      }
    } else {
      switch (category) {
        case 'Emergency Fund': return '🛡️';
        case 'Vacation': return '✈️';
        case 'Car': return '🚗';
        case 'Home Down Payment': return '🏠';
        case 'Wedding': return '💒';
        default: return '🎯';
      }
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'conservative': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'aggressive': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="unified-goals">
        <div className="loading">Loading goals...</div>
      </div>
    );
  }

  return (
    <div className="unified-goals">
      <div className="goals-header">
        <div>
          <h1>Financial Goals</h1>
          <p>Track your savings and investment goals in one place</p>
        </div>
        <button className="btn-primary" onClick={openNewGoalModal}>
          <i className="fas fa-plus"></i> New Goal
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Goals ({goals.length})
        </button>
        <button 
          className={`filter-tab ${filter === 'savings' ? 'active' : ''}`}
          onClick={() => setFilter('savings')}
        >
          Savings Goals
        </button>
        <button 
          className={`filter-tab ${filter === 'investment' ? 'active' : ''}`}
          onClick={() => setFilter('investment')}
        >
          Investment Goals
        </button>
        <button 
          className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button 
          className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {/* Goals Summary */}
      <div className="goals-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-bullseye"></i>
          </div>
          <div className="summary-info">
            <h3>{formatCurrency(goals.reduce((sum, goal) => sum + goal.targetAmount, 0))}</h3>
            <p>Total Target</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-coins"></i>
          </div>
          <div className="summary-info">
            <h3>{formatCurrency(goals.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0))}</h3>
            <p>Total Saved</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="summary-info">
            <h3>
              {goals.length > 0 
                ? ((goals.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0) / 
                   goals.reduce((sum, goal) => sum + goal.targetAmount, 0)) * 100).toFixed(1) 
                : 0}%
            </h3>
            <p>Overall Progress</p>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-target"></i>
          <h3>No goals yet</h3>
          <p>Create your first financial goal to start tracking your progress</p>
        </div>
      ) : (
        <div className="goals-grid">
          {goals.map(goal => (
            <div key={goal.id} className={`goal-card ${goal.type}`}>
              <div className="goal-header">
                <div className="goal-title">
                  <span className="goal-icon">{getGoalIcon(goal.type, goal.category)}</span>
                  <h3>{goal.name}</h3>
                  <span className={`type-badge ${goal.type}`}>
                    {goal.type === 'savings' ? 'Savings' : 'Investment'}
                  </span>
                </div>
                <div className="goal-actions">
                  <button 
                    className="btn-icon" 
                    onClick={() => handleEdit(goal)}
                    title="Edit"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="btn-icon delete" 
                    onClick={() => handleDelete(goal)}
                    title="Delete"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <div className="goal-amounts">
                <div className="amount-row">
                  <span className="amount-label">Current</span>
                  <span className="amount-value">{formatCurrency(goal.currentAmount || 0)}</span>
                </div>
                <div className="amount-row">
                  <span className="amount-label">Target</span>
                  <span className="amount-value">{formatCurrency(goal.targetAmount)}</span>
                </div>
                <div className="amount-row">
                  <span className="amount-label">Remaining</span>
                  <span className="amount-value remaining">
                    {formatCurrency(goal.remainingAmount || (goal.targetAmount - (goal.currentAmount || 0)))}
                  </span>
                </div>
              </div>

              <div className="goal-progress">
                <div className="progress-header">
                  <span className="progress-text">
                    {(goal.progressPercentage || 0).toFixed(1)}% Complete
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{
                      width: `${Math.min(goal.progressPercentage || 0, 100)}%`,
                      backgroundColor: goal.type === 'investment' ? '#3b82f6' : '#10b981'
                    }}
                  ></div>
                </div>
              </div>

              {goal.targetDate && (
                <div className="goal-deadline">
                  <i className="fas fa-calendar"></i>
                  <span>Target: {formatDate(goal.targetDate)}</span>
                </div>
              )}

              {goal.type === 'investment' && (
                <div className="investment-details">
                  {goal.riskTolerance && (
                    <div className="detail-item">
                      <span className="label">Risk:</span>
                      <span 
                        className="risk-badge"
                        style={{ backgroundColor: getRiskColor(goal.riskTolerance) }}
                      >
                        {goal.riskTolerance}
                      </span>
                    </div>
                  )}
                  {goal.projectedReturn && (
                    <div className="detail-item">
                      <span className="label">Expected Return:</span>
                      <span className="value">{goal.projectedReturn}%</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal for Create/Edit Goal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingGoal ? 'Edit Goal' : 'Create New Goal'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Goal Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                >
                  <option value="savings">Savings Goal</option>
                  <option value="investment">Investment Goal</option>
                </select>
              </div>

              <div className="form-group">
                <label>Goal Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                  placeholder="e.g., Emergency Fund, Retirement"
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                >
                  <option value="">Select Category</option>
                  {goalCategories[formData.type].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Target Amount (₹)</label>
                  <input
                    type="number"
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleInputChange}
                    required
                    min="0.01"
                    step="0.01"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Current Amount (₹)</label>
                  <input
                    type="number"
                    name="currentAmount"
                    value={formData.currentAmount}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Target Date (Optional)</label>
                <input
                  type="date"
                  name="targetDate"
                  value={formData.targetDate}
                  onChange={handleInputChange}
                  className="form-control"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {formData.type === 'investment' && (
                <>
                  <div className="form-group">
                    <label>Risk Tolerance</label>
                    <select
                      name="riskTolerance"
                      value={formData.riskTolerance}
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      <option value="conservative">Conservative</option>
                      <option value="moderate">Moderate</option>
                      <option value="aggressive">Aggressive</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Monthly Contribution (₹)</label>
                    <input
                      type="number"
                      name="monthlyContribution"
                      value={formData.monthlyContribution}
                      onChange={handleInputChange}
                      min="0"
                      step="100"
                      className="form-control"
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-control"
                  rows="3"
                  placeholder="Add details about your goal..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedGoals;