import React from 'react';
import { useForm } from 'react-hook-form';
import { timezones, countries, countryCodes } from "../constants/countries.js"
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';

function SubAccount({ setCurrentStep }) {
    const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [showFailureAlert, setShowFailureAlert] = React.useState(false);
    const [showSupport, setShowSupportAlert] = React.useState(false);
    const [failureCount, setFailureCount] = React.useState(0);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        setLoading(true)
        // Preprocess the website field to match the specified format
        data.website = data.website.replace(/^(https?:\/\/)?(www\.)?/i, '').split('/')[0];

        // Construct the payload for the backend
        const payload = {
            "appointment_cost": data["appointmentCost"],
            "industry": data["industry"],
            "legal_business_name": data["legalBusinessName"],
            "business_name": data["businessName"],
            "business_region_operation": data["businessRegionOfOperation"],
            "business_email": data["businessEmail"],
            "business_phone": data["businessPhone"],
            "website": data["website"],
            "has_ein": data["hasEIN"] == "yes" ? true : false,
            "ein": data["EIN"],
            "business_type": data["businessType"],
            "address": data["address"],
            "city": data["city"],
            "state": data["state"],
            "zip_code": data["zipcode"],
            "country": data["country"],
            "timezone": data["timezone"],
            "first_name": data["contactFirstName"],
            "last_name": data["contactLastName"],
            "client_number": data["cellNumber"],
            "job_position": data["jobPosition"],
            "contact_email": data["contactEmail"],
            "contact_phone": data["contactPhone"],
        };

        // Make the POST request to the backend
        fetch("http://localhost:8000/api/subaccounts/create_subaccount/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.message == "Subaccount created successfully") {
                    setShowSuccessAlert(true);
                    setTimeout(() => {
                        setShowSuccessAlert(false);
                        setCurrentStep(prev => prev + 1);
                    }, 2000);
                } else {
                    setFailureCount(prev => prev + 1);
                    if (failureCount < 3) {
                        setShowFailureAlert(true);
                        setTimeout(() => {
                            setShowFailureAlert(false);
                        }, 2000);
                    } else {
                        setShowSupportAlert(true)
                        setTimeout(() => {
                            setShowSupportAlert(false);
                        }, 2000);
                        // Show contact support message
                    }
                }
                setLoading(false)
            });
    };


    const hasEIN = watch("hasEIN");
    return (
        <div>
            <Row className="justify-content-md-center mt-5">
                <Col xs={12} md={8}>
                    <Container className="mt-5">
                        <h2 className="mb-3">Client Onboarding</h2>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group className="mb-4">
                                <Form.Label>Cost per booked appointment</Form.Label>
                                <Form.Control type="number" {...register("appointmentCost", { required: true })} />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Industry</Form.Label>
                                <Form.Control type="text" defaultValue="roofing"  {...register("industry")} />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Legal Business Name</Form.Label>
                                <Form.Control type="text"  {...register("legalBusinessName", { required: true })} />
                                <small className="my-3 text-muted">
                                    Enter the EXACT business name as registered with the government.
                                    Confirm with a W2, W9, or CP 575. Not entering your name exactly
                                    can result in not receiving automatic authorization and can
                                    have you placed in the manual registration review queue
                                    (which could result in week(s) to month(s) approval).
                                </small>
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Business Name</Form.Label>
                                <Form.Control type="text" {...register("businessName", { required: true })} />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Business Regions of Operation</Form.Label>
                                <Form.Select multiple {...register("businessRegionOfOperation", { required: true })}>
                                    <option value="Africa">Africa</option>
                                    <option value="Asia / Pacific">Asia / Pacific</option>
                                    <option value="Europe">Europe</option>
                                    <option value="Latin America">Latin America</option>
                                    <option value="USA & Canada">USA & Canada</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Business Email</Form.Label>
                                <Form.Control type="email"  {...register("businessEmail", { required: true })} />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Business Phone</Form.Label>
                                <Form.Control type="tel" {...register("businessPhone", { required: true })} />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Website</Form.Label>
                                <Form.Control type="url"  {...register("website")} />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Do you have an EIN?</Form.Label>
                                <Form.Check type="radio" value="yes" label="Yes" {...register("hasEIN")} />
                                <Form.Check type="radio" value="no" label="No" {...register("hasEIN")} />
                            </Form.Group>
                            {hasEIN === "yes" && (
                                <Form.Group className="mb-4">
                                    <Form.Label>Enter EIN</Form.Label>
                                    <Form.Control type="text" {...register("EIN")} />
                                </Form.Group>
                            )}
                            <Form.Group className="mb-4">
                                <Form.Label>Business Type</Form.Label>
                                <Form.Select {...register("businessType", { required: true })}>
                                    <option value="Co-operative">Co-operative</option>
                                    <option value="Corporation">Corporation</option>
                                    <option value="Limited Liability Company Or Sole-Proprietorship">Limited Liability Company Or Sole-Proprietorship</option>
                                    <option value="Non-profit Corporation">Non-profit Corporation</option>
                                    <option value="Partnership">Partnership</option>
                                </Form.Select>
                            </Form.Group>
                            
                            <Form.Group className="mb-4">
                                <Form.Label>Business Address</Form.Label>
                                <Form.Control type="text" {...register("address", { required: true })} placeholder="Street Address" />
                                <small className="my-3 text-muted">
                                    Enter the EXACT business address as registered with the government.
                                    ADDITIONAL NOTE: If you have moved without updating your business 
                                    location with the government, it is NOT your current address. 
                                    It is the address that is registered and listed on government documents.
                                </small><br></br>
                                <Row className="mt-2">
                                    <Col>
                                        <Form.Control type="text"  {...register("city", { required: true })} placeholder="City" />
                                    </Col>
                                    <Col>
                                        <Form.Control type="text" {...register("state", { required: true })} placeholder="State" />
                                    </Col>
                                    <Col>
                                        <Form.Control type="text" {...register("zipcode", { required: true })} placeholder="Zipcode" />
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Country</Form.Label>
                                <Form.Select {...register("country", { required: true })}>
                                    {countries.map((name, index) => <option key={name} value={countryCodes[index]}>{name}</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Timezone</Form.Label>
                                <Form.Select {...register("timezone", { required: true })}>
                                    {timezones.map(timezone => <option key={timezone} value={timezone}>{timezone}</option>)}
                                </Form.Select>
                            </Form.Group>
                            <h5>Business Contact</h5>
                            <Form.Group className="mb-4">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="text" {...register("contactFirstName", { required: true })} />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" {...register("contactLastName", { required: true })} />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Client's Cell Number</Form.Label>
                                <Form.Control type="text" {...register("cellNumber", { required: true })} />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Job Position</Form.Label>
                                <Form.Control type="text" {...register("jobPosition", { required: true })} />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Contact Email</Form.Label>
                                <Form.Control type="email" {...register("contactEmail", { required: true })} />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Contact Phone</Form.Label>
                                <Form.Control type="tel" {...register("contactPhone", { required: true })} />
                            </Form.Group>
                            <div>
                                {showSuccessAlert && <Alert variant="success">Your data has been successfully submitted!</Alert>}
                                {showFailureAlert && <Alert variant="danger">Failed to submit. Please try again.</Alert>}
                                {showSupport && <Alert variant="danger">Contact Support, to fix your problem. </Alert>}
                            </div>
                            <Form.Group className="mb-4">
                                <Form.Check
                                    type="checkbox"
                                    required
                                    label={<span>I accept the <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer">Terms and Conditions</a></span>}
                                />
                            </Form.Group>
                            <Button type="submit" variant="primary">{loading ? "loading..." : "Next"}</Button>
                        </Form>
                    </Container>
                </Col>
            </Row>
        </div>
    );
}

export default SubAccount;