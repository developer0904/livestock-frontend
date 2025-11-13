import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';

export default function Settings() {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage your application preferences and configurations
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          General Settings
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Settings configuration coming soon...
        </Typography>
      </Paper>
    </Box>
  );
}
