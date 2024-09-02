import React from 'react';
import { Grid, Typography, Paper } from '@mui/material';

const ServicesPage = () => {
    const backgroundStyle = {
        backgroundImage: `url(${process.env.PUBLIC_URL}/Photo1.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '50px 0',
    };

    return (
        <div style={backgroundStyle}>
            <Grid container justifyContent="center">
                <Grid item xs={10}>
                    <Paper elevation={3} style={{ padding: '20px', margin: '20px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                        <Typography variant="h4" gutterBottom>Contrôle des chantiers:</Typography>
                        <Typography variant="body1">
                            Conformément à l’article 3 du Dahir portant loi n° 1-93-51 du 22 Rabia I 1414(10 Septembre 1993), l’Agence Urbaine de Taza-Taounate est chargée de contrôler la conformité des lotissements, morcellements, groupes d’habitations et constructions en cours de réalisation avec les dispositions législatives et réglementaires en vigueur et avec les autorisations de lotir, de morceler, de créer des groupes d’habitations ou de construire accordées.
                        </Typography>
                        <Typography variant="body1">
                            L’activité de contrôle a permis de constater 1821 infractions en 2022 :<br/><br/>
                        </Typography>
                        <img alt="1" src={`${process.env.PUBLIC_URL}/Controle_2022.png`} style={{ width: '828px', height: '100px' }} />
                        <br/><br/>
                        <Typography variant="body1">
                            Pour plus de détails sur l'activité de contrôle, consulter le&nbsp; Dahir <strong>n° 1-16-124 </strong>portant promulgation de la<strong> </strong>Loi<strong> N° 66.12</strong> relatif au contrôle des irrégularités dans le domaine de l'urbanisme et la construction.
                            <a href={`${process.env.PUBLIC_URL}/BO_6501_Ar_Loi_N-66-12.pdf`} target="_blank" rel="noreferrer" >version arabe</a>
                            <br/><br/>
                        </Typography>
                        <Typography variant="body1">
                            D'autres documents : <a href={`${process.env.PUBLIC_URL}/Depliant-loi-66-12-final.pdf`}>Dépliant Loi 66.12</a>
                        </Typography>
                        <div style={{ width: '300px', height: '638px', backgroundColor: '#2b5b85', color: '#fff', padding: '2px', marginLeft: '100px', textAlign: 'center', marginTop: '0px' }}>
                            <a href={`${process.env.PUBLIC_URL}/Depliant-loi-66-12-final.pdf`}><img src={`${process.env.PUBLIC_URL}/Loi 66-12.jpg`} style={{ width: '300px', height: '638px' }} alt="Loi 66-12" /></a>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default ServicesPage;
