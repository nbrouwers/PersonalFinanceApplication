import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, Pagination, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';

interface Transaction {
  id: number;
  account_id: number;
  category_id: number;
  category_name: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  date: string;
  currency: string;
}

interface TransactionListProps {
  onEdit: (transaction: Transaction) => void;
}

export function TransactionList({ onEdit }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', categoryId: '', type: '' });

  useEffect(() => {
    fetchTransactions();
  }, [page, filters]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: '20' });
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.type) params.append('type', filters.type);

      const response = await fetch(`/api/v1/transactions?${params}`);
      const data = await response.json();
      setTransactions(data.transactions || []);
      setTotalPages(Math.ceil((data.total || 0) / 20));
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      await fetch(`/api/v1/transactions/${id}`, { method: 'DELETE' });
      fetchTransactions();
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Start Date"
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <TextField
          label="End Date"
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filters.type}
            label="Type"
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{tx.date}</TableCell>
                <TableCell>{tx.description}</TableCell>
                <TableCell>
                  <Chip label={tx.category_name || 'Uncategorized'} size="small" />
                </TableCell>
                <TableCell align="right" sx={{ color: tx.type === 'income' ? 'success.main' : 'error.main' }}>
                  {tx.type === 'income' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => onEdit(tx)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(tx.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="text.secondary">No transactions found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} />
      </Box>
    </Box>
  );
}

export default TransactionList;