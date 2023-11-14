import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem("fua_token") || null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!authToken);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            if (authToken) {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_REST_ENDPOINT}/auth/user/`, {
                        headers: {
                            Authorization: `Token ${authToken}`,
                        },
                    });

                    setUser(response.data);
                } catch (error) {
                    console.error('Error fetching user:', error);
                    // Handle token expiration or invalid token
                    logout();
                }
            } else {
                // Handle token expiration or invalid token
                logout();
            }
        };

        getUser();
    }, [authToken]);

    const login = (fua_token) => {
        setAuthToken(fua_token);
        localStorage.setItem('fua_token', fua_token);
        setIsLoggedIn(true);
    };

    const logout = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_REST_ENDPOINT}/auth/logout/`, {
                headers: {
                    Authorization: `Token ${authToken}`,
                },
            });
            console.log(response.data.details);
            setAuthToken(null);
            localStorage.removeItem('fua_token');
            setIsLoggedIn(false);
            setUser(null);
        } catch (error) {
            console.error('Error fetching user:', error);
            // Handle token expiration or invalid token
            logout();
        }
    };

    return (
        <AuthContext.Provider value={{ authToken, login, logout, isLoggedIn, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
