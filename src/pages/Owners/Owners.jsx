import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { fetchOwners, deleteOwnerData } from '../../store/slices/ownersSlice';
import OwnerForm from './OwnerForm';

export default function Owners() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { owners, loading, error } = useSelector((state) => state.owners);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    dispatch(fetchOwners());
  }, [dispatch]);

  const handleAdd = () => {
    setSelectedOwner(null);
    setOpenDialog(true);
  };

  const handleEdit = (owner) => {
    setSelectedOwner(owner);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteOwnerData(id)).unwrap();
      setDeleteConfirm(null);
      dispatch(fetchOwners()); // Refresh the list
    } catch (error) {
      console.error('Failed to delete owner:', error);
    }
  };

  const handleFormClose = () => {
    setOpenDialog(false);
    dispatch(fetchOwners()); // Refresh the list after form closes
  };

  const filteredOwners = owners.filter((owner) =>
    owner.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.phone?.includes(searchTerm)
  );

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
            Owner Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage livestock owners and their information
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} size="large" onClick={handleAdd}>
          Add Owner
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.detail || 'Failed to load owners'}
        </Alert>
      )}

      <Paper sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search owners..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Farm Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Total Animals</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOwners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary" py={3}>
                    No owners found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredOwners.map((owner) => (
                <TableRow key={owner.id} hover>
                  <TableCell>
                    <Typography fontWeight="500">{owner.full_name || `${owner.first_name} ${owner.last_name}`}</Typography>
                  </TableCell>
                  <TableCell>
                    {owner.farm_name || '-'}
                  </TableCell>
                  <TableCell>{owner.email}</TableCell>
                  <TableCell>{owner.phone}</TableCell>
                  <TableCell>{owner.animal_count || 0}</TableCell>
                  <TableCell>
                    <Chip
                      label={owner.is_active ? 'Active' : 'Inactive'}
                      size="small"
                      color={owner.is_active ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary" onClick={() => navigate(`/owners/${owner.id}`)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton size="small" color="info" onClick={() => handleEdit(owner)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => setDeleteConfirm(owner.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Owner Form Dialog */}
      <OwnerForm 
        open={openDialog} 
        onClose={handleFormClose} 
        owner={selectedOwner} 
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this owner? This action cannot be undone.
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
