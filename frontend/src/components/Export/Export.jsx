import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import './Export.css';

const Export = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const generateFilename = (type, extension) => {
    const dateStr = new Date().toISOString().split('T')[0];
    let filename = `${type}-${dateStr}`;
    
    if (startDate && endDate) {
      filename = `${type}-${startDate}-to-${endDate}`;
    }
    
    return `${filename}.${extension}`;
  };

  const handleExportTransactionsPdf = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const blob = await apiService.exportTransactionsPdf(startDate, endDate);
      const filename = generateFilename('transactions', 'pdf');
      downloadFile(blob, filename);
      
      setSuccess('Transactions exported to PDF successfully!');
    } catch (error) {
      console.error('Error exporting transactions PDF:', error);
      setError('Failed to export transactions to PDF: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportTransactionsCsv = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const blob = await apiService.exportTransactionsCsv(startDate, endDate);
      const filename = generateFilename('transactions', 'csv');
      downloadFile(blob, filename);
      
      setSuccess('Transactions exported to CSV successfully!');
    } catch (error) {
      console.error('Error exporting transactions CSV:', error);
      setError('Failed to export transactions to CSV: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportAnalyticsPdf = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const blob = await apiService.exportAnalyticsPdf();
      const filename = generateFilename('financial-analytics', 'pdf');
      downloadFile(blob, filename);
      
      setSuccess('Analytics report exported to PDF successfully!');
    } catch (error) {
      console.error('Error exporting analytics PDF:', error);
      setError('Failed to export analytics report: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearDateRange = () => {
    setStartDate('');
    setEndDate('');
  };

  const setQuickDateRange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
  };

  return (
    <div className="export-page">
      <div className="export-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="header-title">
            <h1>Export Data</h1>
            <p>Download your financial data and reports</p>
          </div>
        </div>
      </div>

      <div className="export-content">
        {/* Date Range Selection */}
        <div className="export-card">
          <h3>📅 Date Range Selection</h3>
          <p>Choose a date range for your exports (optional)</p>
          
          <div className="date-range-section">
            <div className="date-inputs">
              <div className="date-input-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="date-input"
                />
              </div>
              <div className="date-input-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="date-input"
                />
              </div>
            </div>
            
            <div className="quick-date-buttons">
              <button onClick={() => setQuickDateRange(30)} className="quick-date-btn">
                Last 30 days
              </button>
              <button onClick={() => setQuickDateRange(90)} className="quick-date-btn">
                Last 3 months
              </button>
              <button onClick={() => setQuickDateRange(365)} className="quick-date-btn">
                Last year
              </button>
              <button onClick={clearDateRange} className="quick-date-btn clear">
                All time
              </button>
            </div>
            
            {(startDate || endDate) && (
              <div className="date-range-display">
                <span className="range-label">Selected range:</span>
                <span className="range-value">
                  {startDate || 'Beginning'} to {endDate || 'Now'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Transaction Exports */}
        <div className="export-card">
          <h3>📊 Transaction Data</h3>
          <p>Export your transaction history in different formats</p>
          
          <div className="export-options">
            <div className="export-option">
              <div className="export-option-info">
                <h4>📄 PDF Report</h4>
                <p>Comprehensive report with summary statistics and transaction details</p>
              </div>
              <button 
                onClick={handleExportTransactionsPdf}
                disabled={loading}
                className="export-btn pdf"
              >
                {loading ? '⏳ Exporting...' : '📄 Export PDF'}
              </button>
            </div>
            
            <div className="export-option">
              <div className="export-option-info">
                <h4>📈 CSV Data</h4>
                <p>Raw transaction data for spreadsheet analysis</p>
              </div>
              <button 
                onClick={handleExportTransactionsCsv}
                disabled={loading}
                className="export-btn csv"
              >
                {loading ? '⏳ Exporting...' : '📊 Export CSV'}
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Export */}
        <div className="export-card">
          <h3>📈 Analytics Report</h3>
          <p>Complete financial analytics with insights and trends</p>
          
          <div className="export-options">
            <div className="export-option">
              <div className="export-option-info">
                <h4>📊 Analytics PDF</h4>
                <p>Detailed analytics report with charts, trends, and financial insights</p>
              </div>
              <button 
                onClick={handleExportAnalyticsPdf}
                disabled={loading}
                className="export-btn analytics"
              >
                {loading ? '⏳ Generating...' : '📈 Export Analytics'}
              </button>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="export-card error">
            <div className="message-content">
              <span className="message-icon">⚠️</span>
              <div>
                <h4>Export Failed</h4>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="export-card success">
            <div className="message-content">
              <span className="message-icon">✅</span>
              <div>
                <h4>Export Successful</h4>
                <p>{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Export Tips */}
        <div className="export-card tips">
          <h3>💡 Export Tips</h3>
          <ul>
            <li>PDF reports include formatted tables and summary statistics</li>
            <li>CSV files can be opened in Excel, Google Sheets, or other spreadsheet applications</li>
            <li>Analytics reports include charts and trend analysis</li>
            <li>Leave date range empty to export all your data</li>
            <li>Large date ranges may take longer to process</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Export;