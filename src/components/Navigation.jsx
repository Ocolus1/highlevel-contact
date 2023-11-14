import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';


import { GoogleLogin } from '@react-oauth/google';
import axios from "axios";

import { useAuth } from '../context/AuthContext';


const CustomButton = styled(Button)({
    margin: "0 .5rem",
    backgroundColor: 'white',
    '&:hover': {
        backgroundColor: 'white',
        color: 'blue',
    },
    '&:active': {
        backgroundColor: 'navy',
    },
    borderRadius: "7px",
    padding: ".3rem .5rem"
});

function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const { login, logout, isLoggedIn, user } = useAuth();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

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
        }
    };


    const handleLogout = () => {
        logout(); // Clear the token from the context and localStorage
    };


    return (
        <AppBar position="static" >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            '&hover': {
                                color: "green"
                            }
                        }}
                    >
                        FUA-Automation
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            <MenuItem  onClick={handleCloseNavMenu}>
                                {isLoggedIn ? (
                                    <div>
                                        <CustomButton onClick={handleLogout}>Logout</CustomButton>
                                    </div>
                                ) : (
                                        <GoogleLogin
                                            onSuccess={handleGoogleLogin}
                                            onError={() => {
                                                console.log('Google login failed');
                                            }}
                                            size="medium"
                                            text="continue_with"
                                            shape="pill"
                                            useOneTap
                                        />
                                )}
                            </MenuItem>
                        </Menu>
                    </Box>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'white',
                            textDecoration: 'none',
                            '&hover': {
                                color: "white"
                            }
                        }}
                    >
                        FUA-Automation
                    </Typography>
                    <Box sx={{  display: { xs: 'none', md: 'flex' } }} marginLeft="auto">
                        {isLoggedIn ? (
                            <div>
                                <span>{user?.first_name} {user?.last_name} is logged in</span>
                                <CustomButton onClick={handleLogout}>Logout</CustomButton>
                            </div>
                        ) : (
                                <GoogleLogin
                                    onSuccess={handleGoogleLogin}
                                    onError={() => {
                                        console.log('Google login failed');
                                    }}
                                    size="medium"
                                    text="continue_with"
                                    shape="pill"
                                    useOneTap
                                />
                        )}
                        
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveAppBar;
