import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

export interface Account {
  id: number;
  name: string;
  type: 'checking' | 'savings';
  iban: string;
  balance?: number;
}

interface AccountListProps {
  onAccountSelect?: (account: Account) => void;
}

export function AccountList({ onAccountSelect }: AccountListProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState({ name: '', type: 'checking', iban: '' });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/v1/accounts');
      const data = await response.json();
      
      // Fetch transactions for each account to calculate balance
      const accountsWithBalance = await Promise.all(
        (data || []).map(async (account: Account) => {
          try {
            const txResponse = await fetch(`/api/v1/transactions?accountId=${account.id}&limit=1000`);
            const txData = await txResponse.json();
            const transactions = txData.transactions || [];
            
            // Calculate balance from transactions (sum of amounts)
            const balance = transactions.reduce((sum: number, tx: any) => {
              return sum + (tx.type === 'income' ? tx.amount : -tx.amount);
            }, 0);
            
            return { ...account, balance };
          } catch {
            return account;
          }
        })
      );
      
      setAccounts(accountsWithBalance);
    } catch (err) {
      setError('Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (account?: Account) => {
    if (account) {
      setEditingAccount(account);
      setFormData({ name: account.name, type: account.type, iban: account.iban });
    } else {
      setEditingAccount(null);
      setFormData({ name: '', type: 'checking', iban: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAccount(null);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.iban) {
      setError('Name and IBAN are required');
      return;
    }

    try {
      if (editingAccount) {
        const response = await fetch(`/api/v1/accounts/${editingAccount.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          await fetchAccounts();
        }
      } else {
        const response = await fetch('/api/v1/accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          await fetchAccounts();
        }
      }
      handleCloseDialog();
      setError(null);
    } catch (err) {
      setError('Failed to save account');
    }
  };

  const handleDelete = async (accountId: number) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const response = await fetch(`/api/v1/accounts/${accountId}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchAccounts();
      }
    } catch (err) {
      setError('Failed to delete account');
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Account
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>IBAN</TableCell>
              <TableCell align="right">Balance</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow
                key={account.id}
                onClick={() => onAccountSelect?.(account)}
                sx={{ cursor: onAccountSelect ? 'pointer' : 'default', '&:hover': { bgcolor: 'action.hover' } }}
              >
                <TableCell>{account.name}</TableCell>
                <TableCell>{account.type}</TableCell>
                <TableCell>{account.iban}</TableCell>
                <TableCell align="right">${(account.balance || 0).toFixed(2)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDialog(account);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(account.id);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingAccount ? 'Edit Account' : 'Add Account'}</DialogTitle>
        <DialogContent sx={{ width: 400, pt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'checking' | 'savings' })}
            >
              <MenuItem value="checking">Checking</MenuItem>
              <MenuItem value="savings">Savings</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="IBAN"
            value={formData.iban}
            onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
