import React from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import { AccountTransactionList } from './AccountTransactionList';

export interface Account {
  id: number;
  name: string;
  type: 'checking' | 'savings';
  iban: string;
  balance?: number;
}

interface AccountDetailProps {
  account: Account;
}

export function AccountDetail({ account }: AccountDetailProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {account.name}
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography color="textSecondary" variant="body2">
                  Type
                </Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  {account.type}
                </Typography>
              </Box>
              <Box>
                <Typography color="textSecondary" variant="body2">
                  IBAN
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>
                  {account.iban}
                </Typography>
              </Box>
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Typography color="textSecondary" variant="body2">
                  Current Balance
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ color: (account.balance || 0) >= 0 ? 'success.main' : 'error.main' }}
                >
                  ${(account.balance || 0).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <AccountTransactionList accountId={account.id} />
      </Grid>
    </Grid>
  );
}
