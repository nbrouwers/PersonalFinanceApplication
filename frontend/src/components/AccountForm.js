import React, { useState, useEffect } from 'react';

const AccountForm = ({ onAccountAdded, onAccountUpdated, editAccount, onCancelEdit }) => {
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState('checking');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editAccount) {
      setName(editAccount.name);
      setAccountType(editAccount.accountType || editAccount.account_type);
      setBalance(String(editAccount.balance));
    } else {
      setName('');
      setAccountType('checking');
      setBalance('');
    }
  }, [editAccount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || balance === '') {
      setError('Please fill in name and balance');
      return;
    }
    const accountData = {
      name,
      accountType,
      balance: parseFloat(balance),
    };
    await new Promise(resolve => setTimeout(resolve, 500));
    if (editAccount) {
      onAccountUpdated({ ...editAccount, ...accountData });
      onCancelEdit();
    } else {
      onAccountAdded(accountData);
      setName('');
      setAccountType('checking');
      setBalance('');
    }
  };

  return (
    <div>
      <h2>{editAccount ? 'Edit Account' : 'Add Account'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Account Name:</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label>Account Type:</label>
          <select value={accountType} onChange={e => setAccountType(e.target.value)} required>
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
            <option value="credit">Credit Card</option>
            <option value="investment">Investment</option>
            <option value="loan">Loan</option>
            <option value="cash">Cash</option>
          </select>
        </div>
        <div>
          <label>Balance ($):</label>
          <input type="number" value={balance} onChange={e => setBalance(e.target.value)} required min="0" step="0.01" />
        </div>
        <button type="submit">{editAccount ? 'Save Changes' : 'Add Account'}</button>
        {editAccount && <button type="button" onClick={onCancelEdit}>Cancel</button>}
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default AccountForm;