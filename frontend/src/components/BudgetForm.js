import React, { useState } from 'react';

const BudgetForm = ({ onBudgetAdded }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('monthly');
  const [categoryId, setCategoryId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!name || !amount || !categoryId || !startDate || !endDate) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const budgetData = {
        name,
        amount: parseFloat(amount),
        period,
        categoryId: parseInt(categoryId),
        startDate,
        endDate
      };

      // In a real app, this would be an API call
      // For now, we'll simulate it
      console.log('Budget data:', budgetData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the callback to notify parent
      onBudgetAdded(budgetData);
      
      // Reset form
      setName('');
      setAmount('');
      setPeriod('monthly');
      setCategoryId('');
      setStartDate('');
      setEndDate('');
      setSuccess('Budget added successfully!');
    } catch (err) {
      setError('Failed to add budget: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Add Budget</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="budget-name">Budget Name:</label>
          <input
            type="text"
            id="budget-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="budget-amount">Amount ($):</label>
          <input
            type="number"
            id="budget-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0.01"
            step="0.01"
          />
        </div>
        
        <div>
          <label htmlFor="budget-period">Period:</label>
          <select
            id="budget-period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            required
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="budget-category">Category ID:</label>
          <input
            type="number"
            id="budget-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            min="1"
          />
        </div>
        
        <div>
          <label htmlFor="budget-start-date">Start Date:</label>
          <input
            type="date"
            id="budget-start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="budget-end-date">End Date:</label>
          <input
            type="date"
            id="budget-end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        
        <button type="submit">Add Budget</button>
      </form>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </div>
  );
};

export default BudgetForm;