import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, LinearProgress, CircularProgress, Skeleton } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6384'];

function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/dashboard/summary')
      .then(r => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ p: 2 }}><Skeleton height={200} /><Skeleton height={200} sx={{ mt: 2 }} /></Box>;
  if (!data) return <Typography color="error">Could not load dashboard data. Is the backend running?</Typography>;

  const accountPieData = data.accounts?.map(a => ({ name: a.name, value: a.balance })) || [];
  const budgetBarData = data.budgets?.map(b => ({ name: b.name, spent: b.spent, allocated: b.amount })) || [];
  const goals = data.goals || [];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>Dashboard</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Total Balance: <strong>${data.total_balance?.toFixed(2) || '0.00'}</strong>
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Account Balances</Typography>
          {accountPieData.length === 0 ? (
            <Typography color="text.secondary">No accounts yet.</Typography>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={accountPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {accountPieData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={v => `$${v.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Budget Progress</Typography>
          {budgetBarData.length === 0 ? (
            <Typography color="text.secondary">No budgets set yet.</Typography>
          ) : (
            budgetBarData.map((b, idx) => {
              const pct = b.allocated > 0 ? Math.min((b.spent / b.allocated) * 100, 100) : 0;
              const color = pct < 75 ? 'success' : pct < 90 ? 'warning' : 'error';
              return (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">{b.name}</Typography>
                    <Typography variant="body2">${b.spent.toFixed(0)} / ${b.allocated.toFixed(0)}</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={pct} color={color} sx={{ height: 10, borderRadius: 5 }} />
                </Box>
              );
            })
          )}
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Savings Goals</Typography>
          {goals.length === 0 ? (
            <Typography color="text.secondary">No savings goals yet.</Typography>
          ) : (
            <Grid container spacing={2}>
              {goals.map((g, idx) => {
                const pct = g.target_amount > 0 ? Math.min((g.current_amount / g.target_amount) * 100, 100) : 0;
                return (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="subtitle1">{g.name}</Typography>
                      <Box sx={{ position: 'relative', display: 'inline-flex', mt: 1 }}>
                        <CircularProgress variant="determinate" value={pct} size={80} thickness={6} />
                        <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="caption">{Math.round(pct)}%</Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        ${g.current_amount?.toFixed(0)} / ${g.target_amount?.toFixed(0)}
                      </Typography>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}

export default DashboardPage;