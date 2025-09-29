import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faPiggyBank, faMobileAlt, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  return (
    <section className="hero">
      <div className="hero-center-box">
        <div className="hero-content">
          <h2>Master Your Financial Future</h2>
          <p>Experience the most intuitive and powerful budget tracking platform designed to transform how you manage your money.</p>
          
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary">
              Start Your Journey
            </Link>
            <Link to="/signin" className="btn btn-outline">
              Sign In
            </Link>
          </div>

          <div className="features">
            <div className="feature">
              <div className="feature-icon-bg">
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <h3>Smart Analytics</h3>
              <p>Advanced insights to understand your spending patterns with beautiful visualizations</p>
            </div>
            <div className="feature">
              <div className="feature-icon-bg">
                <FontAwesomeIcon icon={faPiggyBank} />
              </div>
              <h3>Goal Achievement</h3>
              <p>Set personalized savings goals and track your progress with intelligent recommendations</p>
            </div>
            <div className="feature">
              <div className="feature-icon-bg">
                <FontAwesomeIcon icon={faMobileAlt} />
              </div>
              <h3>Mobile First</h3>
              <p>Seamlessly manage your finances across all devices with our responsive design</p>
            </div>
            <div className="feature">
              <div className="feature-icon-bg">
                <FontAwesomeIcon icon={faShieldAlt} />
              </div>
              <h3>Bank-Grade Security</h3>
              <p>Your financial data is protected with enterprise-level encryption and security</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;