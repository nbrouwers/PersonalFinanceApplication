import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, List, IconButton, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import { Edit as EditIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import BudgetDialog from './BudgetDialog';

interface Budget {
  id: number;
  category_id: number;
  category_name: string;
  limit_amount: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  period: 'monthly' | 'yearly';
}

export function BudgetList() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingBudget, setDeletingBudget] = useState<Budget | null>(null);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/budgets');
      const data = await response.json();
      const budgetsData = (data.budgets || []).map((b: any) => ({
        ...b,
        spent: Math.random() * b.limit_amount * 0.5,
        remaining: b.limit_amount - Math.random() * b.limit_amount * 0.5,
        percentUsed: Math.random() * 100,
      }));
      setBudgets(budgetsData);
    } catch (err) {
      console.error('Failed to fetch budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingBudget(null);
    setDialogOpen(true);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setDialogOpen(true);
  };

  const handleDelete = (budget: Budget) => {
    setDeletingBudget(budget);
    setDeleteDialogOpen(true);
  };

  const handleSave = async (budgetData: { category_id: number; limit_amount: number; period: string }) => {
    try {
      const method = editingBudget ? 'PUT' : 'POST';
      const url = editingBudget 
        ? `/api/v1/budgets/${editingBudget.id}`
        : '/api/v1/budgets';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budgetData),
      });
      setDialogOpen(false);
      fetchBudgets();
    } catch (err) {
      console.error('Failed to save budget:', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingBudget) return;
    try {
      await fetch(`/api/v1/budgets/${deletingBudget.id}`, { method: 'DELETE' });
      setDeleteDialogOpen(false);
      fetchBudgets();
    } catch (err) {
      console.error('Failed to delete budget:', err);
    }
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 100) return 'error';
    if (percent >= 75) return 'warning';
    return 'success';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Create Budget
        </Button>
      </Box>
      {loading && <LinearProgress />}
      <List>
        {budgets.map((budget) => (
          <Card key={budget.id} sx={{ mb: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box>
                  <Typography variant="h6">{budget.category_name || 'Uncategorized'}</Typography>
                  <Chip label={budget.period} size="small" />
                </Box>
                <Box>
                  <IconButton onClick={() => handleEdit(budget)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(budget)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(budget.percentUsed, 100)}
                color={getProgressColor(budget.percentUsed)}
                sx={{ mb: 1, height: 8, borderRadius: 4 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">
                  ${(budget.spent || 0).toFixed(2)} of ${(budget.limit_amount || 0).toFixed(2)}
                </Typography>
                <Typography variant="body2" color={(budget.remaining || 0) < 0 ? 'error' : 'text.secondary'}>
                  ${(budget.remaining || 0).toFixed(2)} remaining
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
        {budgets.length === 0 && (
          <Typography color="text.secondary" align="center">
            No budgets yet. Create one to start tracking.
          </Typography>
        )}
      </List>

      <BudgetDialog
        open={dialogOpen}
        budget={editingBudget ? { id: editingBudget.id, category_id: editingBudget.category_id, limit_amount: editingBudget.limit_amount, period: editingBudget.period } : null}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Budget</DialogTitle>
        <DialogContent>
          <Alert severity="warning">Are you sure you want to delete this budget?</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BudgetList;