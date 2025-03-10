import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert
} from '@mui/material';

const AddDriverModal = ({ open, handleClose, onDriverAdded }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    licenseNumber: '',
    vehicleNumber: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log('Submitting form data:', formData); // Debug log

      const response = await fetch('http://localhost:5000/api/admin/add-driver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          licenseNumber: formData.licenseNumber,
          vehicleNumber: formData.vehicleNumber
        })
      });

      const data = await response.json();
      console.log('Response:', data); // Debug log

      if (data.success) {
        onDriverAdded(data.driver);
        handleClose();
        setFormData({
          username: '',
          email: '',
          password: '',
          phoneNumber: '',
          address: '',
          licenseNumber: '',
          vehicleNumber: ''
        });
      } else {
        setError(data.message || 'Failed to add driver');
      }
    } catch (err) {
      console.error('Error adding driver:', err);
      setError('Failed to add driver. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Driver</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              required
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              required
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              required
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              required
              name="phoneNumber"
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            <TextField
              name="address"
              label="Address"
              multiline
              rows={2}
              value={formData.address}
              onChange={handleChange}
            />
            <TextField
              required
              name="licenseNumber"
              label="License Number"
              value={formData.licenseNumber}
              onChange={handleChange}
            />
            <TextField
              required
              name="vehicleNumber"
              label="Vehicle Number"
              value={formData.vehicleNumber}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">Add Driver</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddDriverModal;