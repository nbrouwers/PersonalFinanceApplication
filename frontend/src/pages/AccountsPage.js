import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Snackbar, Alert } from '@mui/material';
import { api } from '../api/client';
import AccountForm from '../components/AccountForm';
import AccountList from '../components/AccountList';

function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [editAccount, setEditAccount] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const fetchAccounts = useCallback(async () => {
    try { setAccounts(await api.get('/accounts')); } catch { setAccounts([]); }
  }, []);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

  const show = (msg, sev) => setSnack({ open: true, message: msg, severity: sev });

  const handleSaved = useCallback((account) => {
    fetchAccounts();
    show(`Account "${account.name}" ${editAccount ? 'updated' : 'created'}!`, 'success');
    setEditAccount(null);
  }, [fetchAccounts, editAccount]);

  const handleDelete = useCallback(async (id) => {
    const acct = accounts.find(a => a.id === id);
    try {
      await api.del(`/accounts/${id}`);
      fetchAccounts();
      show(`Account "${acct?.name}" deleted!`, 'info');
    } catch (err) { show(err.message, 'error'); }
  }, [accounts, fetchAccounts]);

  return (
    <>
      <Typography variant="h4" gutterBottom>Accounts</Typography>
      <AccountList accounts={accounts} onEdit={setEditAccount} onDelete={handleDelete} />
      <AccountForm onAccountSaved={handleSaved} editAccount={editAccount} onCancelEdit={() => setEditAccount(null)} />
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </>
  );
}

export default AccountsPage;