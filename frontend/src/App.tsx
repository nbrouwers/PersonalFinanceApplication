import React from 'react';
import { CssBaseline, ThemeProvider, createTheme, Container, Typography, AppBar, Toolbar } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" component="div">
            Personal Finance
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome
        </Typography>
        <Typography variant="body1">
          Your personal finance application is initializing.
        </Typography>
      </Container>
    </ThemeProvider>
  );
}

export default App;