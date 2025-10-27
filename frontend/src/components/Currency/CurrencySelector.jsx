import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './CurrencySelector.css';

const CurrencySelector = ({ 
  value = 'INR', 
  onChange, 
  label = 'Currency',
  showCommonOnly = true,
  disabled = false,
  required = false,
  className = ''
}) => {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCurrencies();
  }, [showCommonOnly]);

  const fetchCurrencies = async () => {
    try {
      const endpoint = showCommonOnly ? '/currencies/common' : '/currencies';
      const response = await api.get(endpoint);
      setCurrencies(response.data);
    } catch (error) {
      console.error('Error fetching currencies:', error);
      // Fallback to mock data
      const mockCurrencies = [
        { id: 1, code: 'INR', name: 'Indian Rupee', symbol: '₹' },
        { id: 2, code: 'USD', name: 'US Dollar', symbol: '$' },
        { id: 3, code: 'EUR', name: 'Euro', symbol: '€' },
        { id: 4, code: 'GBP', name: 'British Pound', symbol: '£' },
        { id: 5, code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
        { id: 6, code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
        { id: 7, code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
        { id: 8, code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
        { id: 9, code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
        { id: 10, code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' }
      ];
      setCurrencies(mockCurrencies);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const selectedCode = e.target.value;
    const selectedCurrency = currencies.find(c => c.code === selectedCode);
    
    if (onChange) {
      onChange(selectedCode, selectedCurrency);
    }
  };

  const getSelectedCurrency = () => {
    return currencies.find(c => c.code === value);
  };

  if (loading) {
    return (
      <div className={`currency-selector ${className}`}>
        <label className="currency-label">{label}</label>
        <div className="currency-loading">Loading currencies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`currency-selector ${className}`}>
        <label className="currency-label">{label}</label>
        <div className="currency-error">{error}</div>
      </div>
    );
  }

  const selectedCurrency = getSelectedCurrency();

  return (
    <div className={`currency-selector ${className}`}>
      {label && (
        <label className="currency-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      
      <div className="currency-select-wrapper">
        <select
          value={value}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className="currency-select"
        >
          {!value && <option value="">Select a currency...</option>}
          {currencies.map(currency => (
            <option key={currency.id} value={currency.code}>
              {currency.symbol} {currency.code} - {currency.name}
            </option>
          ))}
        </select>
        
        {selectedCurrency && (
          <div className="currency-symbol">
            {selectedCurrency.symbol}
          </div>
        )}
      </div>
      
      {selectedCurrency && (
        <div className="currency-info">
          <span className="currency-code">{selectedCurrency.code}</span>
          <span className="currency-name">{selectedCurrency.name}</span>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;