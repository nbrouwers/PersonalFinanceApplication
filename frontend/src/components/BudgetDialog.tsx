import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, FormControl, InputLabel, Select, Box, IconButton, Grid, Typography, Alert } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface Category {
  id: number;
  name: string;
  type: string;
}

interface Budget {
  id?: number;
  category_id: number;
  limit_amount: number;
  period: 'monthly' | 'yearly';
}

interface BudgetDialogProps {
  open: boolean;
  budget: Budget | null;
  categories: Category[];
  onClose: () => void;
  onSave: (budget: Budget) => void;
  onCategoriesChange?: () => void;
}

export function BudgetDialog({ open, budget, categories, onClose, onSave, onCategoriesChange }: BudgetDialogProps) {
  const [categoryId, setCategoryId] = useState<number>(0);
  const [amount, setAmount] = useState<string>('');
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const [newCategoryMode, setNewCategoryMode] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    if (open) {
      if (budget) {
        setCategoryId(budget.category_id);
        setAmount(budget.limit_amount.toString());
        setPeriod(budget.period);
      } else {
        setCategoryId(0);
        setAmount('');
        setPeriod('monthly');
      }
      setNewCategoryMode(false);
      setNewCategoryName('');
    }
  }, [open, budget]);

  const handleCategoryChange = async (value: unknown) => {
    const numValue = typeof value === 'string' ? parseInt(value) : (value as number);
    if (numValue === -1) {
      setNewCategoryMode(true);
      setCategoryId(0);
    } else {
      setCategoryId(numValue);
      setNewCategoryMode(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('/api/v1/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName, type: 'expense' }),
      });
      const newCategory = await response.json();
      setNewCategoryMode(false);
      setNewCategoryName('');
      setCategoryId(newCategory.id);
      if (onCategoriesChange) onCategoriesChange();
    } catch (err) {
      console.error('Failed to create category:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (catId: number, catName: string) => {
    if (!confirm(`Delete category "${catName}"?`)) return;
    try {
      const res = await fetch(`/api/v1/categories/${catId}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Cannot delete category');
        return;
      }
      if (categoryId === catId) setCategoryId(0);
      if (onCategoriesChange) onCategoriesChange();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleSave = async () => {
    if (!categoryId || !amount) return;
    setLoading(true);
    try {
      await onSave({
        category_id: categoryId,
        limit_amount: parseFloat(amount),
        period,
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((c) => c.type === 'expense');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{budget ? 'Edit Budget' : 'Create Budget'}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Period</InputLabel>
          <Select
            value={period}
            label="Period"
            onChange={(e) => setPeriod(e.target.value as 'monthly' | 'yearly')}
          >
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            value={newCategoryMode ? -1 : categoryId}
            label="Category"
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            {filteredCategories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', minWidth: 200 }}>
                  <span>{cat.name}</span>
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(cat.id, cat.name);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </MenuItem>
            ))}
            <MenuItem value={-1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AddIcon fontSize="small" />
                Create new category
              </Box>
            </MenuItem>
          </Select>
        </FormControl>
        
        {newCategoryMode && (
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <TextField
              fullWidth
              label="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <Button 
              variant="contained" 
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim() || loading}
            >
              Add
            </Button>
          </Box>
        )}
        
        <TextField
          margin="normal"
          label="Budget Limit"
          type="number"
          fullWidth
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={!categoryId || !amount || loading}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BudgetDialog;