import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Snackbar, Alert, Box, Button } from '@mui/material';
import { api } from '../api/client';
import BudgetForm from '../components/BudgetForm';
import BudgetAlert from '../components/BudgetAlert';

function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [editBudget, setEditBudget] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const fetchBudgets = useCallback(async () => {
    try { setBudgets(await api.get('/budgets')); } catch { setBudgets([]); }
  }, []);

  useEffect(() => { fetchBudgets(); }, [fetchBudgets]);

  const show = (msg, sev) => setSnack({ open: true, message: msg, severity: sev });

  const handleSaved = useCallback((budget) => {
    fetchBudgets();
    show(`Budget "${budget.name}" ${editBudget ? 'updated' : 'created'}!`, 'success');
    setEditBudget(null);
  }, [fetchBudgets, editBudget]);

  const handleDelete = useCallback(async (id) => {
    const b = budgets.find(b => b.id === id);
    try {
      await api.del(`/budgets/${id}`);
      fetchBudgets();
      show(`Budget "${b?.name}" deleted!`, 'info');
    } catch (err) { show(err.message, 'error'); }
  }, [budgets, fetchBudgets]);

  return (
    <>
      <Typography variant="h4" gutterBottom>Budgets</Typography>
      {budgets.length === 0 ? (
        <Typography color="text.secondary">No budgets yet.</Typography>
      ) : (
        budgets.map(b => (
          <Box key={b.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Box sx={{ flex: 1 }}>
              <BudgetAlert budget={{ ...b, spent: 0, remaining: b.amount, percentage_used: 0 }} />
            </Box>
            <Button size="small" onClick={() => setEditBudget(b)}>Edit</Button>
            <Button size="small" color="error" onClick={() => handleDelete(b.id)}>Delete</Button>
          </Box>
        ))
      )}
      <BudgetForm onBudgetSaved={handleSaved} editBudget={editBudget} onCancelEdit={() => setEditBudget(null)} />
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </>
  );
}

export default BudgetsPage;