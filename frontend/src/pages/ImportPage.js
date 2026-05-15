import React from 'react';
import { Typography } from '@mui/material';
import CsvUpload from '../components/CsvUpload';

function ImportPage() {
  return (
    <>
      <Typography variant="h4" gutterBottom>Import CSV</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Upload a CSV file containing your bank transactions. Expected format: date, description, amount, account_name (optional), category_name (optional).
      </Typography>
      <CsvUpload />
    </>
  );
}

export default ImportPage;