import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';

function OnboardingComplete() {
    // Function to handle any action after completion, e.g., navigating to a dashboard
    const handleNextSteps = () => {
        // Implement your next step logic here
        console.log("Moving to the next steps...");
    };

    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', marginTop: 8 }}>
            <Typography variant="h4" gutterBottom>
                Onboarding Complete!
            </Typography>
            <Typography variant="body1" gutterBottom>
                Thank you for completing the onboarding process. You are all set to start using our services.
            </Typography>
            <Box mt={4}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNextSteps}
                >
                    Proceed to Dashboard
                </Button>
            </Box>
        </Container>
    );
}

export default OnboardingComplete;
