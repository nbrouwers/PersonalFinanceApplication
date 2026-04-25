import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment } from '@mui/material';

interface Category {
  id: number;
  name: string;
  type: string;
}

interface BudgetFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BudgetFormData) => void;
  initialData?: BudgetFormData;
}

export interface BudgetFormData {
  categoryId?: number;
  limitAmount: number;
  period: 'monthly' | 'yearly';
}

export function BudgetForm({ open, onClose, onSubmit, initialData }: BudgetFormProps) {
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [limitAmount, setLimitAmount] = useState('');
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (open) {
      fetchCategories();
      if (initialData) {
        setCategoryId(initialData.categoryId || '');
        setLimitAmount(initialData.limitAmount.toString());
        setPeriod(initialData.period);
      }
    }
  }, [open]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/v1/categories?type=expense');
      const data = await response.json();
      setCategories(data.filter((c: Category) => c.type === 'expense'));
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleSubmit = () => {
    if (!limitAmount) return;
    onSubmit({
      categoryId: categoryId as number,
      limitAmount: parseFloat(limitAmount),
      period,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Edit Budget' : 'Create Budget'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryId}
              label="Category"
              onChange={(e) => setCategoryId(e.target.value as number)}
            >
              <MenuItem value=""><em>Uncategorized</em></MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            label="Limit Amount"
            type="number"
            value={limitAmount}
            onChange={(e) => setLimitAmount(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            fullWidth
          />
          
          <FormControl fullWidth>
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default BudgetForm;