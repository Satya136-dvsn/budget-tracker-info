import React from 'react';

const Home = () => {
  return (
    <section className="hero">
      <div className="hero-center-box">
        <div className="hero-content">
          <h2>Welcome to Budget Tracker</h2>
          <p>Take control of your finances with our easy-to-use budget tracking application.</p>
          <div className="features">
            <div className="feature">
              <div className="feature-icon-bg">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Track Expenses</h3>
              <p>Monitor your spending patterns</p>
            </div>
            <div className="feature">
              <div className="feature-icon-bg">
                <i className="fas fa-piggy-bank"></i>
              </div>
              <h3>Save Money</h3>
              <p>Set and achieve savings goals</p>
            </div>
            <div className="feature">
              <div className="feature-icon-bg">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Easy to Use</h3>
              <p>Simple and intuitive interface</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;