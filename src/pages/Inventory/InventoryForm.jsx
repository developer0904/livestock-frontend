import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
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
import { createInventoryItem, updateInventoryItemData } from '../../store/slices/inventorySlice';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  category: yup.string().required('Category is required'),
  quantity: yup.number().required('Quantity is required').min(0),
  unit: yup.string().required('Unit is required'),
  reorder_level: yup.number().required('Reorder level is required').min(0),
  unit_price: yup.number().required('Unit price is required').min(0),
});

export default function InventoryForm({ open, onClose, item }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    { value: 'feed', label: 'Feed' },
    { value: 'medicine', label: 'Medicine' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'supplement', label: 'Supplement' },
    { value: 'other', label: 'Other' },
  ];

  const units = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'lb', label: 'Pounds (lb)' },
    { value: 'ltr', label: 'Liters (ltr)' },
    { value: 'gal', label: 'Gallons (gal)' },
    { value: 'unit', label: 'Units' },
    { value: 'bag', label: 'Bags' },
    { value: 'bottle', label: 'Bottles' },
  ];

  const formik = useFormik({
    initialValues: {
      name: item?.name || '',
      category: item?.category || '',
      description: item?.description || '',
      sku: item?.sku || '',
      quantity: item?.quantity || '',
      unit: item?.unit || '',
      reorder_level: item?.reorder_level || '',
      unit_price: item?.unit_price || '',
      supplier_name: item?.supplier_name || '',
      supplier_contact: item?.supplier_contact || '',
      last_purchased: item?.last_purchased || '',
      expiry_date: item?.expiry_date || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        // Calculate total_value
        const dataToSend = {
          ...values,
          total_value: parseFloat(values.quantity) * parseFloat(values.unit_price),
        };

        if (item) {
          await dispatch(updateInventoryItemData({ id: item.id, data: dataToSend })).unwrap();
        } else {
          await dispatch(createInventoryItem(dataToSend)).unwrap();
        }
        onClose();
        formik.resetForm();
      } catch (err) {
        setError(err.message || 'Failed to save inventory item');
      } finally {
        setLoading(false);
      }
    },
  });

  const totalValue = (parseFloat(formik.values.quantity) || 0) * (parseFloat(formik.values.unit_price) || 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{item ? 'Edit Inventory Item' : 'Add New Inventory Item'}</DialogTitle>
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
                name="name"
                label="Item Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                name="category"
                label="Category"
                value={formik.values.category}
                onChange={formik.handleChange}
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
                sx={{ minWidth: 160 }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label="Description (Optional)"
                multiline
                rows={2}
                value={formik.values.description}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="sku"
                label="SKU (Optional)"
                value={formik.values.sku}
                onChange={formik.handleChange}
                helperText="Stock Keeping Unit"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                name="unit"
                label="Unit"
                value={formik.values.unit}
                onChange={formik.handleChange}
                error={formik.touched.unit && Boolean(formik.errors.unit)}
                helperText={formik.touched.unit && formik.errors.unit}
                sx={{ minWidth: 160 }}
              >
                {units.map((u) => (
                  <MenuItem key={u.value} value={u.value}>
                    {u.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                name="quantity"
                label="Quantity"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                helperText={formik.touched.quantity && formik.errors.quantity}
                inputProps={{ step: "0.01", min: "0" }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                name="reorder_level"
                label="Reorder Level"
                value={formik.values.reorder_level}
                onChange={formik.handleChange}
                error={formik.touched.reorder_level && Boolean(formik.errors.reorder_level)}
                helperText={formik.touched.reorder_level && formik.errors.reorder_level}
                inputProps={{ step: "0.01", min: "0" }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                name="unit_price"
                label="Unit Price ($)"
                value={formik.values.unit_price}
                onChange={formik.handleChange}
                error={formik.touched.unit_price && Boolean(formik.errors.unit_price)}
                helperText={formik.touched.unit_price && formik.errors.unit_price}
                inputProps={{ step: "0.01", min: "0" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Total Value"
                value={`$${totalValue.toFixed(2)}`}
                disabled
                helperText="Calculated automatically (Quantity × Unit Price)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="supplier_name"
                label="Supplier Name (Optional)"
                value={formik.values.supplier_name}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="supplier_contact"
                label="Supplier Contact (Optional)"
                value={formik.values.supplier_contact}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                name="last_purchased"
                label="Last Purchased (Optional)"
                value={formik.values.last_purchased}
                onChange={formik.handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                name="expiry_date"
                label="Expiry Date (Optional)"
                value={formik.values.expiry_date}
                onChange={formik.handleChange}
                InputLabelProps={{ shrink: true }}
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
            {item ? 'Update' : 'Add'} Item
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
