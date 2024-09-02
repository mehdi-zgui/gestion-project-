import React from 'react';
import { Grid, Typography, Paper, Divider } from '@mui/material';

const ContactPage = () => {
    const backgroundStyle = {
        backgroundImage: `url(${process.env.PUBLIC_URL}/Photo1.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center down 100px',
        minHeight: '100vh',
        marginTop:'20px',
    };

    return (
        <div style={backgroundStyle}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper elevation={3} style={{ padding: '20px', margin: '20px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                        <Typography variant="h4">Contact</Typography>
                        <Divider style={{ margin: '20px 0' }} />
                        {/* Siège de l'Agence Urbaine de Taza-Taounate */}
                        <Typography variant="h6" style={{ backgroundColor: '#2b5b85', color: '#fff', padding: '10px', border: '5px solid #37a5c8', textAlign: 'center' }}>
                            Siège de l'Agence Urbaine de Taza-Taounate
                        </Typography>
                        <Typography variant="body1">ADRESSE : Avenue Hassan Bahtat BP 1211 Taza Gare</Typography>
                        {/* Ajout d'un titre à l'iframe */}
                        <iframe title="Carte du siège de l'Agence Urbaine de Taza-Taounate" width="100%" height="300" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?hl=en&amp;q=Agence+Urbaine+de+Taza%2C+Taza%2C+Taza-Al+Hoce%C3%AFma-Taounate%2C+Maroc&amp;iwloc=A&amp;z=14&amp;t=m&amp;output=embed"></iframe>
                        <Typography variant="body1">TELEPHONE : 05 35 28 51 15/14 *** 05 35 28 50 41</Typography>
                        <Typography variant="body1">FAX : 05 35 28 51 13</Typography>
                        <Typography variant="body1">E-MAIL : autat@menara.ma</Typography>
                        <Typography variant="body1">RESEAUX SOCIAUX : <a href="http://www.facebook.com/AgenceUrbainedeTaza" target="_blank" rel="noopener noreferrer">Facebook</a>, <a href="https://twitter.com/AUTAZA" target="_blank" rel="noopener noreferrer">Twitter</a></Typography>
                        <Divider style={{ margin: '20px 0' }} />
                        {/* Antenne de l'Agence Urbaine à la province de Taounate */}
                        <Typography variant="h6" style={{ backgroundColor: '#2b5b85', color: '#fff', padding: '10px', border: '5px solid #37a5c8', textAlign: 'center' }}>
                            Antenne de l'Agence Urbaine à la province de Taounate
                        </Typography>
                        <Typography variant="body1">ADRESSE : Route nationale N°8 Lotissement Al Wahda, Taounate.</Typography>
                        {/* Ajout d'un titre à l'iframe */}
                        <iframe title="Carte de l'antenne de l'Agence Urbaine à la province de Taounate" width="100%" height="300" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?hl=en&amp;q=Antenne+Agence+Urbaine+de+Taza+%C3%A0+Taounate%2C+Province+de+Taounate%2C+Taza-Al+Hoce%C3%AFma-Taounate%2C+Maroc&amp;iwloc=A&amp;z=14&amp;t=m&amp;output=embed"></iframe>
                        <Typography variant="body1">TELEPHONE : 05 35 68 70 11</Typography>
                        <Typography variant="body1">FAX : 05 35 68 70 11</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default ContactPage;
