import React from 'react';
import { useForm } from 'react-hook-form';
import { Container, TextField, FormControl, FormLabel, RadioGroup, Alert, FormControlLabel, Radio, Checkbox, FormGroup, Button, InputAdornment } from '@mui/material';

import axios from "axios";

function InspectionForm({ authToken, getUser, setCurrentStep }) {
    const { register, handleSubmit, watch } = useForm();
    const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [showFailureAlert, setShowFailureAlert] = React.useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        setShowFailureAlert(false);
        setShowSuccessAlert(false);

        try {
            const response = await axios.post(`${import.meta.env.VITE_REST_ENDPOINT}/api/inspection-details/`,
                data,
                {
                    headers: {
                        Authorization: `Token ${authToken}`,
                        "Content-Type": "application/json",
                    }
                }
            );

            if (response.data.message == "Inspection details added successfully") {

                setShowSuccessAlert(true);

                setTimeout(async () => {
                    setShowSuccessAlert(false);
                    await getUser();
                }, 2000);

            } else {
                setShowFailureAlert(true);
            }

        } catch (error) {
            console.error(error)
        }
        setLoading(false)
    };


    const tenPercent = watch("offer.10PercentOff");

    return (
        <Container maxWidth="sm" className='pb-4'>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Number of inspections */}
                <TextField
                    label="How many more inspections can you handle per week?"
                    type="number"
                    {...register("moreInspections")}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                />

                {/* Current capacity for jobs */}
                <TextField
                    label="Current capacity for jobs every week"
                    type="number"
                    {...register("jobCapacity")}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                />

                {/* Average jobs per week */}
                <TextField
                    label="Average jobs every week"
                    type="number"
                    {...register("averageJobs")}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                />

                {/* Payment method */}
                <FormControl component="fieldset" margin="normal">
                    <FormLabel>Do your customers pay primarily insurance or retail?</FormLabel>
                    <RadioGroup {...register("paymentMethod")}>
                        <FormControlLabel value="Insurance" control={<Radio />} label="Insurance" />
                        <FormControlLabel value="Retail" control={<Radio />} label="Retail" />
                    </RadioGroup>
                </FormControl>

                {/* Time to complete roof */}
                <TextField
                    label="Average time to complete a roof (weeks)"
                    type="number"
                    {...register("completionTime")}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                />

                {/* Supply costs increasing */}
                <FormControl component="fieldset" margin="normal">
                    <FormLabel>Are your supply costs from manufacturers increasing ?</FormLabel>
                    <RadioGroup row >
                        <FormControlLabel value="Yes" {...register("supplyCostsIncreasing")} control={<Radio />} label="Yes" />
                        <FormControlLabel value="No" {...register("supplyCostsIncreasing")} control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>

                {/* Prices increase range */}
                <FormGroup className="my-2">
                    <FormLabel>How much have your prices increased by over the past 1-2 years ?</FormLabel>
                    <TextField
                        label="Lower range of price increase"
                        type="number"
                        {...register("priceIncreaseLower")}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                    />
                    <TextField
                        label="Highest range of price increase"
                        type="number"
                        {...register("priceIncreaseUpper")}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                    />
                </FormGroup>

                {/* Special offer */}
                <FormGroup>
                    <FormLabel>Special offer for customers:</FormLabel>
                    <FormControlLabel
                        control={<Checkbox {...register("offer.10PercentOff")} />}
                        label="10% off"
                    />
                    {tenPercent && (
                        <TextField
                            label="Give us a range of how much 10% off typically is, so $1K-$5K for example"
                            {...register("offer.10PercentOff.text")}
                            placeholder="$1k-$5k"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                        />
                    )}
                    <FormControlLabel
                        control={<Checkbox {...register("offer.FreeRoofInspection")} />}
                        label="Free roof inspection"
                    />
                    <TextField
                        label="Other offer"
                        {...register("offer.Other")}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                    />
                </FormGroup>

                {/* Message sender name */}
                <TextField
                    label="Name to send messages from"
                    {...register("messageSender")}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                />

                <div className='my-3'>
                    {showSuccessAlert && <Alert severity="success">Your data has been successfully submitted!</Alert>}
                    {showFailureAlert && <Alert severity="error">Failed to submit. Please try again.</Alert>}
                </div>

                <Button type="submit" variant="contained" className="mt-4" color="primary">
                    Submit
                </Button>
            </form>
        </Container>
    );
}

export default InspectionForm;
