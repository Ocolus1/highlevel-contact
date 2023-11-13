import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("token") !== "") {
            setIsLoggedIn(true)
        }
    }, [])

    const login = (token) => {
        setAuthToken(token);
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
    };

    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ authToken, login, logout, isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};