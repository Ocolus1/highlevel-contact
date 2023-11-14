import React, { useState, useEffect } from 'react';
import { Container, ProgressBar, Button } from 'react-bootstrap';
import SubAccount from '../components/SubAccount';
import PhoneNumberPurchase from '../components/PhoneNumberPurchase';
import A2PRegistration from '../components/A2PRegistration';
import ContactUpload from '../components/ContactUpload';
import ScheduleCalendar from '../components/ScheduleCalendar';
import Navigation from '../components/Navigation';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";

function MultiStepForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/");
        }
        // The cleanup function is optional in this case since navigate is stable
    }, [isLoggedIn, navigate]); 

    const steps = [
        { label: "Onboarding", component: <SubAccount setCurrentStep={setCurrentStep} /> },
        { label: "Phone Purchase", component: <PhoneNumberPurchase setCurrentStep={setCurrentStep} /> },
        { label: "A2P Registration", component: <A2PRegistration setCurrentStep={setCurrentStep} /> },
        { label: "Contact Upload", component: <ContactUpload setCurrentStep={setCurrentStep} /> },
        { label: "Schedule Calendar", component: <ScheduleCalendar setCurrentStep={setCurrentStep} /> },
        // ... other steps ...
    ];

    const progress = (currentStep / steps.length) * 100;

    return (
        <>
            <Navigation />
            <Container className="mt-5">
                <h2>Onboarding Form</h2>

                {/* Step Indicator */}
                <ProgressBar now={progress} label={`${currentStep} / ${steps.length}`} />

                {/* Render the Current Step */}
                <div className="mt-4">
                    {steps[currentStep - 1].component}
                </div>

                <div className="mt-4">
                    {<Button variant="secondary" onClick={() => setCurrentStep(prev => prev - 1)}>Previous</Button>}
                    {<Button className="ml-2" onClick={() => setCurrentStep(prev => prev + 1)}>Next</Button>}
                </div>
            </Container>
        </>
    );
}



export default MultiStepForm;
