import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './CurrencySelector.css';

const CurrencySelector = ({ 
  value = 'USD', 
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
      setError('Failed to load currencies');
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
          {currencies.map(currency => (
            <option key={currency.id} value={currency.code}>
              {currency.code} - {currency.name}
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