import React from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';

export default function Reports() {
  const reportTypes = [
    { title: 'Animal Health Report', description: 'Detailed health status of all animals' },
    { title: 'Ownership Report', description: 'Owner distribution and animal counts' },
    { title: 'Financial Report', description: 'Revenue, costs, and profitability analysis' },
    { title: 'Inventory Report', description: 'Stock levels and reorder requirements' },
    { title: 'Event History Report', description: 'All events and activities timeline' },
    { title: 'Mortality Report', description: 'Death records and causes' },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Reports & Analytics
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Generate comprehensive reports for analysis and compliance
      </Typography>

      <Grid container spacing={3}>
        {reportTypes.map((report, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                {report.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {report.description}
              </Typography>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                fullWidth
              >
                Generate Report
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
