import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user, loadUserProfile } = useAuth();

  useEffect(() => {
    if (!user) {
      loadUserProfile();
    }
  }, [user, loadUserProfile]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  if (!user) {
    return (
      <section className="profile-page">
        <div className="profile-header">
          <h2>Loading Profile...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="profile-page">
      <div className="profile-header">
        <h2><i className="fas fa-user"></i> User Profile</h2>
        <p>Manage your account information and financial details</p>
      </div>
      
      <div className="profile-content">
        <div className="profile-section">
          <h3>Profile Information</h3>
          <div>
            <div className="profile-item">
              <strong>Username:</strong> {user.username || 'N/A'}
            </div>
            <div className="profile-item">
              <strong>Email:</strong> {user.email || 'N/A'}
            </div>
            <div className="profile-item">
              <strong>Role:</strong> {user.role || 'USER'}
            </div>
            <div className="profile-item">
              <strong>Account Status:</strong> {user.enabled ? 'Active' : 'Inactive'}
            </div>
            <div className="profile-item">
              <strong>Member Since:</strong> {formatDate(user.createdAt)}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Financial Information</h3>
          <div>
            <div className="profile-item">
              <strong>Monthly Income:</strong> {formatCurrency(user.monthlyIncome)}
            </div>
            <div className="profile-item">
              <strong>Current Savings:</strong> {formatCurrency(user.currentSavings)}
            </div>
            <div className="profile-item">
              <strong>Target Expenses:</strong> {formatCurrency(user.targetExpenses)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;