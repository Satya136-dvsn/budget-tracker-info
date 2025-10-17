/**
 * Enhanced currency formatting utilities for Indian Rupees
 * Provides consistent INR formatting across the application
 */

/**
 * Format amount in Indian Rupees with proper formatting
 * @param {number} amount - The amount to format
 * @param {object} options - Formatting options
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, options = {}) => {
  try {
    // Handle null, undefined, or invalid amounts
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '₹0';
    }

    const numAmount = parseFloat(amount);
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: options.decimals || 0,
      minimumFractionDigits: 0
    }).format(numAmount);
  } catch (error) {
    console.error('Currency formatting error:', error);
    // Fallback formatting
    return `₹${Math.round(amount || 0).toLocaleString('en-IN')}`;
  }
};

/**
 * Format large amounts in compact form (K, L, Cr)
 * @param {number} amount - The amount to format
 * @returns {string} Compact formatted currency string
 */
export const formatCurrencyCompact = (amount) => {
  try {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '₹0';
    }

    const numAmount = Math.abs(parseFloat(amount));
    
    if (numAmount >= 10000000) {
      return `₹${(numAmount / 10000000).toFixed(1)}Cr`;
    }
    if (numAmount >= 100000) {
      return `₹${(numAmount / 100000).toFixed(1)}L`;
    }
    if (numAmount >= 1000) {
      return `₹${(numAmount / 1000).toFixed(1)}K`;
    }
    
    return `₹${Math.round(numAmount).toLocaleString('en-IN')}`;
  } catch (error) {
    console.error('Compact currency formatting error:', error);
    return `₹${Math.round(amount || 0)}`;
  }
};

/**
 * Format currency for chart displays (shorter format)
 * @param {number} amount - The amount to format
 * @returns {string} Chart-friendly formatted currency string
 */
export const formatCurrencyForChart = (amount) => {
  try {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '₹0';
    }

    const numAmount = Math.abs(parseFloat(amount));
    
    if (numAmount >= 10000000) {
      return `₹${(numAmount / 10000000).toFixed(1)}Cr`;
    }
    if (numAmount >= 100000) {
      return `₹${(numAmount / 100000).toFixed(1)}L`;
    }
    if (numAmount >= 1000) {
      return `₹${(numAmount / 1000).toFixed(1)}k`;
    }
    
    return `₹${Math.round(numAmount)}`;
  } catch (error) {
    console.error('Chart currency formatting error:', error);
    return `₹${Math.round(amount || 0)}`;
  }
};

/**
 * Parse currency string back to number
 * @param {string} currencyString - Currency string to parse
 * @returns {number} Parsed amount
 */
export const parseCurrency = (currencyString) => {
  try {
    if (!currencyString || typeof currencyString !== 'string') {
      return 0;
    }
    
    // Remove currency symbols and spaces
    const cleanString = currencyString.replace(/[₹,\s]/g, '');
    
    // Handle compact formats
    if (cleanString.includes('Cr')) {
      return parseFloat(cleanString.replace('Cr', '')) * 10000000;
    }
    if (cleanString.includes('L')) {
      return parseFloat(cleanString.replace('L', '')) * 100000;
    }
    if (cleanString.includes('K') || cleanString.includes('k')) {
      return parseFloat(cleanString.replace(/[Kk]/, '')) * 1000;
    }
    
    return parseFloat(cleanString) || 0;
  } catch (error) {
    console.error('Currency parsing error:', error);
    return 0;
  }
};

/**
 * Format percentage values
 * @param {number} percentage - The percentage to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (percentage, decimals = 1) => {
  try {
    if (percentage === null || percentage === undefined || isNaN(percentage)) {
      return '0%';
    }
    
    return `${parseFloat(percentage).toFixed(decimals)}%`;
  } catch (error) {
    console.error('Percentage formatting error:', error);
    return '0%';
  }
};

// Export default formatter for backward compatibility
export default formatCurrency;