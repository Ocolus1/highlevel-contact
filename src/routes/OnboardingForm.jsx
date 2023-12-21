import React, { useState, useEffect } from 'react';
import { Container, ProgressBar, Button } from 'react-bootstrap';
import SubAccount from '../components/SubAccount';
import PhoneNumberPurchase from '../components/PhoneNumberPurchase';
import A2PRegistration from '../components/A2PRegistration';
import ContactUpload from '../components/ContactUpload';
import Navigation from '../components/Navigation';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import PaymentDetails from '../components/PaymentDetails';
import Completed from '../components/Completed';
import { Alert } from 'react-bootstrap';

import axios from "axios";
import CalendarDetails from '../components/CalendarDetails';
import OfferInfo from '../components/OfferInfo';


function MultiStepForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const { isLoggedIn, user, getUser, authToken } = useAuth();
    const navigate = useNavigate();
    const [showFailureAlert, setShowFailureAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/");
        }
        // The cleanup function is optional in this case since navigate is stable
    }, [isLoggedIn, navigate]); 

    useEffect(() => {
        if (user?.status === "Completed") {
            navigate("/dashboard");
        }
        // The cleanup function is optional in this case since navigate is stable
    }, [isLoggedIn, navigate, user]); 


    useEffect(() => {
        if (user && user?.status) {
            const stepIndex = steps.findIndex(step => step.label === user?.status);
            setCurrentStep(stepIndex+1)
        }
    }, [user?.status]);


    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const setupIntentId = urlParams.get('setup_intent');
        const redirectStatus = urlParams.get('redirect_status');

        if (setupIntentId && redirectStatus === 'succeeded') {
            // Call your API to link the payment method
            linkPaymentMethodToCustomer(setupIntentId);
            navigate("/onboarding")
            
        }
    }, []);

    const linkPaymentMethodToCustomer = async (setupIntentId) => {
        try {

            const response = await axios.post(`${import.meta.env.VITE_REST_ENDPOINT}/api/link-payment-method/`, 
                {
                    "setup_intent_id": setupIntentId
                },
                {
                    headers: {
                        Authorization: `Token ${authToken}`,
                        "Content-Type": "application/json",
                    },
                }
            )
            if (response.data.status == "Stripe payment method added successfully.") {
                setShowSuccessAlert(true)
                setSuccess("Stripe payment method added successfully.")
                setTimeout(async () => {
                    await getUser();
                }, 2000);
            }
        } catch (error) {
            console.error(error)
            setShowFailureAlert(true)
            setError(error.response.data.error)
        }
    };

    const steps = [
        { label: "User Info", component: <SubAccount authToken={authToken} getUser={getUser} /> },
        { label: "Calendar Details", component: <CalendarDetails authToken={authToken} getUser={getUser} setCurrentStep={setCurrentStep} /> },
        { label: "Stripe Payment Details", component: <PaymentDetails authToken={authToken} getUser={getUser} setCurrentStep={setCurrentStep} /> },
        { label: "Phone Number Purchase", component: <PhoneNumberPurchase authToken={authToken} getUser={getUser} setCurrentStep={setCurrentStep} /> },
        { label: "A2P Registration", component: <A2PRegistration authToken={authToken} getUser={getUser} setCurrentStep={setCurrentStep} /> },
        { label: "Contact Upload", component: <ContactUpload authToken={authToken} getUser={getUser} setCurrentStep={setCurrentStep} /> },
        { label: "Offer Info", component: <OfferInfo authToken={authToken} getUser={getUser} setCurrentStep={setCurrentStep} /> },
        { label: "Completed", component: <Completed  /> },
        // ... other steps ...
    ];

    const progress = (currentStep / steps.length) * 100;

    return (
        <>
            <Navigation />
            <Container className="mt-5">
                <h2 className='mb-3'>Onboarding Form</h2>

                {/* Step Indicator */}
                <ProgressBar now={progress} label={`${currentStep} / ${steps.length}`} />

                {showFailureAlert && <Alert variant="danger" className="my-2">{error}</Alert>}
                {showSuccessAlert && <Alert variant="success" className="my-2">{success}</Alert>}

                {/* Render the Current Step */}
                <div className="mt-4">
                    {steps[currentStep - 1].component}
                </div>

                {/* <div className="mt-4">
                    {<Button variant="secondary" onClick={() => setCurrentStep(prev => prev - 1)}>Previous</Button>}
                    {<Button className="ml-2" onClick={() => setCurrentStep(prev => prev + 1)}>Next</Button>}
                </div> */}
            </Container>
        </>
    );
}



export default MultiStepForm;
