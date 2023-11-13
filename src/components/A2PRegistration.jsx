import React, { useState } from 'react';
import { Button, Container, Row, Alert, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from "axios";


function A2PRegistration({ setCurrentStep }) {
    const [loading, setLoading] = useState(false);
    const [a2pRegSuccess, setA2pRegSuccess] = useState(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const { register, handleSubmit} = useForm();

    const handleRegistration = async (data) => {
        setLoading(true);
        console.log(data)

        try {
            const response = await axios.post(`${import.meta.env.VITE_REST_ENDPOINT}/api/a2p/A2PRegistration/`, data);
            console.log(response)
            if (response.data.message) {
                setSuccess(response.data.message)
                setA2pRegSuccess(true);
                setTimeout(() => {
                    setCurrentStep(prev => prev + 1);
                }, 2000);
            }
            if (response.data.error) {
                setError(response.data.error)
            }
        } catch (error) {
            console.log(error)
            if (error.response.status == 500) {
                setError("A2PRegistration failed. please try again.")
            }
            setA2pRegSuccess(false);
        }
        // Once processed:
        setLoading(false);
    };
    return (
        <Container className="mt-3">
            <Row>
                <div>
                    <h3>A2PRegistration</h3>

                    {loading ? (
                        <Alert variant="info">A2PRegistration in progress...</Alert>
                    ) : a2pRegSuccess === true ? (
                            <Alert variant="success">{success}!</Alert>
                    ) : a2pRegSuccess === false ? (
                        <>
                            <Form.Group className="mb-4">
                                <Form.Label>Business Email</Form.Label>
                                <Form.Control type="email" {...register("businessEmail")} />
                                <Alert className="my-3" variant="danger">{error}</Alert>
                                <Button onClick={handleSubmit(handleRegistration)}>Start A2PRegistration</Button>
                            </Form.Group>
                        </>
                    ) : (
                        <>
                            <Form.Group className="mb-4">
                                <Form.Label>Business Email</Form.Label>
                                <Form.Control type="email" {...register("businessEmail")} />
                                <p className='my-2'>Click the button below to start Start A2PRegistration.</p>
                                <Button onClick={handleSubmit(handleRegistration)}>Start A2PRegistration</Button>
                            </Form.Group>
                        </>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="mt-4">
                    {<Button variant="secondary" onClick={() => setCurrentStep(prev => prev - 1)}>Previous</Button>}
                    {<Button className="ml-2" onClick={() => {
                        if (a2pRegSuccess == true) {
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

export default A2PRegistration;