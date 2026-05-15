import React from 'react';
import { formatEuro } from '../utils/format';

const AccountList = ({ accounts, onEdit, onDelete }) => {
  if (accounts.length === 0) return <p>No accounts found.</p>;

  return (
    <div>
      <h2>Accounts</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc, index) => (
            <tr key={acc.id || index}>
              <td>{acc.name}</td>
              <td>{acc.accountType || acc.account_type}</td>
              <td>{formatEuro(acc.balance)}</td>
              <td>
                <button onClick={() => onEdit(acc)}>Edit</button>
                <button onClick={() => onDelete(acc.id || index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountList;