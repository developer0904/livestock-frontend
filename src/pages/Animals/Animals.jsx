import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { fetchAnimals, deleteAnimalData } from '../../store/slices/animalsSlice';
import { fetchOwners } from '../../store/slices/ownersSlice';
import AnimalForm from './AnimalForm';

export default function Animals() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { animals, loading, error } = useSelector((state) => state.animals);
  const { owners } = useSelector((state) => state.owners);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchAnimals());
    dispatch(fetchOwners());
  }, [dispatch]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch =
      (animal.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (animal.tag_id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (animal.breed?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesType = !filterType || animal.species === filterType;
    const matchesStatus = !filterStatus || animal.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAdd = () => {
    setSelectedAnimal(null);
    setOpenDialog(true);
  };

  const handleEdit = (animal) => {
    setSelectedAnimal(animal);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteAnimalData(id)).unwrap();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete animal:', err);
    }
  };

  const handleView = (id) => {
    navigate(`/animals/${id}`);
  };

  const getOwnerName = (ownerId) => {
    const owner = owners.find((o) => o.id === ownerId);
    return owner ? (owner.full_name || `${owner.first_name} ${owner.last_name}`) : 'Unknown';
  };

  const getHealthStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
        return 'success';
      case 'sick':
      case 'under treatment':
        return 'warning';
      case 'critical':
      case 'deceased':
        return 'error';
      case 'pregnant':
        return 'info';
      case 'sold':
        return 'default';
      default:
        return 'default';
    }
  };

  if (loading && animals.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Animal Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your livestock inventory ({animals.length} animals)
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          size="large"
        >
          Add Animal
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center" wrap="wrap">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                placeholder="Search by name, ID, or breed..."
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
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth sx={{ minWidth: 160 }}>
                <InputLabel>Species</InputLabel>
                <Select
                  value={filterType}
                  label="Species"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="">All Species</MenuItem>
                  <MenuItem value="cattle">Cattle</MenuItem>
                  <MenuItem value="sheep">Sheep</MenuItem>
                  <MenuItem value="goat">Goat</MenuItem>
                  <MenuItem value="pig">Pig</MenuItem>
                  <MenuItem value="poultry">Poultry</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth sx={{ minWidth: 160 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="healthy">Healthy</MenuItem>
                  <MenuItem value="sick">Sick</MenuItem>
                  <MenuItem value="pregnant">Pregnant</MenuItem>
                  <MenuItem value="sold">Sold</MenuItem>
                  <MenuItem value="deceased">Deceased</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="body2" color="text.secondary">
                {filteredAnimals.length} animals found
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Animals Grid */}
      <Grid container spacing={3}>
        {filteredAnimals.map((animal) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={animal.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <CardMedia
                component="img"
                height="200"
                image={animal.image || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400'}
                alt={animal.name || animal.breed}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div" fontWeight="600">
                  {animal.name || animal.breed}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tag ID: {animal.tag_id}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip label={animal.species} size="small" sx={{ mr: 1, mb: 1 }} color="primary" />
                  <Chip
                    label={animal.status}
                    size="small"
                    color={getHealthStatusColor(animal.status)}
                    sx={{ mb: 1 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  <strong>Breed:</strong> {animal.breed}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Age:</strong> {animal.age_months ? Math.floor(animal.age_months / 12) : 'N/A'} years
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Gender:</strong> {animal.gender}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Weight:</strong> {animal.weight} kg
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Owner:</strong> {getOwnerName(animal.owner)}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleView(animal.id)}
                  sx={{ flex: 1 }}
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleEdit(animal)}
                  sx={{ flex: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => setDeleteConfirm(animal.id)}
                  sx={{ flex: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredAnimals.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No animals found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search or filters
          </Typography>
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <AnimalForm
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        animal={selectedAnimal}
      />

      {/* Delete Confirmation */}
      <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this animal? This action cannot be undone.
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
