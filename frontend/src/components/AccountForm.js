import React, { useState } from 'react';

const AccountForm = ({ onAccountAdded }) => {
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState('checking');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!name || balance === '') {
      setError('Please fill in name and balance');
      return;
    }

    try {
      const accountData = {
        name,
        accountType,
        balance: parseFloat(balance)
      };

      // In a real app, this would be an API call
      // For now, we'll simulate it
      console.log('Account data:', accountData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the callback to notify parent
      onAccountAdded(accountData);
      
      // Reset form
      setName('');
      setAccountType('checking');
      setBalance('');
      setSuccess('Account added successfully!');
    } catch (err) {
      setError('Failed to add account: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Add Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="account-name">Account Name:</label>
          <input
            type="text"
            id="account-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="account-type">Account Type:</label>
          <select
            id="account-type"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            required
          >
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
            <option value="credit">Credit Card</option>
            <option value="investment">Investment</option>
            <option value="loan">Loan</option>
            <option value="cash">Cash</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="account-balance">Initial Balance ($):</label>
          <input
            type="number"
            id="account-balance"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            required
            min="0"
            step="0.01"
          />
        </div>
        
        <button type="submit">Add Account</button>
      </form>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </div>
  );
};

export default AccountForm;