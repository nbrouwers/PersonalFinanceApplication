import React, { useState, useCallback } from 'react';
import { Typography, Snackbar, Alert, Paper, Box, Button } from '@mui/material';
import BudgetForm from '../components/BudgetForm';
import BudgetAlert from '../components/BudgetAlert';

let nextId = 1;

function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [editBudget, setEditBudget] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const handleAdded = useCallback((budget) => {
    const newBudget = { ...budget, id: nextId++ };
    setBudgets(prev => [...prev, newBudget]);
    setSnack({ open: true, message: `Budget "${budget.name}" created!`, severity: 'success' });
  }, []);

  const handleUpdated = useCallback((updated) => {
    setBudgets(prev => prev.map(b => b.id === updated.id ? updated : b));
    setSnack({ open: true, message: `Budget "${updated.name}" updated!`, severity: 'success' });
  }, []);

  const handleDelete = useCallback((id) => {
    setBudgets(prev => {
      const deleted = prev.find(b => b.id === id);
      if (deleted) setSnack({ open: true, message: `Budget "${deleted.name}" deleted!`, severity: 'info' });
      return prev.filter(b => b.id !== id);
    });
  }, []);

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
      <BudgetForm
        onBudgetAdded={handleAdded}
        onBudgetUpdated={handleUpdated}
        editBudget={editBudget}
        onCancelEdit={() => setEditBudget(null)}
      />
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} sx={{ width: '100%' }}>{snack.message}</Alert>
      </Snackbar>
    </>
  );
}

export default BudgetsPage;