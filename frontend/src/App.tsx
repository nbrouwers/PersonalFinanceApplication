import React, { useState, useEffect } from 'react';
import { CssBaseline, ThemeProvider, createTheme, Container, Typography, AppBar, Toolbar, Tabs, Tab, Box, Grid, Card, CardContent, Paper } from '@mui/material';
import { AccountBalance, ListAlt, Upload, TrendingUp } from '@mui/icons-material';

import { TransactionList } from './components/TransactionList';
import { BudgetList } from './components/BudgetList';
import { CSVImport } from './components/CSVImport';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5' },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index} role="tabpanel">
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

interface DashboardSummary {
  income: number;
  expense: number;
  net: number;
  savingsRate: number;
}

function App() {
  const [tab, setTab] = useState(0);
  const [summary, setSummary] = useState<DashboardSummary>({ income: 0, expense: 0, net: 0, savingsRate: 0 });

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await fetch('/api/v1/reports/summary?startDate=2026-01-01&endDate=2026-12-31');
      const data = await response.json();
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <AccountBalance sx={{ mr: 2 }} />
          <Typography variant="h6" component="div">
            Personal Finance
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Income</Typography>
                <Typography variant="h4" color="success.main">${summary.income.toFixed(2)}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Expenses</Typography>
                <Typography variant="h4" color="error.main">${summary.expense.toFixed(2)}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Net</Typography>
                <Typography variant="h4" color={summary.net >= 0 ? 'success.main' : 'error.main'}>
                  ${summary.net.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Savings Rate</Typography>
                <Typography variant="h4">{summary.savingsRate.toFixed(1)}%</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
            <Tab icon={<ListAlt />} label="Transactions" />
            <Tab icon={<TrendingUp />} label="Budgets" />
            <Tab icon={<Upload />} label="Import" />
          </Tabs>
        </Paper>

        <TabPanel value={tab} index={0}>
          <TransactionList onEdit={() => {}} />
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <BudgetList onEdit={() => {}} />
        </TabPanel>

        <TabPanel value={tab} index={2}>
          <CSVImport />
        </TabPanel>
      </Container>
    </ThemeProvider>
  );
}

export default App;