import React, { useState } from 'react';
import { Button, Container, Row, Alert, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from "axios";


function PhoneNumberPurchase({ authToken, getUser }) {
    const [loading, setLoading] = useState(false);
    const [purchaseSuccess, setPurchaseSuccess] = useState(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const { handleSubmit } = useForm();

    const handlePurchase = async () => {
        setLoading(true);
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_REST_ENDPOINT}/api/phonenumber/purchase_phone_number/`,
                {
                    Authorization: `Token ${authToken}`,
                    "Content-Type": "application/json",
                });
            if (response.data.message) {
                setSuccess(response.data.message)
                setPurchaseSuccess(true);
                setTimeout(async () => {
                    await getUser();
                }, 2000);
            }
            if (response.data.error) {
                setError(response.data.error)
            }
        } catch (error) {
            setPurchaseSuccess(false);
        }
        // Once processed:
        setLoading(false);
    };
    return (
        <Container className="mt-3">
            <Row>
                <div>
                    <h3>Phone Number Purchase</h3>

                    {loading ? (
                        <Alert variant="info">Purchasing phone number this may take a few minutes...</Alert>
                    ) : purchaseSuccess === true ? (
                            <Alert variant="success">{success}!</Alert>
                    ) : purchaseSuccess === false ? (
                        <>
                            <Form.Group className="mb-4">
                                <Alert variant="danger">{error || "Error purchasing phone number."}</Alert>
                                <Button onClick={handleSubmit(handlePurchase)}>Purchase Phone Number</Button>
                            </Form.Group>
                        </>
                    ) : (
                        <>
                            <Form.Group className="mb-4">
                                <p className='my-2'>Click the button below to purchase a phone number.</p>
                                <Button onClick={handleSubmit(handlePurchase)}>Purchase Phone Number</Button>
                            </Form.Group>
                        </>
                    )}
                </div>

            </Row>
        </Container>
    );
}

export default PhoneNumberPurchase;