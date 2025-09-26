import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { user, loadUserProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      loadUserProfile();
    }
  }, [user, loadUserProfile]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  if (!user) {
    return (
      <section className="dashboard">
        <div className="dashboard-header">
          <h2>Loading...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome, {user.username || 'User'}!</h2>
        <p>Here's your budget overview</p>
        <button 
          className="trends-btn"
          onClick={() => navigate('/trends')}
        >
          <i className="fas fa-chart-line"></i> View Trends
        </button>
      </div>
      
      <div className="dashboard-cards">
        <div className="card">
          <div className="card-header">
            <h3><i className="fas fa-dollar-sign"></i> Monthly Income</h3>
          </div>
          <div className="card-body">
            <span className="amount">{formatCurrency(user.monthlyIncome)}</span>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h3><i className="fas fa-shopping-cart"></i> Target Expenses</h3>
          </div>
          <div className="card-body">
            <span className="amount">{formatCurrency(user.targetExpenses)}</span>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h3><i className="fas fa-piggy-bank"></i> Current Savings</h3>
          </div>
          <div className="card-body">
            <span className="amount">{formatCurrency(user.currentSavings)}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;