import React, { useState, useEffect } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import axios from 'axios';

const Settings = ({ user, onClose }) => {
  // State variables to store user information
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [telephone, setTelephone] = useState(user.telephone || '');
  const [fonction, setFonction] = useState(user.fonction || '');
  const [dateNaiss, setDateNaiss] = useState(user.date_naiss || '');
  const [address, setAddress] = useState(user.address || '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log("User prop received:", user);
    setName(user.name || '');
    setEmail(user.email || '');
    setTelephone(user.telephone || '');
    setFonction(user.fonction || '');
    setDateNaiss(user.date_naiss || '');
    setAddress(user.address || '');
}, [user]); // Add [user] as a dependency

const key = `${user.id}-${user.updatedAt}`;

// Function to handle form submission
const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Check if the user object is available
    if (!user || !user.id_util) {
      console.error('User object or user id is undefined:', user);
      return;
    }
  
    // Validation: Check if required fields are empty
    const errors = {};
    if (!name) errors.name = 'Name is required';
    if (!email) errors.email = 'Email is required';
    if (!telephone) errors.telephone = 'Telephone is required';
    if (!fonction) errors.fonction = 'Fonction is required';
    if (!dateNaiss) errors.dateNaiss = 'Date of Birth is required';
    if (!address) errors.address = 'Address is required';
  
    if (Object.keys(errors).length > 0) {
      // If there are errors, set them in the state to display in the form
      setErrors(errors);
      return;
    }
  
    try {
      // Send updated user data to backend API for updating
      const response = await axios.put(`http://localhost:5000/api/users/${user.id_util}`, {
        id_util: user.id_util, // Include the id_util property
        name,
        email,
        telephone,
        fonction,
        date_naiss: dateNaiss,
        address,
      });
      if (response.status === 200) {
        // Data updated successfully, show success message or navigate to another page
        onClose();
        
      } else {
        // Error updating data, handle accordingly
        console.error('Error updating user data:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };
  

  return (
    <Dialog open={true} key={key} onClose={onClose}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Telephone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            fullWidth
            margin="normal"
            error={!!errors.telephone}
            helperText={errors.telephone}
          />
          <TextField
            label="Fonction"
            value={fonction}
            onChange={(e) => setFonction(e.target.value)}
            fullWidth
            margin="normal"
            error={!!errors.fonction}
            helperText={errors.fonction}
          />
          <TextField
            label="Date of Birth"
            type="date"
            value={dateNaiss}
            onChange={(e) => setDateNaiss(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.dateNaiss}
            helperText={errors.dateNaiss}
          />
          <TextField
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
            margin="normal"
            error={!!errors.address}
            helperText={errors.address}
          />
          <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }}>
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Settings;
