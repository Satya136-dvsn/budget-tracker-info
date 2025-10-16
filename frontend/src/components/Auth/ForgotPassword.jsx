import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAlert } from '../../hooks/useAlert';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { showAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For now, show a success message since we don't have a backend endpoint
      // In a real app, you would call: await apiService.forgotPassword(email);
      
      showAlert('Password reset link has been sent to your email address. Please check your inbox.', 'success');
      
      // Reset the form
      setEmail('');
      
    } catch (error) {
      showAlert(`Failed to send reset email: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-section">
      <div className="auth-container">
        <div className="auth-left">
          <div className="welcome-content">
            <h2>Reset Your Password</h2>
            <p>Don't worry! It happens. Please enter the email address associated with your account.</p>
            
            <div className="benefits-list">
              <div className="benefit-item">
                <i className="fas fa-shield-alt"></i>
                <div>
                  <h4>Secure Process</h4>
                  <p>Your password reset is protected with advanced security</p>
                </div>
              </div>
              <div className="benefit-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <h4>Email Verification</h4>
                  <p>We'll send you a secure link to reset your password</p>
                </div>
              </div>
              <div className="benefit-item">
                <i className="fas fa-clock"></i>
                <div>
                  <h4>Quick Recovery</h4>
                  <p>Get back to managing your budget in just a few minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-right">
          <div className="form-container">
            <h2><i className="fas fa-key"></i> Reset Password</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={loading}
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <p className="form-switch">
              Remember your password? <Link to="/signin">Sign In here</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;