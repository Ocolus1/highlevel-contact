import React, { useState } from "react";
import axios from 'axios';
import { Button } from 'react-bootstrap';
import CSVDataTable from "./CSVDataTable";
import { Alert } from 'react-bootstrap';


function ContactUpload({ authToken, getUser, setCurrentStep }) {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showFailureAlert, setShowFailureAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };



    const handleProcess = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setShowFailureAlert(false)
        setShowSuccessAlert(false)
        
        if (file) {
            console.log(`Processing file: ${file.name}`);

            const formData = new FormData();
            formData.append('csv_file', file);
    
            try {
                const response = await axios.post(`${import.meta.env.VITE_REST_ENDPOINT}/api/contact/upload_and_process/`, 
                formData,
                    {
                        headers: {
                            Authorization: `Token ${authToken}`
                        }
                    }
                );
                if (response.data.message) {
                    setShowSuccessAlert(true)
                    setSuccess(response.data.message)
                    setTimeout(async () => {
                        await getUser();
                    }, 2000);
                }
            } catch (error) {
                console.error(error)
                setShowFailureAlert(true)
                setError(error.response.data.error)
            }
            // Once processed:
            setIsLoading(false);
        }
    };
    

    return (
        <div>
            <h3>Upload Contacts</h3>
            <form onSubmit={handleProcess}>
                <div className="mb-3">
                    <label>Note: Let the Headings be separated by an underscore {"( _ )"}</label> <br/>
                    <label>Note: Only csv files are accepted.</label> <br/>
                    <h6 className="my-2">Acceptable sample.</h6> 
                    <CSVDataTable />
                    <label htmlFor="contactFile" className="form-label mt-3">
                        Choose a CSV file
                    </label>
                    <input
                        type="file"
                        className="form-control"
                        id="contactFile"
                        accept=".csv"
                        onChange={handleFileChange}
                    />
                    {showFailureAlert && <Alert variant="danger" className="my-2">{error}</Alert>}
                    {showSuccessAlert && (<>
                        <Alert variant="success" className="my-2">{success}!</Alert>
                        <p>If page dosen't redirect in 10 seconds click the button bellow</p>
                        <Button className="ml-2 my-2" onClick={() => setCurrentStep(prev => prev + 1)}>Next</Button>
                    </>)}
                </div>
                <Button type="submit" className="btn btn-primary">
                    {isLoading ? "loading..." : "Upload Contacts"}
                </Button>
            </form>
        </div>
    );
}

export default ContactUpload;
