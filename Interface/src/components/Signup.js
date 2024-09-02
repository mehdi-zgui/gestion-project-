import React, { useState } from 'react';
import { TextField, Button, DialogActions, DialogContent } from '@mui/material';
import axios from 'axios';

const Signup = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        telephone: '',
        fonction: '',
        date_naiss: '',
        address: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/signup', formData);
            if (response.data.success) {
                alert('Signup successful!');
                onClose();
            } else {
                alert('Signup failed: ' + response.data.message);
                
            }
        } catch (error) {
            console.error('There was an error signing up:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="name"
                    label="Name"
                    type="text"
                    fullWidth
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <TextField
                    margin="dense"
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <TextField
                    margin="dense"
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <TextField
                    margin="dense"
                    name="telephone"
                    label="Telephone"
                    type="text"
                    fullWidth
                    value={formData.telephone}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="fonction"
                    label="Fonction"
                    type="text"
                    fullWidth
                    value={formData.fonction}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="date_naiss"
                    label="Date of Birth"
                    type="date"
                    fullWidth
                    value={formData.date_naiss}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    margin="dense"
                    name="address"
                    label="Address"
                    type="text"
                    fullWidth
                    value={formData.address}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}   style={{
    marginBottom: '20px',
    backgroundColor: 'gold', // Set background color to gold
    color: 'black', // Set text color to black
  }} color="primary">
                    Cancel
                </Button>
                <Button   style={{
    marginBottom: '20px',
    backgroundColor: 'gold', // Set background color to gold
    color: 'black', // Set text color to black
  }} type="submit" color="primary">
                    Sign Up
                </Button>
            </DialogActions>
        </form>
    );
};

export default Signup;
