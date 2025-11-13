import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { fetchEvents, deleteEventData } from '../../store/slices/eventsSlice';
import { fetchAnimals } from '../../store/slices/animalsSlice';
import EventForm from './EventForm';

export default function Events() {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);
  const animals = useSelector((state) => state.animals.animals);
  const [filterType, setFilterType] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchAnimals());
  }, [dispatch]);

  const handleAdd = () => {
    setSelectedEvent(null);
    setOpenDialog(true);
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteEventData(id)).unwrap();
      setDeleteConfirm(null);
      dispatch(fetchEvents()); // Refresh the list
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const handleFormClose = () => {
    setOpenDialog(false);
    dispatch(fetchEvents()); // Refresh the list after form closes
  };

  const filteredEvents = filterType
    ? events.filter((e) => e.event_type === filterType)
    : events;

  const getAnimalName = (animalId) => {
    const animal = animals.find((a) => a.id === animalId);
    return animal ? (animal.name || animal.tag_id) : 'Unknown';
  };

  const eventTypes = [
    { value: 'birth', label: 'Birth' },
    { value: 'death', label: 'Death' },
    { value: 'sale', label: 'Sale' },
    { value: 'purchase', label: 'Purchase' },
    { value: 'vaccination', label: 'Vaccination' },
    { value: 'treatment', label: 'Treatment' },
    { value: 'checkup', label: 'Health Checkup' },
    { value: 'breeding', label: 'Breeding' },
    { value: 'weaning', label: 'Weaning' },
    { value: 'other', label: 'Other' },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Event Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track all animal events and activities
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} size="large" onClick={handleAdd}>
          Add Event
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.detail || 'Failed to load events'}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center" wrap="wrap">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              select
              label="Filter by Type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="">All Types</MenuItem>
              {eventTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Animal</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Veterinarian</TableCell>
              <TableCell align="right">Cost</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2" color="text.secondary" py={3}>
                    No events found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((event) => (
                <TableRow key={event.id} hover>
                  <TableCell>{event.date}</TableCell>
                  <TableCell>{getAnimalName(event.animal)}</TableCell>
                  <TableCell>
                    <Chip label={event.event_type} size="small" color="primary" />
                  </TableCell>
                  <TableCell>{event.title || '-'}</TableCell>
                  <TableCell>{event.description || '-'}</TableCell>
                  <TableCell>{event.veterinarian || '-'}</TableCell>
                  <TableCell align="right">${event.cost || 0}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="info" onClick={() => handleEdit(event)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => setDeleteConfirm(event.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Event Form Dialog */}
      <EventForm 
        open={openDialog} 
        onClose={handleFormClose} 
        event={selectedEvent} 
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this event? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button onClick={() => handleDelete(deleteConfirm)} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
