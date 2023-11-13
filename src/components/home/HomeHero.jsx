import React from 'react'
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'



const ExpItem = ({ item }) => {
    const { value, label } = item
    return (
        <Box sx={{ textAlign: 'center', mb: { xs: 1, md: 0 } }}>
            <Typography
                sx={{ color: 'secondary.main', mb: { xs: 1, md: 2 }, fontSize: { xs: 34, md: 44 }, fontWeight: 'bold' }}
            >
                {value}
            </Typography>
            <Typography color="text.secondary" variant="h5">
                {label}
            </Typography>
        </Box>
    )
}

const HomeHero = () => {
    return (
        <Box id="hero" sx={{ backgroundColor: 'background.paper', position: 'relative', pt: 4, pb: { xs: 8, md: 10 } }}>
            <Container maxWidth="lg">
                <Typography>Secure, smart and easy to automation tool</Typography>
            </Container>
        </Box>
    )
}

export default HomeHero