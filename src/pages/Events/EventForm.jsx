import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Alert,
  CircularProgress,
  Autocomplete,
  Paper,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { createEvent, updateEventData } from '../../store/slices/eventsSlice';

const validationSchema = yup.object({
  event_type: yup.string().required('Event type is required'),
  date: yup.date().required('Date is required'),
  animal: yup.number().required('Animal is required'),
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
});

export default function EventForm({ open, onClose, event }) {
  const dispatch = useDispatch();
  const animals = useSelector((state) => state.animals.animals);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const formik = useFormik({
    initialValues: {
      event_type: event?.event_type || '',
      date: event?.date || new Date().toISOString().split('T')[0],
      time: event?.time || null,
      animal: event?.animal || '',
      title: event?.title || '',
      description: event?.description || '',
      cost: event?.cost || '0',
      veterinarian: event?.veterinarian || '',
      location: event?.location || '',
      notes: event?.notes || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        if (event) {
          await dispatch(updateEventData({ id: event.id, data: values })).unwrap();
        } else {
          await dispatch(createEvent(values)).unwrap();
        }
        onClose();
        formik.resetForm();
      } catch (err) {
        setError(err.message || 'Failed to save event');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{event ? 'Edit Event' : 'Add New Event'}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }} wrap="wrap">
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                name="event_type"
                label="Event Type"
                value={formik.values.event_type}
                onChange={formik.handleChange}
                error={formik.touched.event_type && Boolean(formik.errors.event_type)}
                helperText={formik.touched.event_type && formik.errors.event_type}
                sx={{ minWidth: 160 }}
              >
                {eventTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                name="date"
                label="Date"
                value={formik.values.date}
                onChange={formik.handleChange}
                InputLabelProps={{ shrink: true }}
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="time"
                name="time"
                label="Time (Optional)"
                value={formik.values.time}
                onChange={formik.handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                options={animals}
                getOptionLabel={(option) =>
                  option && (option.name || option.tag_id)
                    ? `${option.name || option.tag_id} - ${option.species} (${option.breed})`
                    : ''
                }
                value={
                  animals.find((a) => a.id === formik.values.animal) || null
                }
                onChange={(_, value) => {
                  formik.setFieldValue('animal', value ? value.id : '');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Animal"
                    name="animal"
                    error={formik.touched.animal && Boolean(formik.errors.animal)}
                    helperText={formik.touched.animal && formik.errors.animal}
                    sx={{ minWidth: 220 }}
                  />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                PaperComponent={(props) => (
                  <Paper {...props} sx={{ minWidth: 320 }} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="title"
                label="Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label="Description"
                multiline
                rows={3}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                name="cost"
                label="Cost ($)"
                value={formik.values.cost}
                onChange={formik.handleChange}
                inputProps={{ step: "0.01", min: "0" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="veterinarian"
                label="Veterinarian (Optional)"
                value={formik.values.veterinarian}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="location"
                label="Location (Optional)"
                value={formik.values.location}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="notes"
                label="Additional Notes (Optional)"
                value={formik.values.notes}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {event ? 'Update' : 'Add'} Event
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
