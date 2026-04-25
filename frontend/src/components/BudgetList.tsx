import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, List, IconButton, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Grid } from '@mui/material';
import { Edit as EditIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import BudgetDialog from './BudgetDialog';

interface Category {
  id: number;
  name: string;
  type: string;
}

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingBudget, setDeletingBudget] = useState<Budget | null>(null);

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, [period]);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/budgets?period=${period}`);
      const data = await response.json();
      setBudgets(data.budgets || []);
    } catch (err) {
      console.error('Failed to fetch budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/v1/categories');
      const data = await response.json();
      setCategories(data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip 
            label="Monthly" 
            onClick={() => setPeriod('monthly')} 
            color={period === 'monthly' ? 'primary' : 'default'} 
            variant={period === 'monthly' ? 'filled' : 'outlined'} 
          />
          <Chip 
            label="Yearly" 
            onClick={() => setPeriod('yearly')} 
            color={period === 'yearly' ? 'primary' : 'default'}
            variant={period === 'yearly' ? 'filled' : 'outlined'}
          />
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Create Budget
        </Button>
      </Box>
      
      {loading && <LinearProgress />}
      
      <Grid container spacing={2}>
        {budgets.map((budget) => (
          <Grid item xs={12} sm={6} md={4} key={budget.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6">{budget.category_name || 'Uncategorized'}</Typography>
                  <Box>
                    <IconButton onClick={() => handleEdit(budget)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(budget)} color="error" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary">{budget.period}</Typography>
                <Box sx={{ mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(budget.percentUsed, 100)}
                    color={getProgressColor(budget.percentUsed)}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2">
                    ${budget.spent.toFixed(0)} / ${budget.limit_amount.toFixed(0)}
                  </Typography>
                  <Typography variant="body2" color={budget.remaining < 0 ? 'error' : 'text.secondary'}>
                    ${budget.remaining.toFixed(0)} left
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {budgets.length === 0 && !loading && (
        <Alert severity="info">
          No {period} budgets. Create one to track your spending.
        </Alert>
      )}

      <BudgetDialog
        open={dialogOpen}
        budget={editingBudget ? { id: editingBudget.id, category_id: editingBudget.category_id, limit_amount: editingBudget.limit_amount, period: editingBudget.period } : null}
        categories={categories}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        onCategoriesChange={fetchCategories}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Budget</DialogTitle>
        <DialogContent>
          <Alert severity="warning">
            Are you sure you want to delete this budget for "{deletingBudget?.category_name}"?
          </Alert>
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