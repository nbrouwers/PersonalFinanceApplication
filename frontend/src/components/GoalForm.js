import React, { useState, useEffect } from 'react';
import { api } from '../api/client';

const GoalForm = ({ onGoalSaved, editGoal, onCancelEdit }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editGoal) {
      setName(editGoal.name);
      setTargetAmount(String(editGoal.target_amount));
      setTargetDate(editGoal.target_date?.slice(0, 10) || '');
      setDescription(editGoal.description || '');
    } else {
      setName(''); setTargetAmount(''); setTargetDate(''); setDescription('');
    }
  }, [editGoal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !targetAmount) { setError('Fill in name and target amount'); return; }
    const payload = {
      name, target_amount: parseFloat(targetAmount),
      target_date: targetDate ? new Date(targetDate).toISOString() : null,
      description: description || null,
    };
    try {
      const result = editGoal
        ? await api.put(`/goals/${editGoal.id}`, payload)
        : await api.post('/goals', payload);
      onGoalSaved(result);
      if (!editGoal) { setName(''); setTargetAmount(''); setTargetDate(''); setDescription(''); }
    } catch (err) { setError(err.message); }
  };

  return (
    <div>
      <h2>{editGoal ? 'Edit Goal' : 'Add Savings Goal'}</h2>
      <form onSubmit={handleSubmit}>
        <div><label>Goal Name:</label><input type="text" value={name} onChange={e => setName(e.target.value)} required /></div>
        <div><label>Target Amount ($):</label><input type="number" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} required min="0.01" step="0.01" /></div>
        <div><label>Target Date:</label><input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} /></div>
        <div><label>Description:</label><textarea value={description} onChange={e => setDescription(e.target.value)} /></div>
        <button type="submit">{editGoal ? 'Save Changes' : 'Add Goal'}</button>
        {editGoal && <button type="button" onClick={onCancelEdit}>Cancel</button>}
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default GoalForm;