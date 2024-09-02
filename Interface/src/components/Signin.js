import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';

const Signin = ({ setLoggedInUser, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/signin', { email, password });
            if (response.data.success) {
                // Handle successful sign-in
                setLoggedInUser(response.data.user); // Update loggedInUser state in Navbar component
                onClose(); // Close the sign-in dialog
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.error('Error signing in:', error);
            setErrorMessage('An error occurred during sign-in. Please try again later.');
        }
    };

    return (

    <div>
        <Box display="flex" flexDirection="column" p={2}>
            <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                style={{ marginBottom: '20px'  }}
            />
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            <Button variant="contained"   style={{
    marginBottom: '20px',
    backgroundColor: 'gold', // Set background color to gold
    color: 'black', // Set text color to black
   }} onClick={handleSignIn}>Sign In</Button>
        </Box>
        </div>
    );
};

export default Signin;
