import React, { useState, useEffect } from 'react';

const BudgetForm = ({ onBudgetAdded, onBudgetUpdated, editBudget, onCancelEdit }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('monthly');
  const [categoryId, setCategoryId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editBudget) {
      setName(editBudget.name);
      setAmount(String(editBudget.amount));
      setPeriod(editBudget.period);
      setCategoryId(String(editBudget.categoryId || ''));
      setStartDate(editBudget.startDate || '');
      setEndDate(editBudget.endDate || '');
    } else {
      setName(''); setAmount(''); setPeriod('monthly');
      setCategoryId(''); setStartDate(''); setEndDate('');
    }
  }, [editBudget]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !amount || !categoryId || !startDate || !endDate) {
      setError('Please fill in all fields');
      return;
    }
    const data = { name, amount: parseFloat(amount), period, categoryId: parseInt(categoryId), startDate, endDate };
    await new Promise(resolve => setTimeout(resolve, 500));
    if (editBudget) {
      onBudgetUpdated({ ...editBudget, ...data });
      onCancelEdit();
    } else {
      onBudgetAdded(data);
      setName(''); setAmount(''); setPeriod('monthly');
      setCategoryId(''); setStartDate(''); setEndDate('');
    }
  };

  return (
    <div>
      <h2>{editBudget ? 'Edit Budget' : 'Add Budget'}</h2>
      <form onSubmit={handleSubmit}>
        <div><label>Name:</label><input type="text" value={name} onChange={e => setName(e.target.value)} required /></div>
        <div><label>Amount ($):</label><input type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="0.01" step="0.01" /></div>
        <div><label>Period:</label>
          <select value={period} onChange={e => setPeriod(e.target.value)} required>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div><label>Category ID:</label><input type="number" value={categoryId} onChange={e => setCategoryId(e.target.value)} required min="1" /></div>
        <div><label>Start:</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required /></div>
        <div><label>End:</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required /></div>
        <button type="submit">{editBudget ? 'Save Changes' : 'Add Budget'}</button>
        {editBudget && <button type="button" onClick={onCancelEdit}>Cancel</button>}
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default BudgetForm;