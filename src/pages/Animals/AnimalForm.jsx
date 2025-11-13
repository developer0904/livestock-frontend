import React, { useState, useMemo } from 'react';
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
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { createAnimal, updateAnimalData } from '../../store/slices/animalsSlice';

const validationSchema = yup.object({
  tag_id: yup.string().required('Tag ID is required'),
  species: yup.string().required('Species is required'),
  breed: yup.string().required('Breed is required'),
  gender: yup.string().required('Gender is required'),
  date_of_birth: yup.date().required('Date of birth is required'),
  weight: yup.number().required('Weight is required').positive(),
  owner: yup.number().required('Owner is required'),
  acquisition_date: yup.date().required('Acquisition date is required'),
  acquisition_price: yup.number().required('Price is required').positive(),
});

export default function AnimalForm({ open, onClose, animal }) {
  const dispatch = useDispatch();
  const owners = useSelector((state) => state.owners.owners);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate tag_id only once when component mounts or animal changes
  const defaultTagId = useMemo(() => `A${Date.now()}`, [animal?.id]);

  const formik = useFormik({
    initialValues: {
      name: animal?.name || '',
      tag_id: animal?.tag_id || defaultTagId,
      species: animal?.species || '',
      breed: animal?.breed || '',
      gender: animal?.gender || '',
      date_of_birth: animal?.date_of_birth || '',
      weight: animal?.weight || '',
      color: animal?.color || '',
      status: animal?.status || 'healthy',
      owner: animal?.owner || '',
      acquisition_date: animal?.acquisition_date || new Date().toISOString().split('T')[0],
      acquisition_price: animal?.acquisition_price || '',
      health_notes: animal?.health_notes || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        if (animal) {
          await dispatch(updateAnimalData({ id: animal.id, data: values })).unwrap();
        } else {
          await dispatch(createAnimal(values)).unwrap();
        }
        onClose();
        formik.resetForm();
      } catch (err) {
        setError(err.message || 'Failed to save animal');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{animal ? 'Edit Animal' : 'Add New Animal'}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }} wrap="wrap">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="tag_id"
                label="Tag ID"
                value={formik.values.tag_id}
                onChange={formik.handleChange}
                error={formik.touched.tag_id && Boolean(formik.errors.tag_id)}
                helperText={formik.touched.tag_id && formik.errors.tag_id}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="name"
                label="Animal Name (Optional)"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                name="species"
                label="Species"
                value={formik.values.species}
                onChange={formik.handleChange}
                error={formik.touched.species && Boolean(formik.errors.species)}
                helperText={formik.touched.species && formik.errors.species}
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="cattle">Cattle</MenuItem>
                <MenuItem value="sheep">Sheep</MenuItem>
                <MenuItem value="goat">Goat</MenuItem>
                <MenuItem value="pig">Pig</MenuItem>
                <MenuItem value="poultry">Poultry</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="breed"
                label="Breed"
                value={formik.values.breed}
                onChange={formik.handleChange}
                error={formik.touched.breed && Boolean(formik.errors.breed)}
                helperText={formik.touched.breed && formik.errors.breed}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                name="gender"
                label="Gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                error={formik.touched.gender && Boolean(formik.errors.gender)}
                helperText={formik.touched.gender && formik.errors.gender}
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                name="date_of_birth"
                label="Date of Birth"
                value={formik.values.date_of_birth}
                onChange={formik.handleChange}
                error={formik.touched.date_of_birth && Boolean(formik.errors.date_of_birth)}
                helperText={formik.touched.date_of_birth && formik.errors.date_of_birth}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                name="weight"
                label="Weight (kg)"
                value={formik.values.weight}
                onChange={formik.handleChange}
                error={formik.touched.weight && Boolean(formik.errors.weight)}
                helperText={formik.touched.weight && formik.errors.weight}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="color"
                label="Color"
                value={formik.values.color}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                name="status"
                label="Health Status"
                value={formik.values.status}
                onChange={formik.handleChange}
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="healthy">Healthy</MenuItem>
                <MenuItem value="sick">Sick</MenuItem>
                <MenuItem value="pregnant">Pregnant</MenuItem>
                <MenuItem value="sold">Sold</MenuItem>
                <MenuItem value="deceased">Deceased</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                name="owner"
                label="Owner"
                value={formik.values.owner}
                onChange={formik.handleChange}
                error={formik.touched.owner && Boolean(formik.errors.owner)}
                helperText={formik.touched.owner && formik.errors.owner}
                sx={{ minWidth: 160 }}
              >
                {owners.map((owner) => (
                  <MenuItem key={owner.id} value={owner.id}>
                    {owner.full_name || `${owner.first_name} ${owner.last_name}`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                name="acquisition_date"
                label="Acquisition Date"
                value={formik.values.acquisition_date}
                onChange={formik.handleChange}
                error={formik.touched.acquisition_date && Boolean(formik.errors.acquisition_date)}
                helperText={formik.touched.acquisition_date && formik.errors.acquisition_date}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                name="acquisition_price"
                label="Acquisition Price ($)"
                value={formik.values.acquisition_price}
                onChange={formik.handleChange}
                error={formik.touched.acquisition_price && Boolean(formik.errors.acquisition_price)}
                helperText={formik.touched.acquisition_price && formik.errors.acquisition_price}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="health_notes"
                label="Health Notes"
                value={formik.values.health_notes}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : animal ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
