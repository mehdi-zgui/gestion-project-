// import React, { useState } from 'react';
// import { TextField, Button, Typography } from '@mui/material';

// const UpdateForm = ({ item, onUpdate, fields }) => {
//     const [updatedItem, setUpdatedItem] = useState(item);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setUpdatedItem({ ...updatedItem, [name]: value });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onUpdate(updatedItem);
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <Typography variant="h6" gutterBottom>Update Details</Typography>
//             {fields.map(field => (
//                 <TextField
//                     key={field.name}
//                     label={field.label}
//                     name={field.name}
//                     value={updatedItem[field.name] || ''}
//                     onChange={handleChange}
//                     fullWidth
//                     margin="normal"
//                 />
//             ))}
//             <Button type="submit" variant="contained" color="primary">Update</Button>
//         </form>
//     );
// };

// export default UpdateForm;