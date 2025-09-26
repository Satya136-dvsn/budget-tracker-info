import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../hooks/useAlert';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'USER'
  });
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await register(formData);
      if (response.token && response.id) {
        showAlert('Registration successful! You are now logged in.', 'success');
        navigate('/dashboard');
      } else {
        showAlert('Registration successful! Please login.', 'success');
        navigate('/signin');
      }
    } catch (error) {
      showAlert(`Registration failed: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-section">
      <div className="auth-container">
        <div className="auth-left">
          <div className="welcome-content">
            <h1 style={{fontWeight: 700, fontSize: '2.5rem', marginBottom: '1.2rem'}}>Join Budget Tracker Today!</h1>
            <p style={{fontSize: '1.15rem', marginBottom: '2.5rem'}}>Take control of your financial future with our comprehensive budgeting tools.</p>
            <div className="benefits-list">
              <div className="benefit-item">
                <i className="fas fa-chart-pie"></i>
                <div>
                  <b>Smart Analytics</b>
                  <div style={{fontSize: '1rem', color: '#bfc4e0'}}>Get detailed insights into your spending patterns</div>
                </div>
              </div>
              <div className="benefit-item">
                <i className="fas fa-bullseye"></i>
                <div>
                  <b>Goal Setting</b>
                  <div style={{fontSize: '1rem', color: '#bfc4e0'}}>Set and track your savings and spending goals</div>
                </div>
              </div>
              <div className="benefit-item">
                <i className="fas fa-shield-alt"></i>
                <div>
                  <b>Secure & Private</b>
                  <div style={{fontSize: '1rem', color: '#bfc4e0'}}>Your financial data is protected with bank-level security</div>
                </div>
              </div>
              <div className="benefit-item">
                <i className="fas fa-mobile-alt"></i>
                <div>
                  <b>Always Accessible</b>
                  <div style={{fontSize: '1rem', color: '#bfc4e0'}}>Access your budget anywhere, anytime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-right">
          <div className="form-container">
            <h2 style={{textAlign: 'center', fontWeight: 700, fontSize: '2rem', marginBottom: '2rem'}}><i className="fas fa-user-plus"></i> Sign Up</h2>
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
                <label htmlFor="email">Email</label>
                     <input
                       type="email"
                       id="email"
                       name="email"
                       value={formData.email}
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
              <div className="form-group role-group">
                <label htmlFor="role">Role</label>
                <div className="custom-select-wrapper">
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={loading}
                    className="custom-role-select"
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <span className="select-icon"><i className="fas fa-user-tag"></i></span>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{marginTop: '0.5rem', fontWeight: 600, fontSize: '1.1rem', letterSpacing: '0.5px'}}>
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </form>
            <p className="form-switch" style={{marginTop: '1.5rem'}}>Already have an account? <Link to="/signin" style={{color: '#4d6eea', border: '1.5px solid #4d6eea', borderRadius: '6px', padding: '4px 12px', marginLeft: '8px'}}>Sign In here</Link></p>
        </div>
      </div>
    </div>
  </section>
  );
};

export default SignUp;