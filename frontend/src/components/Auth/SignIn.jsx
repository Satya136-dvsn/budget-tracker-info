import React, { useState } from 'react';
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
      await login(formData);
      showAlert('Login successful!', 'success');
      navigate('/dashboard');
    } catch (error) {
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
            <h1 style={{fontWeight: 700, fontSize: '2.5rem', marginBottom: '1.2rem'}}>Welcome Back!</h1>
            <p style={{fontSize: '1.15rem', marginBottom: '2.5rem'}}>Continue your financial journey with Budget Tracker</p>
            <div className="benefits-list">
              <div className="benefit-item">
                <i className="fas fa-chart-line"></i>
                <div>
                  <b>Track Progress</b>
                  <div style={{fontSize: '1rem', color: '#bfc4e0'}}>Monitor your financial goals and achievements</div>
                </div>
              </div>
              <div className="benefit-item">
                <i className="fas fa-wallet"></i>
                <div>
                  <b>Manage Expenses</b>
                  <div style={{fontSize: '1rem', color: '#bfc4e0'}}>Keep track of every dollar spent and saved</div>
                </div>
              </div>
              <div className="benefit-item">
                <i className="fas fa-lightbulb"></i>
                <div>
                  <b>Smart Insights</b>
                  <div style={{fontSize: '1rem', color: '#bfc4e0'}}>Get personalized recommendations for better budgeting</div>
                </div>
              </div>
            </div>
            <div className="stats" style={{marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', gap: '1.5rem'}}>
              <div className="stat">
                <b style={{fontSize: '1.3rem'}}>Welcome</b>
                <div style={{fontSize: '1rem', color: '#bfc4e0'}}>Back!</div>
              </div>
              <div className="stat">
                <b style={{fontSize: '1.3rem'}}>Secure</b>
                <div style={{fontSize: '1rem', color: '#bfc4e0'}}>Login</div>
              </div>
              <div className="stat">
                <b style={{fontSize: '1.3rem'}}>Easy</b>
                <div style={{fontSize: '1rem', color: '#bfc4e0'}}>Access</div>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-right">
          <div className="form-container">
            <h2 style={{textAlign: 'center', fontWeight: 700, fontSize: '2rem', marginBottom: '2rem'}}><i className="fas fa-sign-in-alt"></i> Sign In</h2>
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
                       disabled={loading}
                       style={{}}
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
                       disabled={loading}
                       style={{}}
                     />
              </div>
              <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{background: '#6d7eea', border: 'none'}}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            <div style={{textAlign: 'center', marginTop: '1rem'}}>
              <Link to="/forgot-password" style={{color: '#4d6eea', fontSize: '1rem'}}>Forgot Password?</Link>
            </div>
            <p className="form-switch" style={{marginTop: '1.5rem'}}>Don't have an account? <Link to="/signup" style={{color: '#4d6eea', border: '1.5px solid #4d6eea', borderRadius: '6px', padding: '4px 12px', marginLeft: '8px'}}>Sign Up here</Link></p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;