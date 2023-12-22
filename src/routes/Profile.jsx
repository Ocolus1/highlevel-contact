import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import { Container } from 'react-bootstrap';

const UserProfile = () => {
    const { user } = useAuth();


    return (
        <div>
            <Navigation />
            <Container className="mt-5" >

                <h2>Dashboard</h2>
                {user ? (
                    <div>
                        <p>Email: {user?.email}</p>
                        <p>First Name: {user?.first_name}</p>
                        <p>Last Name: {user?.last_name}</p>
                        {/* <p>Business Name: {user.businessName}</p> */}
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </Container>
        </div>
    );
};

export default UserProfile;
