import React, { useState } from 'react';
import { Button, Container, Row, Alert, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from "axios";


function A2PRegistration({ authToken, getUser, setCurrentStep }) {
    const [loading, setLoading] = useState(false);
    const [a2pRegSuccess, setA2pRegSuccess] = useState(null);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const { handleSubmit} = useForm();

    const handleRegistration = async () => {
        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_REST_ENDPOINT}/api/a2p/A2PRegistration/`,
                {},
                {
                    headers: {
                        Authorization: `Token ${authToken}`,
                        "Content-Type": "application/json",
                    }
                }
            );
            
            if (response.data.message) {
                setSuccess(response.data.message)
                setA2pRegSuccess(true);
                setTimeout(async () => {
                    await getUser();
                }, 2000);
            }
            if (response.data.error) {
                setError(response.data.error)
            }
        } catch (error) {
            console.log(error)
            setError(error.response.data.error)
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
                            <>
                                <Alert variant="success">{success}!</Alert>
                                <p>If page dosen't redirect in 10 seconds click the button bellow</p>
                                <Button className="ml-2 my-2" onClick={() => setCurrentStep(prev => prev + 1)}>Next</Button>
                            </>
                    ) : a2pRegSuccess === false ? (
                        <>
                            <Form.Group className="mb-4">
                                <Alert className="my-3" variant="danger">{error}</Alert>
                                <Button onClick={handleSubmit(handleRegistration)}>Start A2PRegistration</Button>
                            </Form.Group>
                        </>
                    ) : (
                        <>
                            <Form.Group className="mb-4">
                                <p className='my-4'>Click the button below to start Start A2PRegistration.</p>
                                <Button onClick={handleSubmit(handleRegistration)}>Start A2PRegistration</Button>
                            </Form.Group>
                        </>
                    )}
                </div>

            </Row>
        </Container>
    );
}

export default A2PRegistration;