import React, { useState } from 'react';

const TransactionForm = ({ onTransactionAdded }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionType, setTransactionType] = useState('expense');
  const [date, setDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!amount || !description || !date || !categoryId || !accountId) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const transactionData = {
        amount: parseFloat(amount),
        description,
        transactionType,
        date,
        categoryId: parseInt(categoryId),
        accountId: parseInt(accountId)
      };

      // In a real app, this would be an API call
      // For now, we'll simulate it
      console.log('Transaction data:', transactionData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the callback to notify parent
      onTransactionAdded(transactionData);
      
      // Reset form
      setAmount('');
      setDescription('');
      setTransactionType('expense');
      setDate('');
      setCategoryId('');
      setAccountId('');
      setSuccess('Transaction added successfully!');
    } catch (err) {
      setError('Failed to add transaction: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="transaction-amount">Amount ($):</label>
          <input
            type="number"
            id="transaction-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0.01"
            step="0.01"
          />
        </div>
        
        <div>
          <label htmlFor="transaction-description">Description:</label>
          <input
            type="text"
            id="transaction-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="transaction-type">Type:</label>
          <select
            id="transaction-type"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="transaction-date">Date:</label>
          <input
            type="date"
            id="transaction-date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="transaction-category">Category ID:</label>
          <input
            type="number"
            id="transaction-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            min="1"
          />
        </div>
        
        <div>
          <label htmlFor="transaction-account">Account ID:</label>
          <input
            type="number"
            id="transaction-account"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            required
            min="1"
          />
        </div>
        
        <button type="submit">Add Transaction</button>
      </form>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </div>
  );
};

export default TransactionForm;