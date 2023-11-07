import React, { useState } from 'react';
import { Button, Container, Row, Alert, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from "axios";


function PhoneNumberPurchase({ setCurrentStep }) {
    const [loading, setLoading] = useState(false);
    const [purchaseSuccess, setPurchaseSuccess] = useState(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const { register, handleSubmit } = useForm();

    const handlePurchase = async (data) => {
        setLoading(true);
        
        try {
            const response = await axios.post('http://localhost:8000/api/phonenumber/purchase_phone_number/', data);
            if (response.data.message) {
                setSuccess(response.data.message)
                setPurchaseSuccess(true);
                setTimeout(() => {
                    setCurrentStep(prev => prev + 1);
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
                                <Form.Label>Business Email</Form.Label>
                                <Form.Control type="email" {...register("businessEmail")} />
                                <Alert variant="danger">{error || "Error purchasing phone number."}</Alert>
                                <Button onClick={handleSubmit(handlePurchase)}>Purchase Phone Number</Button>
                            </Form.Group>
                        </>
                    ) : (
                        <>
                            <Form.Group className="mb-4">
                                <Form.Label>Business Email</Form.Label>
                                <Form.Control type="email" {...register("businessEmail")} />
                                <p className='my-2'>Click the button below to purchase a phone number.</p>
                                <Button onClick={handleSubmit(handlePurchase)}>Purchase Phone Number</Button>
                            </Form.Group>
                        </>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="mt-4">
                    {<Button variant="secondary" onClick={() => setCurrentStep(prev => prev - 1)}>Previous</Button>}
                    {<Button className="ml-2" onClick={() => {
                        if (purchaseSuccess == true) {
                            setCurrentStep(prev => prev + 1)
                        }
                    }}>
                        Next
                    </Button>}
                </div>
            </Row>
        </Container>
    );
}

export default PhoneNumberPurchase;