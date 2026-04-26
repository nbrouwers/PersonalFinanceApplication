import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  CircularProgress,
  Pagination,
  Button,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

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

interface AccountTransactionListProps {
  accountId: number;
}

export function AccountTransactionList({ accountId }: AccountTransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchTransactions();
  }, [accountId]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, searchDate]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/transactions?limit=1000&accountId=${accountId}`);
      const data = await response.json();
      setTransactions(data.transactions || []);
      setPage(1);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (tx) =>
          tx.description.toLowerCase().includes(term) ||
          tx.category_name?.toLowerCase().includes(term)
      );
    }

    if (searchDate) {
      filtered = filtered.filter((tx) => tx.date.includes(searchDate));
    }

    setFilteredTransactions(filtered);
    setPage(1);
  };

  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Transactions ({filteredTransactions.length})
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          placeholder="Search by description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startAdornment={<SearchIcon sx={{ mr: 1, color: 'action.active' }} />}
          size="small"
          sx={{ flex: 1 }}
        />
        <TextField
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTransactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                <TableCell>{tx.description}</TableCell>
                <TableCell>{tx.category_name || '-'}</TableCell>
                <TableCell
                  align="right"
                  sx={{ color: tx.type === 'income' ? 'success.main' : 'error.main' }}
                >
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, p) => setPage(p)}
          />
        </Box>
      )}

      {filteredTransactions.length === 0 && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          No transactions found
        </Typography>
      )}
    </Box>
  );
}
