import React, { useState, useEffect } from 'react';
import { api } from '../api/client';

const BudgetForm = ({ onBudgetSaved, editBudget, onCancelEdit }) => {
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
      setCategoryId(String(editBudget.category_id));
      setStartDate(editBudget.start_date?.slice(0, 10) || '');
      setEndDate(editBudget.end_date?.slice(0, 10) || '');
    } else {
      setName(''); setAmount(''); setPeriod('monthly');
      setCategoryId(''); setStartDate(''); setEndDate('');
    }
  }, [editBudget]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !amount || !categoryId || !startDate || !endDate) { setError('Fill all fields'); return; }
    const payload = {
      name, amount: parseFloat(amount), period,
      category_id: parseInt(categoryId),
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
    };
    try {
      const result = editBudget
        ? await api.put(`/budgets/${editBudget.id}`, payload)
        : await api.post('/budgets', payload);
      onBudgetSaved(result);
      if (!editBudget) { setName(''); setAmount(''); setPeriod('monthly'); setCategoryId(''); setStartDate(''); setEndDate(''); }
    } catch (err) { setError(err.message); }
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