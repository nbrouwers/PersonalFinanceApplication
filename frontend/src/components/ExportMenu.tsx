import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem, ListItemIcon, ListItemText, Typography, CircularProgress } from '@mui/material';
import { FileDownload, PictureAsPdf, TableChart } from '@mui/icons-material';

export function ExportMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const [exportType, setExportType] = useState<string | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = async (format: 'csv' | 'pdf' | 'json') => {
    setExportType(format);
    setLoading(true);
    handleClose();

    try {
      const endpoint = format === 'csv' ? '/api/v1/export/transactions?format=csv' 
                    : format === 'json' ? '/api/v1/export/transactions?format=json'
                    : '/api/v1/export/transactions?format=json';
      
      const response = await fetch(endpoint);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions.${format === 'pdf' ? 'pdf' : format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        startIcon={loading ? <CircularProgress size={16} /> : <FileDownload />}
        onClick={handleClick}
        disabled={loading}
      >
        Export
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handleExport('csv')}>
          <ListItemIcon><TableChart /></ListItemIcon>
          <ListItemText>CSV</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport('json')}>
          <ListItemIcon><FileDownload /></ListItemIcon>
          <ListItemText>JSON</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default ExportMenu;