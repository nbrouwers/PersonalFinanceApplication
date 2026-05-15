import React, { useState, useCallback } from 'react';
import { Typography, Snackbar, Alert, Box, Button } from '@mui/material';
import GoalForm from '../components/GoalForm';

let nextId = 1;

function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [editGoal, setEditGoal] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const handleAdded = useCallback((goal) => {
    const newGoal = { ...goal, id: nextId++ };
    setGoals(prev => [...prev, newGoal]);
    setSnack({ open: true, message: `Goal "${goal.name}" added!`, severity: 'success' });
  }, []);

  const handleUpdated = useCallback((updated) => {
    setGoals(prev => prev.map(g => g.id === updated.id ? updated : g));
    setSnack({ open: true, message: `Goal "${updated.name}" updated!`, severity: 'success' });
  }, []);

  const handleDelete = useCallback((id) => {
    setGoals(prev => {
      const deleted = prev.find(g => g.id === id);
      if (deleted) setSnack({ open: true, message: `Goal "${deleted.name}" deleted!`, severity: 'info' });
      return prev.filter(g => g.id !== id);
    });
  }, []);

  return (
    <>
      <Typography variant="h4" gutterBottom>Savings Goals</Typography>
      {goals.length === 0 ? (
        <Typography color="text.secondary">No goals yet.</Typography>
      ) : (
        goals.map(g => (
          <Box key={g.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1">{g.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                ${g.targetAmount} by {g.targetDate || 'no date'} {g.description ? `— ${g.description}` : ''}
              </Typography>
            </Box>
            <Button size="small" onClick={() => setEditGoal(g)}>Edit</Button>
            <Button size="small" color="error" onClick={() => handleDelete(g.id)}>Delete</Button>
          </Box>
        ))
      )}
      <GoalForm
        onGoalAdded={handleAdded}
        onGoalUpdated={handleUpdated}
        editGoal={editGoal}
        onCancelEdit={() => setEditGoal(null)}
      />
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} sx={{ width: '100%' }}>{snack.message}</Alert>
      </Snackbar>
    </>
  );
}

export default GoalsPage;