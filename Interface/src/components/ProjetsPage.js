import React, { useState, useEffect } from 'react';
import { Container, TextField, List, ListItem, ListItemText, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, InputLabel, FormControl, Paper } from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditButton from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [zones, setZones] = useState([]);
  const [isEdit, setIsEdit] = useState(true);
  const [validationErrors, setValidationErrors] = useState({
    nom: false,
    date_debut: false,
    date_fin: false,
    cout: false,
    etat_id: false,
    zone_id: false
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/projects')
      .then(response => setProjects(response.data))
      .catch(error => console.error("There was an error fetching the projects!", error));

    axios.get('http://localhost:5000/api/statuses')
      .then(response => setStatuses(response.data))
      .catch(error => console.error("There was an error fetching the statuses!", error));

    axios.get('http://localhost:5000/api/zones')
      .then(response => setZones(response.data))
      .catch(error => console.error("There was an error fetching the zones!", error));
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEditClick = (project) => {
    setSelectedProject({
      ...project,
      etat_id: project.etat_id || '',
      zone_id: project.zone_id || '',
    });
    setIsEdit(true);
    setOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedProject({
      nom: '',
      date_debut: '',
      date_fin: '',
      cout: '',
      etat_id: '',
      zone_id: '',
    });
    setIsEdit(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProject(null);
  };

  const formatDateString = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = () => {
    if (!selectedProject) return;
    const requestData = {
      nom: selectedProject.nom,
      date_debut: formatDateString(selectedProject.date_debut),
      date_fin: formatDateString(selectedProject.date_fin),
      cout: selectedProject.cout,
      etat_id: selectedProject.etat_id,
      zone_id: selectedProject.zone_id,
    };

    // Check for empty fields
    const errors = {};
    for (const key in requestData) {
      if (!requestData[key]) {
        errors[key] = true;
      }
    }
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Reset validation errors
    setValidationErrors({
      nom: false,
      date_debut: false,
      date_fin: false,
      cout: false,
      etat_id: false,
      zone_id: false
    });

    if (isEdit) {
      axios.put(`http://localhost:5000/api/projects/${selectedProject.id_pro}`, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(() => {
          setProjects(projects.map(project => project.id_pro === selectedProject.id_pro ? { ...selectedProject, ...requestData } : project));
          handleClose();
        })
        .catch(error => console.error("There was an error updating the project!", error));
    } else {
      axios.post('http://localhost:5000/api/projects', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          setProjects([...projects, response.data]);
          handleClose();
        })
        .catch(error => console.error("There was an error creating the project!", error));
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelectedProject({
      ...selectedProject,
      [name]: value,
    });
  };

  const handleDelete = (id_pro) => {
    axios.delete(`http://localhost:5000/api/projects/${id_pro}`)
      .then(() => {
        setProjects(projects.filter(proj => proj.id_pro !== id_pro));
      })
      .catch(error => console.error("There was an error deleting the project!", error));
  };

  const filteredProjects = projects.filter(project =>
    project.nom && project.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '50px', background: 'url("Photo1.jpg") no-repeat center center fixed', backgroundSize: 'cover', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Paper style={{ padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.9)', marginBottom: '20px' }}>
          <h1>Project Management</h1>
          <TextField
            label="Search for projects..."
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleCreateClick} style={{ marginBottom: '20px' }}>Create New Project</Button>
          <List>
            {filteredProjects.map(project => (
              <ListItem key={project.id_pro} style={{ marginBottom: '10px' }}>
                <ListItemText
                  primary={project.nom}
                  secondary={`Status: ${project.etat_nom}, Zone: ${project.zone_nom}, Start Date: ${project.date_debut}, End Date: ${project.date_fin}, Cost: ${project.cout}`}
                />
                <Button variant="contained" color="primary" startIcon={<EditButton />} onClick={() => handleEditClick(project)} style={{ marginRight: '10px', marginLeft: '5px' }}>Edit</Button>
                <Button variant="contained" startIcon={<DeleteIcon />} color="error" onClick={() => handleDelete(project.id_pro)}>Delete</Button>
              </ListItem>
            ))}
          </List>

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{isEdit ? 'Edit Project' : 'Create Project'}</DialogTitle>
            <DialogContent>
              {selectedProject && (
                <>
                  <TextField
                    label="Project Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="nom"
                    value={selectedProject.nom}
                    onChange={handleChange}
                    error={validationErrors.nom}
                  />
                  <TextField
                    label="Start Date"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="date"
                    name="date_debut"
                    value={selectedProject.date_debut}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    error={validationErrors.date_debut}
                  />
                  <TextField
                    label="End Date"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="date"
                    name="date_fin"
                    value={selectedProject.date_fin}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    error={validationErrors.date_fin}
                  />
                  <TextField
                    label="Cost"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="number"
                    name="cout"
                    value={selectedProject.cout}
                    onChange={handleChange}
                    InputProps={{ inputProps: { step: "0.01" } }}
                    error={validationErrors.cout}
                  />
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="etat_id"
                      value={selectedProject.etat_id}
                      onChange={handleChange}
                      error={validationErrors.etat_id}
                    >
                      {statuses.map(status => (
                        <MenuItem key={status.id} value={status.id}>{status.nom}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Zone</InputLabel>
                    <Select
                      name="zone_id"
                      value={selectedProject.zone_id}
                      onChange={handleChange}
                      error={validationErrors.zone_id}
                    >
                      {zones.map(zone => (
                        <MenuItem key={zone.id_zone} value={zone.id_zone}>{zone.nom}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">Cancel</Button>
              <Button onClick={handleSubmit} color="primary">Submit</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
    </div>
  );
};

export default ProjectPage;
