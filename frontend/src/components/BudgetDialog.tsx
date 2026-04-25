import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';

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
  onClose: () => void;
  onSave: (budget: Budget) => void;
}

export function BudgetDialog({ open, budget, onClose, onSave }: BudgetDialogProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [amount, setAmount] = useState<string>('');
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchCategories();
      if (budget) {
        setCategoryId(budget.category_id);
        setAmount(budget.limit_amount.toString());
        setPeriod(budget.period);
      } else {
        setCategoryId(0);
        setAmount('');
        setPeriod('monthly');
      }
    }
  }, [open, budget]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/v1/categories?type=expense');
      const data = await response.json();
      setCategories(data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{budget ? 'Edit Budget' : 'Create Budget'}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryId}
            label="Category"
            onChange={(e) => setCategoryId(e.target.value as number)}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="normal"
          label="Limit Amount"
          type="number"
          fullWidth
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
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