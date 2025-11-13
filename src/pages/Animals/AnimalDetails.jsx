import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Card,
  CardContent,
  Avatar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { fetchAnimalById } from '../../store/slices/animalsSlice';
import { fetchEvents } from '../../store/slices/eventsSlice';
import { fetchOwners } from '../../store/slices/ownersSlice';

export default function AnimalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const animal = useSelector((state) =>
    state.animals.animals.find((a) => a.id === parseInt(id)) || state.animals.selectedAnimal
  );
  const loading = useSelector((state) => state.animals.loading);
  const events = useSelector((state) =>
    state.events.events.filter((e) => e.animal === parseInt(id))
  );
  const owners = useSelector((state) => state.owners.owners);
  const owner = owners.find((o) => o.id === animal?.owner);

  useEffect(() => {
    if (!animal) {
      dispatch(fetchAnimalById(id));
    }
    dispatch(fetchEvents());
    dispatch(fetchOwners());
  }, [dispatch, id, animal]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!animal) {
    return (
      <Box>
        <Typography>Animal not found</Typography>
        <Button onClick={() => navigate('/animals')}>Back to Animals</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/animals')}
        sx={{ mb: 3 }}
      >
        Back to Animals
      </Button>

      <Grid container spacing={3}>
        {/* Animal Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar
                sx={{ width: 200, height: 200, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}
                variant="rounded"
              >
                {animal.name?.[0] || animal.tag_id?.[0] || 'A'}
              </Avatar>
              <Typography variant="h4" fontWeight="bold">
                {animal.name || animal.tag_id}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {animal.breed} • {animal.species}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip 
                  label={animal.health_status} 
                  color={animal.health_status === 'healthy' ? 'success' : 'warning'} 
                  sx={{ mr: 1 }} 
                />
                <Chip label={animal.gender} />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Tag ID:</strong> {animal.tag_id}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Date of Birth:</strong> {animal.date_of_birth}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Weight:</strong> {animal.weight} kg
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Color:</strong> {animal.color || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Location:</strong> {animal.current_location || 'N/A'}
              </Typography>
              {animal.microchip_id && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Microchip ID:</strong> {animal.microchip_id}
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Owner & Events */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Owner Information
            </Typography>
            {owner ? (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">
                  <strong>Name:</strong> {owner.full_name || `${owner.first_name} ${owner.last_name}`}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {owner.email}
                </Typography>
                <Typography variant="body1">
                  <strong>Phone:</strong> {owner.phone}
                </Typography>
                <Typography variant="body1">
                  <strong>Farm:</strong> {owner.farm_name || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>Address:</strong> {owner.address}, {owner.city}, {owner.state}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Owner information not available
              </Typography>
            )}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Event History
            </Typography>
            {events.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No events recorded yet
              </Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Veterinarian</TableCell>
                      <TableCell align="right">Cost</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>
                          <Chip label={event.event_type} size="small" />
                        </TableCell>
                        <TableCell>{event.title}</TableCell>
                        <TableCell>{event.description}</TableCell>
                        <TableCell>{event.veterinarian || '-'}</TableCell>
                        <TableCell align="right">
                          ${event.cost || 0}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
