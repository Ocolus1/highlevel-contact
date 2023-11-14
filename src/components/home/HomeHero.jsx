import React from 'react'
import { Box } from '@mui/material';
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';

import { GoogleLogin } from '@react-oauth/google';
import axios from "axios";

import { useAuth } from '../../context/AuthContext';

const HomeHero = () => {
    const { login, logout, isLoggedIn } = useAuth();
    const theme = useTheme();

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_REST_ENDPOINT}/auth/google/`, {
                id_token: credentialResponse.credential,
                access_token: credentialResponse.credential,
            });
            const data = response.data;
            login(data.key);
        } catch (error) {
            console.error('Error during Google login:', error);
            logout();
        }
    };

    return (
        <Box id="hero" sx={{ backgroundColor: 'background.paper', position: 'relative', pt: 4, pb: { xs: 8, md: 10 } }}>
            <Container maxWidth="xl">
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid xs={12} sm={6}>
                            <Typography
                                variant="h1"
                                component="h2"
                                sx={{
                                    // Default styles
                                    fontSize: '1.5rem', // for mobile devices

                                    // Media queries
                                    [theme.breakpoints.up('sm')]: {
                                        fontSize: '2rem', // for small devices and up
                                    },
                                    [theme.breakpoints.up('md')]: {
                                        fontSize: '2.5rem', // for medium devices and up
                                    },
                                    [theme.breakpoints.up('lg')]: {
                                        fontSize: '3rem', // for large devices and up
                                    },
                                }}
                            >
                                Secure, smart and easy to use automation tool
                            </Typography>
                            <Typography as="div" maxWidth={400} mt={1}>
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
                                Nihil excepturi tenetur, quasi aut fuga vero obcaecati 
                                laboriosam reiciendis.
                                <Box as="p" mt={2}>
                                    {!isLoggedIn &&
                                        <GoogleLogin
                                            onSuccess={handleGoogleLogin}
                                            onError={() => {
                                                console.log('Google login failed');
                                            }}
                                            size="large"
                                            text="continue_with"
                                        />
                                    }
                                </Box>
                            </Typography>
                        </Grid>
                        <Grid xs={12} sm={6}>
                            <Box>
                                <img src='main_div.jpg' className='img-fluid' />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    )
}

export default HomeHero