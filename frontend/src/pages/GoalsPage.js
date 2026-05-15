import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Snackbar, Alert, Box, Button } from '@mui/material';
import { api } from '../api/client';
import GoalForm from '../components/GoalForm';

function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [editGoal, setEditGoal] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const fetchGoals = useCallback(async () => {
    try { setGoals(await api.get('/goals')); } catch { setGoals([]); }
  }, []);

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  const show = (msg, sev) => setSnack({ open: true, message: msg, severity: sev });

  const handleSaved = useCallback((goal) => {
    fetchGoals();
    show(`Goal "${goal.name}" ${editGoal ? 'updated' : 'created'}!`, 'success');
    setEditGoal(null);
  }, [fetchGoals, editGoal]);

  const handleDelete = useCallback(async (id) => {
    const g = goals.find(g => g.id === id);
    try {
      await api.del(`/goals/${id}`);
      fetchGoals();
      show(`Goal "${g?.name}" deleted!`, 'info');
    } catch (err) { show(err.message, 'error'); }
  }, [goals, fetchGoals]);

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
                ${g.target_amount} by {g.target_date?.slice(0, 10) || 'no date'} {g.description ? `— ${g.description}` : ''}
              </Typography>
            </Box>
            <Button size="small" onClick={() => setEditGoal(g)}>Edit</Button>
            <Button size="small" color="error" onClick={() => handleDelete(g.id)}>Delete</Button>
          </Box>
        ))
      )}
      <GoalForm onGoalSaved={handleSaved} editGoal={editGoal} onCancelEdit={() => setEditGoal(null)} />
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </>
  );
}

export default GoalsPage;