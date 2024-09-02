import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  List,
  Paper,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Divider,
} from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon  from '@mui/icons-material/Save';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({
    name: '',
    email: '',
    password: '',
    telephone: '',
    fonction: '',
    date_naiss: '',
    address: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:5000/api/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error("There was an error fetching the users!", error));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEditClick = (user) => {
    setSelectedUser({ ...user });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser({
      name: '',
      email: '',
      password: '',
      telephone: '',
      fonction: '',
      date_naiss: '',
      address: '',
    });
    setErrors({});
  };

  const handleSubmit = () => {
    if (validateForm()) {
      axios.put(`http://localhost:5000/api/users/${selectedUser.id_util}`, selectedUser, {
        headers: { 'Content-Type': 'application/json' },
      })
        .then(() => {
          fetchUsers(); // Update user list
          handleClose();
        })
        .catch(error => console.error("There was an error updating the user!", error));
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  const handleDelete = (id_util) => {
    axios.delete(`http://localhost:5000/api/users/${id_util}`)
      .then(() => {
        fetchUsers(); // Update user list
      })
      .catch(error => console.error("There was an error deleting the user!", error));
  };

  const handleCreate = () => {
    setOpen(true);
  };

  const handleCreateSubmit = () => {
    if (validateForm()) {
      axios.post('http://localhost:5000/api/users', selectedUser, {
        headers: { 'Content-Type': 'application/json' },
      })
        .then(() => {
          fetchUsers(); // Update user list
          handleClose();
        })
        .catch(error => console.error("There was an error creating the user!", error));
    }
  };

  const validateForm = () => {
    let formErrors = {};
    if (!selectedUser.name) formErrors.name = 'Name is required';
    if (!selectedUser.email) formErrors.email = 'Email is required';
    if (!selectedUser.password) formErrors.password = 'Password is required';
    if (!selectedUser.telephone) formErrors.telephone = 'Telephone is required';
    if (!selectedUser.fonction) formErrors.fonction = 'Function is required';
    if (!selectedUser.date_naiss) formErrors.date_naiss = 'Date of Birth is required';
    if (!selectedUser.address) formErrors.address = 'Address is required';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const filteredUsers = users.filter(user =>
    (user.name ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '50px', background: 'url("Photo1.jpg") no-repeat center center fixed', backgroundSize: 'cover', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
          <Typography variant="h4" gutterBottom>User Management</Typography>
          <Button variant="contained" color="primary" startIcon={<SaveIcon  />} onClick={handleCreate} style={{ marginBottom: '20px' }}>Create New User</Button>
          <TextField
            label="Search for users..."
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <List>
            {filteredUsers.map(user => (
              <Paper key={user.id_util} variant="outlined" style={{ marginBottom: '10px' }}>
                <ListItem>
                  <ListItemText
                    primary={user?.name ?? "Name Not Available"} // Using optional chaining and nullish coalescing
                    secondary={`Email: ${user?.email ?? 'Email Not Available'}, Telephone: ${user?.telephone ?? 'Telephone Not Available'}, Function: ${user?.fonction ?? 'Function Not Available'}`}
                  />
                  <Button variant="contained" color="primary" startIcon={<EditIcon />} style={{ marginRight: '10px', marginLeft: '5px' }} onClick={() => handleEditClick(user)}>Edit</Button>
                  <Button variant="contained" startIcon={<DeleteIcon />} color="error" onClick={() => handleDelete(user.id_util)}>Delete</Button>
                </ListItem>
                <Divider />
              </Paper>
            ))}
          </List>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{selectedUser && selectedUser.id_util ? 'Edit User' : 'Create User'}</DialogTitle>
            <DialogContent>
              <>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="name"
                  value={selectedUser.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="email"
                  value={selectedUser.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="password"
                  type="password"
                  value={selectedUser.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                />
                <TextField
                  label="Telephone"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="telephone"
                  value={selectedUser.telephone}
                  onChange={handleChange}
                  error={!!errors.telephone}
                  helperText={errors.telephone}
                />
                <TextField
                  label="Function"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="fonction"
                  value={selectedUser.fonction}
                  onChange={handleChange}
                  error={!!errors.fonction}
                  helperText={errors.fonction}
                />
                <TextField
                  label="Date of Birth"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="date"
                  name="date_naiss"
                  value={selectedUser.date_naiss}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.date_naiss}
                  helperText={errors.date_naiss}
                />
                <TextField
                  label="Address"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="address"
                  value={selectedUser.address}
                  onChange={handleChange}
                  error={!!errors.address}
                  helperText={errors.address}
                />
              </>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">Cancel</Button>
              <Button onClick={selectedUser && selectedUser.id_util ? handleSubmit : handleCreateSubmit} color="primary">
                {selectedUser && selectedUser.id_util ? 'Submit' : 'Create'}
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
    </div>
  );
};

export default UserManagementPage;
