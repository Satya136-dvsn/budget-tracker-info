﻿import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../hooks/useAlert';

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Attempting login with:', formData);
      const response = await login(formData);
      console.log('Login response:', response);
      showAlert('Login successful!', 'success');
      console.log('Navigating to dashboard...');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      showAlert(`Login failed: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-section">
      <div className="auth-container">
        <div className="auth-left">
          <div className="welcome-content">
            <h1>Welcome Back!</h1>
            <p>Continue your financial journey with Budget Tracker</p>
            <div className="benefits-list">
              <div className="benefit-item">
                <i className="fas fa-chart-line"></i>
                <div>
                  <b>Track Progress</b>
                  <div style={{fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)'}}>Monitor your financial goals and achievements</div>
                </div>
              </div>
              <div className="benefit-item">
                <i className="fas fa-shield-alt"></i>
                <div>
                  <b>Secure & Private</b>
                  <div style={{fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)'}}>Your financial data is encrypted and protected</div>
                </div>
              </div>
              <div className="benefit-item">
                <i className="fas fa-mobile-alt"></i>
                <div>
                  <b>Access Anywhere</b>
                  <div style={{fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)'}}>Manage your budget on any device, anytime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-form">
            <h2>Sign In</h2>
            <p>Enter your credentials to access your account</p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Enter your username"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
                <div className="forgot-password">
                  <Link to="/forgot-password">Forgot your password?</Link>
                </div>
              </div>
              
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            
            <div className="auth-links">
              Don't have an account? <Link to="/signup">Sign up here</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
