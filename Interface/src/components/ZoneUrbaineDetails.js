import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  List,
  Paper,
  ListItemText,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';


const ZoneUrbainePage = () => {
  const [zones, setZones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [rerender, setRerender] = useState(false); // State variable for triggering rerender
  const [selectedImageId, setSelectedImageId] = useState(null);

  const backgroundStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/Photo1.jpg)`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    minHeight: '100vh',
    padding: '50px 0',
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/zones')
      .then(response => setZones(response.data))
      .catch(error => console.error("There was an error fetching the zones!", error));

    axios.get('http://localhost:5000/api/images')
      .then(response => setImages(response.data))
      .catch(error => console.error("There was an error fetching the images!", error));
  }, [rerender]); // Add rerender as a dependency

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEditClick = (zone) => {
    setSelectedZone({
      ...zone,
      image_id: zone.image_id || '',
    });
    setSelectedImageId(zone.image_id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedZone(null);
    setErrors({});
    setSelectedFile(null); // Reset selected file when closing dialog
    setSelectedImageId(null);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const requestData = {
        nom: selectedZone.nom,
        superficie: selectedZone.superficie,
        population: selectedZone.population,
        address: selectedZone.address,
        image_id: selectedImageId, // Pass selected image id
      };

      axios.put(`http://localhost:5000/api/zones/${selectedZone.id_zone}`, requestData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Use multipart form data for file upload
        },
      })
        .then(() => {
          setRerender(prev => !prev); // Toggle rerender trigger
          handleClose();
        })
        .catch(error => console.error("There was an error updating the zone urbaine!", error));
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelectedZone({
      ...selectedZone,
      [name]: value,
    });
  };

  const handleDelete = (id_zone) => {
    axios.delete(`http://localhost:5000/api/zones/${id_zone}`)
      .then(() => {
        setRerender(prev => !prev); // Toggle rerender trigger
      })
      .catch(error => console.error("There was an error deleting the zone urbaine!", error));
  };

  const handleCreate = () => {
    setSelectedZone({
      nom: '',
      superficie: 0,
      population: 0,
      address: '',
      image_id: '',
    });
    setOpen(true);
  };

  const handleCreateSubmit = () => {
    if (validateForm()) {
      const requestData = new FormData(); // Create FormData object for file upload
      requestData.append('nom', selectedZone.nom);
      requestData.append('superficie', selectedZone.superficie);
      requestData.append('population', selectedZone.population);
      requestData.append('address', selectedZone.address);
      requestData.append('image', selectedFile); // Append selected file

      axios.post('http://localhost:5000/api/zones', requestData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Use multipart form data for file upload
        },
      })
        .then(() => {
          setRerender(prev => !prev); // Toggle rerender trigger
          handleClose();
        })
        .catch(error => console.error("There was an error creating the zone!", error));
    }
  };

  const validateForm = () => {
    let formErrors = {};
    if (!selectedZone.nom) formErrors.nom = 'Zone name is required';
    if (!selectedZone.superficie) formErrors.superficie = 'Superficie is required';
    if (!selectedZone.population) formErrors.population = 'Population is required';
    if (!selectedZone.address) formErrors.address = 'Address is required';
    if (!selectedImageId && !selectedFile) formErrors.image = 'Image is required';
  
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };
  

  const filteredZones = zones.filter(zone =>
    zone.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={backgroundStyle}>
      <Container>
        <Paper elevation={3} style={{ padding: '20px', margin: '20px', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <h1>Zone Urbaine Management</h1>
          <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleCreate}>Create New Zone</Button>
          <TextField
            label="Search for zones..."
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <List>
            {filteredZones.map(zone => (
              <Card key={zone.id_zone} variant="outlined" style={{ marginBottom: '10px' }}>
                <CardContent>
                  <ListItemText
                    primary={zone.nom}
                    secondary={`Superficie: ${zone.superficie}, Population: ${zone.population}, Address: ${zone.address}`}
                  />
                  {images.filter(img => img.id_img === zone.image_id).map(img => (
                    <img
                      key={img.id_img}
                      src={`http://localhost:5000/uploads/${img.url}`}
                      alt="Zone Urbaine"
                      style={{ width: '300px', height: 'auto', marginBottom: '10px' }}
                    />
                  ))}
                </CardContent>
                <CardActions>
                  <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={() => handleEditClick(zone)}>Edit</Button>
                  <Button variant="contained" startIcon={<DeleteIcon />} color="error" onClick={() => handleDelete(zone.id_zone)}>Delete</Button>
                </CardActions>
              </Card>
            ))}
          </List>

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{selectedZone && selectedZone.id_zone ? 'Edit Zone Urbaine' : 'Create Zone Urbaine'}</DialogTitle>
            <DialogContent>
              {selectedZone && (
                <>
                  <TextField
                    label="Zone Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="nom"
                    value={selectedZone.nom}
                    onChange={handleChange}
                    error={!!errors.nom}
                    helperText={errors.nom}
                  />
                  <TextField
                    label="Superficie"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="number"
                    name="superficie"
                    value={selectedZone.superficie}
                    onChange={handleChange}
                    InputProps={{ inputProps: { step: "0.01" } }}
                    error={!!errors.superficie}
                    helperText={errors.superficie}
                  />
                  <TextField
                    label="Population"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="number"
                    name="population"
                    value={selectedZone.population}
                    onChange={handleChange}
                    error={!!errors.population}
                    helperText={errors.population}
                  />
                  <TextField
                    label="Address"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="address"
                    value={selectedZone.address}
                    onChange={handleChange}
                    error={!!errors.address}
                    helperText={errors.address}
                  />
                  {selectedZone.id_zone ? (
            <FormControl fullWidth margin="normal">
              <InputLabel id="image-select-label">Select Image</InputLabel>
              <Select
  labelId="image-select-label"
  value={selectedImageId}
  onChange={(e) => {
    setSelectedImageId(e.target.value);
    setSelectedFile(null); // Reset selected file when selecting an existing image
  }}
>
  {images.filter((img, index, self) => 
    index === self.findIndex((t) => (
      t.url === img.url
    ))
  ).map(img => (
    <MenuItem key={img.id_img} value={img.id_img}>{img.url}</MenuItem>
  ))}
</Select>

            </FormControl>
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              style={{ marginTop: '10px' }}
            />
          )}
                  {errors.image && <p style={{ color: 'red' }}>{errors.image}</p>}
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">Cancel</Button>
              <Button onClick={selectedZone && selectedZone.id_zone ? handleSubmit : handleCreateSubmit} color="primary">
                {selectedZone && selectedZone.id_zone ? 'Submit' : 'Create'}
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
    </div>
  );
};

export default ZoneUrbainePage;
