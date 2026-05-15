import React from 'react';
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material';
import AccountForm from './components/AccountForm';
import AccountList from './components/AccountList';
import TransactionForm from './components/TransactionForm';
import CsvUpload from './components/CsvUpload';
import BudgetForm from './components/BudgetForm';
import BudgetAlert from './components/BudgetAlert';
import GoalForm from './components/GoalForm';

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            Personal Finance App
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <AccountList />
        <AccountForm />
        <TransactionForm />
        <CsvUpload />
        <BudgetForm />
        <GoalForm />
      </Container>
    </Box>
  );
}

export default App;