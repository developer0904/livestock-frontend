import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Paper,
  Chip,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  Pets as PetsIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Event as EventIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { fetchAnimals } from '../../store/slices/animalsSlice';
import { fetchOwners } from '../../store/slices/ownersSlice';
import { fetchEvents } from '../../store/slices/eventsSlice';
import { fetchInventory } from '../../store/slices/inventorySlice';

const COLORS = ['#2E7D32', '#FF6F00', '#2196F3', '#F44336', '#9C27B0'];

export default function Dashboard() {
  const dispatch = useDispatch();
  const animals = useSelector((state) => state.animals.animals);
  const animalsLoading = useSelector((state) => state.animals.loading);
  const owners = useSelector((state) => state.owners.owners);
  const events = useSelector((state) => state.events.events);
  const inventory = useSelector((state) => state.inventory.inventory);

  useEffect(() => {
    dispatch(fetchAnimals());
    dispatch(fetchOwners());
    dispatch(fetchEvents());
    dispatch(fetchInventory());
  }, [dispatch]);

  const stats = useMemo(() => {
    const totalAnimals = animals.length;
    const totalOwners = owners.length;
    const totalEvents = events.length;
    const healthyAnimals = animals.filter(a => a.health_status === 'healthy').length;
    const underTreatment = animals.filter(a => a.health_status === 'sick' || a.health_status === 'under_treatment').length;
    const animalsByType = animals.reduce((acc, animal) => {
      const type = animal.species || 'Other';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    const totalInventoryValue = inventory.reduce((sum, item) => {
      return sum + (parseFloat(item.total_value) || (parseFloat(item.quantity) * parseFloat(item.unit_price)));
    }, 0);
    const lowStockItems = inventory.filter(item => item.is_low_stock || item.quantity <= item.reorder_level).length;
    const recentEvents = events.slice(0, 5);
    return {
      totalAnimals,
      totalOwners,
      totalEvents,
      healthyAnimals,
      underTreatment,
      animalsByType,
      totalInventoryValue,
      lowStockItems,
      recentEvents,
    };
  }, [animals, owners, events, inventory]);

  const healthStatusData = [
    { name: 'Healthy', value: stats.healthyAnimals },
    { name: 'Under Treatment', value: stats.underTreatment },
  ];

  const animalTypeData = Object.entries(stats.animalsByType).map(([name, value]) => ({
    name,
    value,
  }));

  const monthlyData = [
    { month: 'Jan', events: 12, cost: 850 },
    { month: 'Feb', events: 15, cost: 1200 },
    { month: 'Mar', events: 18, cost: 1500 },
    { month: 'Apr', events: 14, cost: 900 },
    { month: 'May', events: 20, cost: 1800 },
    { month: 'Jun', events: 16, cost: 1100 },
  ];

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        p: 1,
      }}
    >
      <CardContent sx={{ pb: '16px!important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: color, width: 48, height: 48 }}>{icon}</Avatar>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (animalsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back! Here's what's happening with your livestock today.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} alignItems="stretch" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Animals"
            value={stats.totalAnimals}
            icon={<PetsIcon sx={{ fontSize: 28 }} />}
            color="primary.main"
            subtitle="Active livestock"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Owners"
            value={stats.totalOwners}
            icon={<PeopleIcon sx={{ fontSize: 28 }} />}
            color="secondary.main"
            subtitle="Registered owners"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Recent Events"
            value={stats.totalEvents}
            icon={<EventIcon sx={{ fontSize: 28 }} />}
            color="info.main"
            subtitle="This month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Inventory Value"
            value={`$${stats.totalInventoryValue.toLocaleString()}`}
            icon={<InventoryIcon sx={{ fontSize: 28 }} />}
            color="success.main"
            subtitle={`${stats.lowStockItems} low stock items`}
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400, borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Animal Distribution by Type
            </Typography>
            <Box sx={{ width: '100%', height: 'calc(100% - 40px)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={animalTypeData.length > 0 ? animalTypeData : [{ name: 'No Data', value: 1 }]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {animalTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400, borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Health Status Overview
            </Typography>
            <Box sx={{ width: '100%', height: 'calc(100% - 40px)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={healthStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2E7D32" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Monthly Trends */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, height: 400, borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Monthly Events & Costs
            </Typography>
            <Box sx={{ width: '100%', height: 'calc(100% - 40px)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="events"
                    stroke="#2E7D32"
                    strokeWidth={2}
                    name="Events"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="cost"
                    stroke="#FF6F00"
                    strokeWidth={2}
                    name="Cost ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activity & Alerts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Recent Events
            </Typography>
            <Box sx={{ mt: 2 }}>
              {stats.recentEvents && stats.recentEvents.length > 0 ? (
                stats.recentEvents.map((event, index) => (
                  <Box
                    key={event.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 2,
                      borderBottom: index < stats.recentEvents.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <Box>
                      <Typography variant="body1" fontWeight="500">
                        {event.title || event.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.date} - Animal ID: {event.animal}
                      </Typography>
                    </Box>
                    <Chip label={event.event_type} size="small" color="primary" />
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No recent events
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Active Alerts
            </Typography>
            <Box sx={{ mt: 2 }}>
              {inventory
                .filter((item) => item.is_low_stock || item.quantity <= item.reorder_level)
                .slice(0, 5)
                .map((item, index) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      py: 2,
                      borderBottom: index < 4 ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <WarningIcon color="error" sx={{ mr: 2, mt: 0.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" fontWeight="500">
                        Low Stock Alert
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.name} is running low ({item.quantity} {item.unit} remaining)
                      </Typography>
                    </Box>
                  </Box>
                ))}
              {inventory.filter((item) => item.is_low_stock || item.quantity <= item.reorder_level).length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No active alerts at the moment
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
