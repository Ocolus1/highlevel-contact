import React, {useState} from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Card, CardContent } from '@mui/material';
import { Alert } from 'react-bootstrap';
import axios from "axios";


const PaymentForm = ({ authToken, getUser, setCurrentStep }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [showFailureAlert, setShowFailureAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true)
        setShowFailureAlert(false)
        setShowSuccessAlert(false)

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        const result = await stripe.confirmSetup({
            elements,
            confirmParams: {
                return_url: 'http://localhost:5173/onboarding',
            },
            redirect: 'if_required',
        });

        if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            console.log(result.error.message);
            setLoading(false)
            setShowFailureAlert(true)
            setError(result.error.message)
        } else {

            try {
                
                const response = await axios.post(`${import.meta.env.VITE_REST_ENDPOINT}/api/link-payment-method/`, {
                    "setup_intent_id": result.setupIntent.id
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
            
            setLoading(false)
        }
    };

    return (
        <Card variant="outlined">
            <CardContent>
                <Box component="form" onSubmit={handleSubmit}>
                    {showFailureAlert && <Alert variant="danger" className="my-2">{error}</Alert>}
                    {showSuccessAlert && (<>
                        <Alert variant="success" className="my-2">{success}!</Alert>
                        <p>If page dosen't redirect in 10 seconds click the button bellow</p>
                        <Button className="ml-2 my-2" onClick={() => setCurrentStep(prev => prev + 1)}>Next</Button>
                    </>)}
                    <PaymentElement />
                    <Button type="submit" disabled={!stripe && loading} variant="contained" className="mt-3" color="primary">
                         {loading ? "loading..." : "Submit Payment Details"}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PaymentForm;
