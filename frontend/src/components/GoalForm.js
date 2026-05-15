import React, { useState } from 'react';

const GoalForm = ({ onGoalAdded }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!name || !targetAmount) {
      setError('Please fill in name and target amount');
      return;
    }

    try {
      const goalData = {
        name,
        targetAmount: parseFloat(targetAmount),
        targetDate: targetDate || null,
        description: description || null
      };

      // In a real app, this would be an API call
      // For now, we'll simulate it
      console.log('Goal data:', goalData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the callback to notify parent
      onGoalAdded(goalData);
      
      // Reset form
      setName('');
      setTargetAmount('');
      setTargetDate('');
      setDescription('');
      setSuccess('Goal added successfully!');
    } catch (err) {
      setError('Failed to add goal: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Add Savings Goal</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="goal-name">Goal Name:</label>
          <input
            type="text"
            id="goal-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="goal-target-amount">Target Amount ($):</label>
          <input
            type="number"
            id="goal-target-amount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
            min="0.01"
            step="0.01"
          />
        </div>
        
        <div>
          <label htmlFor="goal-target-date">Target Date:</label>
          <input
            type="date"
            id="goal-target-date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="goal-description">Description:</label>
          <textarea
            id="goal-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        
        <button type="submit">Add Goal</button>
      </form>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </div>
  );
};

export default GoalForm;