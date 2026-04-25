import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, List, ListItem, ListItemText, Chip, IconButton } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

interface Budget {
  id: number;
  category_name: string;
  limit_amount: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  period: 'monthly' | 'yearly';
}

interface BudgetListProps {
  onEdit: (budget: Budget) => void;
}

export function BudgetList({ onEdit }: BudgetListProps) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/budgets');
      const data = await response.json();
      setBudgets(data || []);
    } catch (err) {
      console.error('Failed to fetch budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 100) return 'error';
    if (percent >= 75) return 'warning';
    return 'success';
  };

  return (
    <Box>
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
                <IconButton onClick={() => onEdit(budget)}>
                  <EditIcon />
                </IconButton>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(budget.percentUsed, 100)}
                color={getProgressColor(budget.percentUsed)}
                sx={{ mb: 1, height: 8, borderRadius: 4 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">
                  ${budget.spent.toFixed(2)} of ${budget.limit_amount.toFixed(2)}
                </Typography>
                <Typography variant="body2" color={budget.remaining < 0 ? 'error' : 'text.secondary'}>
                  ${budget.remaining.toFixed(2)} remaining
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
    </Box>
  );
}

export default BudgetList;