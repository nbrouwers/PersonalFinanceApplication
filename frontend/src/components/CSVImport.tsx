import React, { useState, useRef } from 'react';
import { Box, Button, Typography, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert } from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';

interface ParsedTransaction {
  date: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  currency: string;
  iban?: string;
  creditDebit?: string;
  name?: string;
}

export function CSVImport() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ParsedTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{ success: boolean; count: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setImportResult(null);

    const content = await selectedFile.text();
    setLoading(true);

    try {
      const response = await fetch('/api/v1/import/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvContent: content, userId: 1, accountId: 1 }),
      });
      const data = await response.json();
      setPreview(data.preview || []);
    } catch (err) {
      setError('Failed to parse CSV');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (preview.length === 0) return;

    setLoading(true);
    try {
      const response = await fetch('/api/v1/import/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: preview, userId: 1, accountId: 1 }),
      });
      const data = await response.json();
      setImportResult({ success: true, count: data.importedCount });
      setPreview([]);
    } catch (err) {
      setError('Import failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={() => fileInputRef.current?.click()}
        >
          Select CSV File
        </Button>
        {file && <Typography sx={{ ml: 2, display: 'inline' }}>{file.name}</Typography>}
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {importResult && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Successfully imported {importResult.count} transactions
        </Alert>
      )}

      {preview.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Preview ({preview.length} transactions)
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Account</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Direction</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {preview.map((tx, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{tx.date}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{tx.iban || '-'}</TableCell>
                    <TableCell align="right" sx={{ color: tx.type === 'income' ? 'success.main' : 'error.main' }}>
                      {tx.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{tx.creditDebit || tx.type}</TableCell>
                    <TableCell>{tx.name || '-'}</TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>{tx.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button variant="contained" onClick={handleImport} disabled={loading}>
            Import {preview.length} Transactions
          </Button>
        </>
      )}
    </Box>
  );
}

export default CSVImport;