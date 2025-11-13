import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  Divider,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { getCurrentUser } from '../../store/slices/authSlice';
import {
  PhotoCamera,
  Save,
  Edit,
  Cancel,
} from '@mui/icons-material';
import { profileAPI } from '../../services';

const BACKEND_URL = 'http://localhost:8000';

const Profile = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    bio: '',
    date_of_birth: '',
    gender: '',
    occupation: '',
    organization: '',
    notifications_enabled: true,
    email_notifications: true,
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileAPI.get();
      
      // Merge user and profile data
      const data = {
        username: response.data.username || '',
        email: response.data.email || '',
        first_name: response.data.first_name || '',
        last_name: response.data.last_name || '',
        ...response.data.profile,
      };
      
      setProfileData(data);
      if (response.data.profile?.profile_picture) {
        setProfilePicturePreview(`${BACKEND_URL}${response.data.profile.profile_picture}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      let response;
      const formData = new FormData();
      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== null && profileData[key] !== '' && key !== 'username' && key !== 'profile_picture') {
          formData.append(key, profileData[key]);
        }
      });

      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }
      
      response = await profileAPI.updateWithImage(formData);

      // Update the user data in Redux store
      await dispatch(getCurrentUser());

      setSuccess('Profile updated successfully!');
      setEditing(false);
      setProfilePicture(null);
      
      // Update profile data with response
      const data = {
        username: response.data.data.username || '',
        email: response.data.data.email || '',
        first_name: response.data.data.first_name || '',
        last_name: response.data.data.last_name || '',
        ...response.data.data.profile,
      };
      setProfileData(data);
      
      if (response.data.data.profile?.profile_picture) {
        setProfilePicturePreview(`${BACKEND_URL}${response.data.data.profile.profile_picture}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setProfilePicture(null);
    fetchProfile();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            My Profile
          </Typography>
          {!editing ? (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <Box>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Profile Picture */}
          <Grid item xs={12} display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <Box position="relative">
              <Avatar
                src={profilePicturePreview}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
              {editing && (
                <>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="profile-picture-upload"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="profile-picture-upload">
                    <IconButton
                      color="primary"
                      component="span"
                      sx={{
                        position: 'absolute',
                        bottom: 10,
                        right: 0,
                        backgroundColor: 'white',
                        '&:hover': { backgroundColor: 'grey.100' },
                      }}
                    >
                      <PhotoCamera />
                    </IconButton>
                  </label>
                </>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }}>
              <Typography variant="h6">Personal Information</Typography>
            </Divider>
          </Grid>

          {/* Username (Read-only) */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={profileData.username}
              disabled
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleInputChange}
              disabled={!editing}
            />
          </Grid>

          {/* First Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={profileData.first_name}
              onChange={handleInputChange}
              disabled={!editing}
            />
          </Grid>

          {/* Last Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={profileData.last_name}
              onChange={handleInputChange}
              disabled={!editing}
            />
          </Grid>

          {/* Date of Birth */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              value={profileData.date_of_birth}
              onChange={handleInputChange}
              disabled={!editing}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Gender */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Gender"
              name="gender"
              value={profileData.gender}
              onChange={handleInputChange}
              disabled={!editing}
            >
              <MenuItem value="">Select Gender</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
              <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }}>
              <Typography variant="h6">Contact Information</Typography>
            </Divider>
          </Grid>

          {/* Phone Number */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone_number"
              value={profileData.phone_number}
              onChange={handleInputChange}
              disabled={!editing}
            />
          </Grid>

          {/* Address */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              multiline
              rows={2}
              value={profileData.address}
              onChange={handleInputChange}
              disabled={!editing}
            />
          </Grid>

          {/* City */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={profileData.city}
              onChange={handleInputChange}
              disabled={!editing}
            />
          </Grid>

          {/* State */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="State/Province"
              name="state"
              value={profileData.state}
              onChange={handleInputChange}
              disabled={!editing}
            />
          </Grid>

          {/* Country */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={profileData.country}
              onChange={handleInputChange}
              disabled={!editing}
            />
          </Grid>

          {/* Postal Code */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Postal Code"
              name="postal_code"
              value={profileData.postal_code}
              onChange={handleInputChange}
              disabled={!editing}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }}>
              <Typography variant="h6">Professional Information</Typography>
            </Divider>
          </Grid>

          {/* Occupation */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Occupation"
              name="occupation"
              value={profileData.occupation}
              onChange={handleInputChange}
              disabled={!editing}
            />
          </Grid>

          {/* Organization */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Organization"
              name="organization"
              value={profileData.organization}
              onChange={handleInputChange}
              disabled={!editing}
            />
          </Grid>

          {/* Bio */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              multiline
              rows={4}
              value={profileData.bio}
              onChange={handleInputChange}
              disabled={!editing}
              placeholder="Tell us about yourself..."
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }}>
              <Typography variant="h6">Preferences</Typography>
            </Divider>
          </Grid>

          {/* Notifications */}
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={profileData.notifications_enabled}
                  onChange={handleInputChange}
                  name="notifications_enabled"
                  disabled={!editing}
                />
              }
              label="Enable Notifications"
            />
          </Grid>

          {/* Email Notifications */}
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={profileData.email_notifications}
                  onChange={handleInputChange}
                  name="email_notifications"
                  disabled={!editing}
                />
              }
              label="Enable Email Notifications"
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;
