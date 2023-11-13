import React from 'react';
import Navigation from '../components/Navigation';
import HomeHero from '../components/home/HomeHero';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";

function Home() {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();


    if (isLoggedIn){
        navigate("/onboarding");
    }
    
    return (
        <>
            <Navigation />
            <HomeHero />
        </>
    );
}

export default Home;