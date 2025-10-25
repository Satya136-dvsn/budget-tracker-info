import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../Common/Card';
import { Button } from '../Common/Button';
import api from '../../services/api';
import './InvestmentDashboard.css';

const InvestmentDashboard = () => {
    const [investments, setInvestments] = useState([]);
    const [portfolioSummary, setPortfolioSummary] = useState({
        totalValue: 0,
        totalGainLoss: 0,
        percentageReturn: 0,
        dayChange: 0
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Mock data for now since backend might not be fully connected
            const mockInvestments = [
                { id: 1, symbol: 'AAPL', name: 'Apple Inc.', quantity: 10, currentPrice: 150.00, totalValue: 1500.00, gainLoss: 100.00 },
                { id: 2, symbol: 'GOOGL', name: 'Alphabet Inc.', quantity: 5, currentPrice: 2500.00, totalValue: 12500.00, gainLoss: 500.00 },
                { id: 3, symbol: 'MSFT', name: 'Microsoft Corp.', quantity: 8, currentPrice: 300.00, totalValue: 2400.00, gainLoss: -50.00 }
            ];
            
            const mockSummary = {
                totalValue: 16400.00,
                totalGainLoss: 550.00,
                percentageReturn: 3.47,
                dayChange: 125.50
            };

            setInvestments(mockInvestments);
            setPortfolioSummary(mockSummary);
        } catch (error) {
            console.error('Error fetching investment data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefreshPrices = async () => {
        try {
            setRefreshing(true);
            // Simulate refresh
            setTimeout(() => {
                fetchData();
                setRefreshing(false);
            }, 1000);
        } catch (error) {
            console.error('Failed to refresh prices:', error);
            setRefreshing(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value || 0);
    };

    const formatPercentage = (value) => {
        const num = parseFloat(value || 0);
        return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
    };

    const getPerformanceColor = (value) => {
        const num = parseFloat(value || 0);
        return num >= 0 ? '#10b981' : '#ef4444';
    };

    if (loading) {
        return (
            <div className="investment-dashboard">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading investment data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="investment-dashboard">
            <div className="dashboard-header">
                <h1>📈 Investment Portfolio</h1>
                <p>Track your investments and portfolio performance</p>
                <Button 
                    onClick={handleRefreshPrices} 
                    disabled={refreshing}
                    className="refresh-btn"
                >
                    {refreshing ? '🔄 Refreshing...' : '🔄 Refresh Prices'}
                </Button>
            </div>

            {/* Portfolio Summary */}
            <div className="portfolio-summary">
                <Card>
                    <CardHeader>
                        <CardTitle>Portfolio Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="summary-grid">
                            <div className="summary-item">
                                <h3>Total Value</h3>
                                <p className="value-large">{formatCurrency(portfolioSummary.totalValue)}</p>
                            </div>
                            <div className="summary-item">
                                <h3>Total Gain/Loss</h3>
                                <p 
                                    className="value-large"
                                    style={{ color: getPerformanceColor(portfolioSummary.totalGainLoss) }}
                                >
                                    {formatCurrency(portfolioSummary.totalGainLoss)}
                                </p>
                            </div>
                            <div className="summary-item">
                                <h3>Return %</h3>
                                <p 
                                    className="value-large"
                                    style={{ color: getPerformanceColor(portfolioSummary.percentageReturn) }}
                                >
                                    {formatPercentage(portfolioSummary.percentageReturn)}
                                </p>
                            </div>
                            <div className="summary-item">
                                <h3>Day Change</h3>
                                <p 
                                    className="value-large"
                                    style={{ color: getPerformanceColor(portfolioSummary.dayChange) }}
                                >
                                    {formatCurrency(portfolioSummary.dayChange)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Holdings Table */}
            <div className="holdings-section">
                <Card>
                    <CardHeader>
                        <CardTitle>Holdings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="holdings-table">
                            <div className="table-header">
                                <div>Symbol</div>
                                <div>Name</div>
                                <div>Quantity</div>
                                <div>Current Price</div>
                                <div>Total Value</div>
                                <div>Gain/Loss</div>
                            </div>
                            {investments.map((investment) => (
                                <div key={investment.id} className="table-row">
                                    <div className="symbol">{investment.symbol}</div>
                                    <div className="name">{investment.name}</div>
                                    <div>{investment.quantity}</div>
                                    <div>{formatCurrency(investment.currentPrice)}</div>
                                    <div>{formatCurrency(investment.totalValue)}</div>
                                    <div 
                                        style={{ color: getPerformanceColor(investment.gainLoss) }}
                                    >
                                        {formatCurrency(investment.gainLoss)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="action-buttons">
                            <Button className="action-btn">➕ Add Investment</Button>
                            <Button className="action-btn">📊 View Analytics</Button>
                            <Button className="action-btn">🎯 Set Goals</Button>
                            <Button className="action-btn">📈 Market Data</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default InvestmentDashboard;