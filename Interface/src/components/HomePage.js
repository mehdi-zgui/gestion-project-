import React from 'react';
import { Grid, Typography, Paper } from '@mui/material';

const HomePage = () => {
    const backgroundStyle = {
        backgroundImage: `url(${process.env.PUBLIC_URL}/Photo1.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '50px 0',
    };

    return (
        <div style={backgroundStyle}>
            <Paper elevation={3}  style={{ padding: '20px', margin: '20px', backgroundColor: 'rgba(255, 255, 255, 0.9 )' }}>
            <Grid container justifyContent="center">
                <Grid item xs={10}>

                        <Typography variant="h4" gutterBottom>Bienvenue sur notre plateforme de gestion urbaine. </Typography>
                        <Typography variant="body1">
                            Création de l'Agence urbaine de Taza-Taounate:
                            <br/><br/>
                            L’Agence Urbaine est un établissement public doté de la personnalité morale et de l’autonomie financière et placé sous la tutelle du Ministère de l’Aménagement du Territoire National, de l’Urbanisme, de l’Habitat et de la politique de la ville. Elle est administrée par un conseil d’administration et gérée par un Directeur. L’Agence Urbaine de Taza-Taouante a été instaurée par le décret n°2-97361 du 27 Joumada II 1418 (30 Octobre 1997) publié au B.O du 06 Novembre de la même année, ce décret pris en application notamment des dispositions du Dahir pourtant loi n°1-93-51 du 22 Rabia I 1414 (10/09/1993).
                            <br/><br/>
                            NB :
                            <br/>- La création de l'Agence Urbaine d'Al Hoceima a réduit le ressort territorial de l'AUT aux deux provinces de Taza et Taounate.
                            <br/>- Le champ d'intervention de l'AUT est administrativement composé des deux provinces de Taza et Taounate.
                        </Typography>

                </Grid>
            </Grid>

            <Grid container justifyContent="center" style={{ marginTop: '50px' }}>
                <Grid item xs={10}>
                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                            <img src={`${process.env.PUBLIC_URL}/ACC1.jpeg`} alt="ACC1" style={{ width: '100%', height: '100%' ,  borderRadius: '8px' }} />
                        </Grid>
                        <Grid item xs={4}>
                            <img src={`${process.env.PUBLIC_URL}/ACC2.jpeg`} alt="ACC2" style={{ width: '100%', height: '100%' , borderRadius: '8px' }} />
                        </Grid>
                        <Grid item xs={4}>
                            <img src={`${process.env.PUBLIC_URL}/ACC3.jpg`} alt="ACC3" style={{ width: '100%', borderRadius: '8px' }} />
                        </Grid>
                        {/* Add more image placeholders as needed */}
                    </Grid>
                </Grid>
            </Grid>

            <Grid container justifyContent="center" style={{ marginTop: '50px' }}>
                <Grid item xs={10}>

                        <Typography variant="h5" gutterBottom>Latest News</Typography>
                        <Typography variant="body1" gutterBottom>
                            Curabitur nec velit vel libero scelerisque dapibus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
                        </Typography>
                        <Typography variant="body1">
                            Integer non nisi a quam iaculis consectetur. Nam eu libero sit amet lacus convallis convallis vel vitae nulla.
                        </Typography>

                </Grid>
            </Grid>
        </Paper>
        </div>
    );
};

export default HomePage;
