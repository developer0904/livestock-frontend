import React, { useEffect, useState } from 'react';
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
  LinearProgress,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Add as AddIcon, Warning as WarningIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { fetchInventory, deleteInventoryItemData } from '../../store/slices/inventorySlice';
import InventoryForm from './InventoryForm';

export default function Inventory() {
  const dispatch = useDispatch();
  const { inventory, loading, error } = useSelector((state) => state.inventory);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const handleAdd = () => {
    setSelectedItem(null);
    setOpenDialog(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteInventoryItemData(id)).unwrap();
      setDeleteConfirm(null);
      dispatch(fetchInventory()); // Refresh the list
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleFormClose = () => {
    setOpenDialog(false);
    dispatch(fetchInventory()); // Refresh the list after form closes
  };

  const getStockLevel = (item) => {
    const percentage = (item.quantity / (item.reorder_level * 2)) * 100;
    return Math.min(percentage, 100);
  };

  const getStockColor = (item) => {
    if (item.quantity <= item.reorder_level) return 'error';
    if (item.quantity <= item.reorder_level * 1.5) return 'warning';
    return 'success';
  };

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
            Inventory Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage feed, medicine, and equipment inventory
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} size="large" onClick={handleAdd}>
          Add Item
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.detail || 'Failed to load inventory'}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Stock Level</TableCell>
              <TableCell>Reorder Level</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Total Value</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography variant="body2" color="text.secondary" py={3}>
                    No inventory items found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              inventory.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {item.is_low_stock && (
                        <WarningIcon color="error" sx={{ mr: 1 }} />
                      )}
                      <Typography fontWeight="500">{item.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={item.category} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    {item.quantity} {item.unit}
                  </TableCell>
                  <TableCell sx={{ minWidth: 150 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={getStockLevel(item)}
                        color={getStockColor(item)}
                        sx={{ flex: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2">{Math.round(getStockLevel(item))}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {item.reorder_level} {item.unit}
                  </TableCell>
                  <TableCell>{item.supplier_name || '-'}</TableCell>
                  <TableCell>${item.unit_price}</TableCell>
                  <TableCell>
                    <Typography fontWeight="600">${item.total_value || (item.quantity * item.unit_price).toFixed(2)}</Typography>
                  </TableCell>
                  <TableCell>
                    {item.expiry_date ? (
                      <Chip
                        label={item.expiry_date}
                        size="small"
                        color={new Date(item.expiry_date) < new Date() ? 'error' : 'default'}
                      />
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="info" onClick={() => handleEdit(item)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => setDeleteConfirm(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Inventory Form Dialog */}
      <InventoryForm 
        open={openDialog} 
        onClose={handleFormClose} 
        item={selectedItem} 
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this inventory item? This action cannot be undone.
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
