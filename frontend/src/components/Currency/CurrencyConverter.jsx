import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './CurrencyConverter.css';

const CurrencyConverter = ({ initialAmount = '', initialFromCurrency = 'USD', initialToCurrency = 'EUR', onConvert }) => {
  const [amount, setAmount] = useState(initialAmount);
  const [fromCurrency, setFromCurrency] = useState(initialFromCurrency);
  const [toCurrency, setToCurrency] = useState(initialToCurrency);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  useEffect(() => {
    if (amount && fromCurrency && toCurrency && amount > 0) {
      convertCurrency();
    }
  }, [amount, fromCurrency, toCurrency]);

  const fetchCurrencies = async () => {
    try {
      const response = await api.get('/currencies/common');
      setCurrencies(response.data);
    } catch (error) {
      console.error('Error fetching currencies:', error);
      setError('Failed to load currencies');
    }
  };

  const convertCurrency = async () => {
    if (!amount || amount <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/currencies/convert', {
        amount: parseFloat(amount),
        fromCurrencyCode: fromCurrency,
        toCurrencyCode: toCurrency
      });

      setResult(response.data);
      
      if (onConvert) {
        onConvert(response.data);
      }
    } catch (error) {
      console.error('Error converting currency:', error);
      setError('Failed to convert currency. Please try again.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const formatAmount = (value, currencyCode, symbol) => {
    if (!value) return '0.00';
    
    const formatted = parseFloat(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return `${symbol} ${formatted}`;
  };

  return (
    <div className="currency-converter">
      <div className="converter-header">
        <h3>Currency Converter</h3>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="converter-form">
        <div className="amount-input-group">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="0"
            step="0.01"
            className="amount-input"
          />
        </div>

        <div className="currency-selection">
          <div className="currency-group">
            <label htmlFor="fromCurrency">From</label>
            <select
              id="fromCurrency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="currency-select"
            >
              {currencies.map(currency => (
                <option key={currency.id} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={swapCurrencies}
            className="swap-button"
            title="Swap currencies"
          >
            ⇄
          </button>

          <div className="currency-group">
            <label htmlFor="toCurrency">To</label>
            <select
              id="toCurrency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="currency-select"
            >
              {currencies.map(currency => (
                <option key={currency.id} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="conversion-loading">
          <div className="loading-spinner"></div>
          <span>Converting...</span>
        </div>
      )}

      {result && !loading && (
        <div className="conversion-result">
          <div className="result-display">
            <div className="original-amount">
              {formatAmount(result.originalAmount, result.fromCurrencyCode, result.fromCurrencySymbol)}
            </div>
            <div className="equals">=</div>
            <div className="converted-amount">
              {formatAmount(result.convertedAmount, result.toCurrencyCode, result.toCurrencySymbol)}
            </div>
          </div>
          
          <div className="exchange-rate-info">
            <span className="rate-label">Exchange Rate:</span>
            <span className="rate-value">
              1 {result.fromCurrencyCode} = {result.exchangeRate} {result.toCurrencyCode}
            </span>
          </div>
          
          {result.conversionDate && (
            <div className="conversion-date">
              Rate as of {new Date(result.conversionDate).toLocaleDateString()}
            </div>
          )}
        </div>
      )}

      {!result && !loading && amount && amount > 0 && (
        <div className="no-result">
          Enter an amount to see the conversion
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;