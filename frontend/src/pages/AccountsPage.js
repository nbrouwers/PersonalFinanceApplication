import React, { useState, useCallback } from 'react';
import { Typography, Snackbar, Alert } from '@mui/material';
import AccountForm from '../components/AccountForm';
import AccountList from '../components/AccountList';

let nextId = 1;

function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [editAccount, setEditAccount] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const handleAdded = useCallback((account) => {
    const newAccount = { ...account, id: nextId++ };
    setAccounts(prev => [...prev, newAccount]);
    setSnack({ open: true, message: `Account "${account.name}" created!`, severity: 'success' });
  }, []);

  const handleUpdated = useCallback((updated) => {
    setAccounts(prev => prev.map(a => a.id === updated.id ? updated : a));
    setSnack({ open: true, message: `Account "${updated.name}" updated!`, severity: 'success' });
  }, []);

  const handleDelete = useCallback((id) => {
    setAccounts(prev => {
      const deleted = prev.find(a => a.id === id);
      if (deleted) setSnack({ open: true, message: `Account "${deleted.name}" deleted!`, severity: 'info' });
      return prev.filter(a => a.id !== id);
    });
  }, []);

  return (
    <>
      <Typography variant="h4" gutterBottom>Accounts</Typography>
      <AccountList accounts={accounts} onEdit={setEditAccount} onDelete={handleDelete} />
      <AccountForm
        onAccountAdded={handleAdded}
        onAccountUpdated={handleUpdated}
        editAccount={editAccount}
        onCancelEdit={() => setEditAccount(null)}
      />
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} sx={{ width: '100%' }}>{snack.message}</Alert>
      </Snackbar>
    </>
  );
}

export default AccountsPage;