import React, {useEffect, useState} from 'react'
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import PaymentForm from "./stripe/PaymentForm"

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PaymentDetails({ authToken, getUser }) {
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {

        const getClientSecret = async () => {
            const response = await axios.get(`${import.meta.env.VITE_REST_ENDPOINT}/api/stripe-setup-intent/`, {
                headers: {
                    Authorization: `Token ${authToken}`,
                },
            });

            setClientSecret(response.data.client_secret)
        }

        getClientSecret();
    }, [])

    return (
        <div>
            <Box className="justify-content-md-center mt-5">
                <h3>Stripe Payment Details</h3>
                <Container className="mt-5">
                    {clientSecret && stripePromise && (
                        <Elements stripe={stripePromise} options={{ clientSecret: clientSecret }}>
                            <PaymentForm getUser={getUser} authToken={authToken} />
                        </Elements>
                    )}
                </Container>
            </Box>
        </div>
    )
}
