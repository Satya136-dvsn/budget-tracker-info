import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../hooks/useAlert';
import { apiService } from '../../services/api';
import './Transactions.css';

const Transactions = () => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [categories, setCategories] = useState([]);
  
  // Filter states
  const [filterType, setFilterType] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  // Form state
  const [transactionForm, setTransactionForm] = useState({
    title: '',
    description: '',
    amount: '',
    type: 'EXPENSE',
    category: '',
    transactionDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (user) {
      loadTransactions();
      loadCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions, filterType, filterCategory, searchQuery, sortBy]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await apiService.getUserTransactions();
      setTransactions(data || []);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      showAlert('Failed to load transactions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const [expenseCategories, incomeCategories] = await Promise.all([
        apiService.getExpenseCategories(),
        apiService.getIncomeCategories()
      ]);
      setCategories([...expenseCategories, ...incomeCategories]);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // Filter by type
    if (filterType !== 'ALL') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Filter by category
    if (filterCategory) {
      filtered = filtered.filter(t => t.category === filterCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'date-desc':
          return new Date(b.transactionDate) - new Date(a.transactionDate);
        case 'date-asc':
          return new Date(a.transactionDate) - new Date(b.transactionDate);
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    setFilteredTransactions(filtered);
  };

  const handleInputChange = (e) => {
    setTransactionForm({
      ...transactionForm,
      [e.target.name]: e.target.value
    });
  };

  const openAddModal = () => {
    setEditingTransaction(null);
    setTransactionForm({
      title: '',
      description: '',
      amount: '',
      type: 'EXPENSE',
      category: '',
      transactionDate: new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setTransactionForm({
      title: transaction.title,
      description: transaction.description || '',
      amount: transaction.amount.toString(),
      type: transaction.type,
      category: transaction.category,
      transactionDate: new Date(transaction.transactionDate).toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!transactionForm.title || !transactionForm.amount || !transactionForm.category) {
      showAlert('Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const transactionData = {
        ...transactionForm,
        amount: parseFloat(transactionForm.amount),
        transactionDate: new Date(transactionForm.transactionDate).toISOString()
      };

      if (editingTransaction) {
        await apiService.updateTransaction(editingTransaction.id, transactionData);
        showAlert('Transaction updated successfully!', 'success');
      } else {
        await apiService.createTransaction(transactionData);
        showAlert('Transaction added successfully!', 'success');
      }

      setShowModal(false);
      loadTransactions();
    } catch (error) {
      console.error('Error saving transaction:', error);
      showAlert(`Failed to save transaction: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    setLoading(true);
    try {
      await apiService.deleteTransaction(id);
      showAlert('Transaction deleted successfully!', 'success');
      loadTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      showAlert('Failed to delete transaction', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCategoryOptions = () => {
    return categories.filter(cat => cat.type === transactionForm.type);
  };

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  if (!user) {
    return (
      <div className="transactions-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <div className="header-content">
          <h1>💳 Transaction Management</h1>
          <p>Track and manage all your income and expenses</p>
        </div>
        <button className="add-transaction-btn" onClick={openAddModal}>
          <i className="fas fa-plus"></i> Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card income">
          <div className="card-icon">📥</div>
          <div className="card-content">
            <div className="card-label">Total Income</div>
            <div className="card-value">{formatCurrency(totalIncome)}</div>
          </div>
        </div>
        <div className="summary-card expense">
          <div className="card-icon">📤</div>
          <div className="card-content">
            <div className="card-label">Total Expenses</div>
            <div className="card-value">{formatCurrency(totalExpenses)}</div>
          </div>
        </div>
        <div className="summary-card balance">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <div className="card-label">Net Balance</div>
            <div className="card-value">{formatCurrency(totalIncome - totalExpenses)}</div>
          </div>
        </div>
        <div className="summary-card count">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <div className="card-label">Transactions</div>
            <div className="card-value">{filteredTransactions.length}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Type</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="ALL">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Category</label>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Sort By</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="amount-desc">Amount (High to Low)</option>
            <option value="amount-asc">Amount (Low to High)</option>
          </select>
        </div>
        <div className="filter-group search-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="transactions-table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading transactions...</p>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>
                    {new Date(transaction.transactionDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td>
                    <div className="transaction-title-cell">
                      <strong>{transaction.title}</strong>
                      {transaction.description && (
                        <div className="transaction-description">{transaction.description}</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">{transaction.category}</span>
                  </td>
                  <td>
                    <span className={`type-badge ${transaction.type.toLowerCase()}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className={`amount ${transaction.type.toLowerCase()}`}>
                    {transaction.type === 'EXPENSE' ? '-' : '+'}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => openEditModal(transaction)}
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(transaction.id)}
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-transactions">
            <span className="empty-icon">📊</span>
            <h3>No transactions found</h3>
            <p>Try adjusting your filters or add your first transaction</p>
            <button className="add-transaction-btn" onClick={openAddModal}>
              <i className="fas fa-plus"></i> Add Transaction
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Transaction Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content transaction-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="transaction-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="type">Type *</label>
                  <select
                    id="type"
                    name="type"
                    value={transactionForm.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="amount">Amount ($) *</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={transactionForm.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={transactionForm.title}
                  onChange={handleInputChange}
                  placeholder="Transaction title"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={transactionForm.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {getCategoryOptions().map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={transactionForm.description}
                  onChange={handleInputChange}
                  placeholder="Additional details..."
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label htmlFor="transactionDate">Date *</label>
                <input
                  type="date"
                  id="transactionDate"
                  name="transactionDate"
                  value={transactionForm.transactionDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Saving...' : (editingTransaction ? 'Update Transaction' : 'Add Transaction')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
