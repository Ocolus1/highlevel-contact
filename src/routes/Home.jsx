import React, { useEffect } from 'react';
import Navigation from '../components/Navigation';
import HomeHero from '../components/home/HomeHero';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";

function Home() {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/onboarding");
        }
        // The cleanup function is optional in this case since navigate is stable
    }, [isLoggedIn, navigate]); 

    return (
        <>
            <Navigation />
            <HomeHero />
        </>
    );
}

export default Home;
