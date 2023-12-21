import React from 'react'
import { useForm, Controller } from 'react-hook-form';
import { Container, Card, TextField, Alert, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio, Checkbox, FormGroup, Select, MenuItem, InputLabel, Button } from '@mui/material';
import { timeZones } from "../constants/countries.js"
import axios from "axios";



export default function CalendarDetails({ authToken, getUser, setCurrentStep }) {
    const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [showFailureAlert, setShowFailureAlert] = React.useState(false);
    const { register, handleSubmit, watch, control } = useForm();


    const onSubmit = async (data) => {
        setLoading(true);
        setShowFailureAlert(false);
        setShowSuccessAlert(false);

        try {
            const response = await axios.post(`${import.meta.env.VITE_REST_ENDPOINT}/api/calendar/`,
                data,
                {
                    headers: {
                        Authorization: `Token ${authToken}`,
                        "Content-Type": "application/json",
                    }
                }
            );

            if (response.data.message == "Calendar details created successfully") {

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

    const notification = watch("notificationPreference");
    const bookingMethod = watch("bookingMethod");


    return (
        <div>
            <Container maxWidth="lg">
                <h2 className='my-3'>Calendar Details</h2>
                <Card variant="outlined" className="p-4">
                    <form onSubmit={handleSubmit(onSubmit)}>

                        {/* Select how to book appointments */}
                        <FormGroup className='mb-3'>
                            <FormControl component="fieldset">
                                <FormLabel id="bookingMethod">Which way you would prefer us to book appointments ?</FormLabel>
                                <RadioGroup aria-labelledby="bookingMethod" defaultValue="googleCalendar"  >
                                    <FormControlLabel value="googleCalendar" {...register("bookingMethod")} control={<Radio />} label="Google Calendar" />
                                    <FormControlLabel value="sendDirectly" {...register("bookingMethod")} control={<Radio />} label="Send appointment directly" />
                                </RadioGroup>
                            </FormControl>
                        </FormGroup>

                        {/* Email for direct appointments */}
                        {bookingMethod === "sendDirectly" && (
                            <FormGroup className='mb-3'>
                                <TextField
                                    label="Email for appointments"
                                    variant="outlined"
                                    {...register("appointmentEmail")}
                                />
                            </FormGroup>
                        )}

                        {/* Days and times for booking */}
                        <FormGroup className="my-3">
                            <InputLabel id="daysOfTheWeek">When can we book into your salespeople's calendars ?</InputLabel>
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                                <FormControlLabel
                                    key={day}
                                    control={<Checkbox {...register(`days.${day}`)} />}
                                    label={day}
                                />
                            ))}
                        </FormGroup>

                        {/* Timezone selection */}
                        <FormGroup className="my-3" sx={{ maxWidth: 500 }}>
                            <FormControl>
                                <InputLabel id="timezone-label">Timezone</InputLabel>
                                <Select
                                    labelId="timezone-label"
                                    label="Timezone"
                                    {...register("timezone")}
                                    defaultValue="GMT-06:00" // Default value can be adjusted
                                >
                                    {timeZones.map(tz => (
                                        <MenuItem key={tz.value} value={tz.value}>{tz.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </FormGroup>

                        {/* Inspection duration */}
                        <FormGroup className='mb-3'>
                            <FormControl component="fieldset">
                                <FormLabel id="inspections">How long are inspections ?</FormLabel>
                                <Controller
                                    name="inspectionDuration"
                                    control={control}
                                    rules={{ required: true }}
                                    defaultValue="30 mins" 
                                    render={({ field }) => (
                                        <RadioGroup row {...field}>
                                            {["30 mins", "45 mins", "1 hour", "1.5 hours", "2 hours"].map(duration => (
                                                <FormControlLabel key={duration} value={duration} control={<Radio />} label={duration} />
                                            ))}
                                        </RadioGroup>
                                    )}
                                />
                            </FormControl>
                        </FormGroup>

                        {/* Time buffer */}
                        <FormGroup className='mb-3'>
                            <FormControl component="fieldset">
                                <FormLabel id="timeBuffer">How much of a time buffer is needed between booked inspections ?</FormLabel>
                                <Controller
                                    name="timeBuffer"
                                    control={control}
                                    rules={{ required: true }}
                                    defaultValue="None"
                                    render={({ field }) => (
                                        <RadioGroup row {...field}>
                                            {["None", "15 mins", "30 mins", "45 mins", "1 hour", "1.5 hours"].map(buffer => (
                                                <FormControlLabel key={buffer} value={buffer} control={<Radio />} label={buffer} />
                                            ))}
                                        </RadioGroup>
                                    )}
                                />
                            </FormControl>
                        </FormGroup>

                        {/* Appointment reminder sequences */}
                        <FormGroup className='mb-3'>
                            <FormControl component="fieldset">
                                <FormLabel id="appointment">Do you want us to send appointment reminder sequences to inspections we book ?</FormLabel>
                                <RadioGroup aria-labelledby="appointment" defaultValue="yes" >
                                    <FormControlLabel value="yes" control={<Radio />} {...register("appointmentReminder")} label="Yes, If we are sending the appointments directly to you." />
                                    <FormControlLabel value="no" control={<Radio />} {...register("appointmentReminder")} label="No, if you have your own sequences/process." />
                                </RadioGroup>
                            </FormControl>
                        </FormGroup>

                        {/* Notification preferences */}
                        <FormGroup className='mb-3'>
                            <FormControl component="fieldset">
                                <FormLabel id="notification">How would you like notifications from us when we schedule inspections from the campaign ?</FormLabel>
                                <RadioGroup row aria-labelledby="notification" defaultValue="text" >
                                    <FormControlLabel value="text" {...register("notificationPreference")} control={<Radio />} label="Text" />
                                    <FormControlLabel value="email" {...register("notificationPreference")} control={<Radio />} label="Email" />
                                    <FormControlLabel value="both" {...register("notificationPreference")} control={<Radio />} label="Both" />
                                </RadioGroup>
                            </FormControl>
                        </FormGroup>

                        {/* Phone and email for notifications */}
                        {notification === "text" && (
                            <FormGroup className='mb-3'>
                                <TextField
                                    label="Phone number for notifications"
                                    variant="outlined"
                                    {...register("notificationPhoneNumber")}
                                />
                            </FormGroup>
                        )}

                        {notification === "email" && (
                            <FormGroup className='mb-3'>
                                <TextField
                                    label="Email for notifications"
                                    variant="outlined"
                                    {...register("notificationEmail")}
                                />
                            </FormGroup>
                        )}

                        {notification === "both" && (
                            <>
                                <FormGroup className='mb-3'>
                                    <TextField
                                        label="Phone number for notifications"
                                        variant="outlined"
                                        {...register("notificationPhoneNumber")}
                                    />
                                </FormGroup>
                                <FormGroup className='mb-3'>
                                    <TextField
                                        label="Email for notifications"
                                        variant="outlined"
                                        {...register("notificationEmail")}
                                    />
                                </FormGroup>
                            </>
                        )}

                        <div className='my-3'>
                            {showSuccessAlert && <Alert severity="success">Your data has been successfully submitted!</Alert>}
                            {showFailureAlert && <Alert severity="error">Failed to submit. Please try again.</Alert>}
                        </div>

                        <Button type="submit" variant="contained" color="primary">
                            {loading ? "loading..." : "Submit"}
                        </Button>
                    </form>
                </Card>
            </Container>
        </div>
    )
}
