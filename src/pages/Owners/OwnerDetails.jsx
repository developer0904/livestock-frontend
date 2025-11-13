import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { fetchOwnerById } from '../../store/slices/ownersSlice';
import { fetchAnimals } from '../../store/slices/animalsSlice';

export default function OwnerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const owner = useSelector((state) => 
    state.owners.owners.find((o) => o.id === parseInt(id)) || state.owners.selectedOwner
  );
  const loading = useSelector((state) => state.owners.loading);
  const animals = useSelector((state) => state.animals.animals);
  const ownerAnimals = animals.filter((a) => a.owner === parseInt(id));

  useEffect(() => {
    if (!owner) {
      dispatch(fetchOwnerById(id));
    }
    dispatch(fetchAnimals());
  }, [dispatch, id, owner]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!owner) {
    return (
      <Box>
        <Typography>Owner not found</Typography>
        <Button onClick={() => navigate('/owners')}>Back to Owners</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/owners')}
        sx={{ mb: 3 }}
      >
        Back to Owners
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {owner.full_name || `${owner.first_name} ${owner.last_name}`}
        </Typography>
        <Chip 
          label={owner.is_active ? 'Active' : 'Inactive'} 
          color={owner.is_active ? 'success' : 'default'} 
          sx={{ mb: 2 }} 
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography><strong>Farm Name:</strong> {owner.farm_name || 'N/A'}</Typography>
            <Typography><strong>Email:</strong> {owner.email}</Typography>
            <Typography><strong>Phone:</strong> {owner.phone}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography><strong>Farm Size:</strong> {owner.farm_size ? `${owner.farm_size} acres` : 'N/A'}</Typography>
            <Typography><strong>Total Animals:</strong> {owner.animal_count || ownerAnimals.length}</Typography>
            <Typography><strong>Tax ID:</strong> {owner.tax_id || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Address:</strong> {owner.address}, {owner.city}, {owner.state} {owner.zip_code}</Typography>
          </Grid>
          {owner.notes && (
            <Grid item xs={12}>
              <Typography><strong>Notes:</strong> {owner.notes}</Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Owned Animals ({ownerAnimals.length})
      </Typography>
      <Grid container spacing={3}>
        {ownerAnimals.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" align="center" py={3}>
              No animals found for this owner
            </Typography>
          </Grid>
        ) : (
          ownerAnimals.map((animal) => (
            <Grid item xs={12} sm={6} md={4} key={animal.id}>
              <Card onClick={() => navigate(`/animals/${animal.id}`)} sx={{ cursor: 'pointer' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="600">{animal.name || animal.tag_id}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {animal.breed} • {animal.species}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tag: {animal.tag_id}
                  </Typography>
                  <Chip 
                    label={animal.health_status} 
                    size="small" 
                    color={animal.health_status === 'healthy' ? 'success' : 'warning'} 
                    sx={{ mt: 1 }} 
                  />
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}
