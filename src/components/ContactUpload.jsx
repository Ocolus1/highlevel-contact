import React, { useState } from "react";
import axios from 'axios';
import { Button, Container, Row, Alert, Form } from 'react-bootstrap';
import CSVDataTable from "./CSVDataTable";


function ContactUpload({ setCurrentStep }) {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [businessEmail, setBusinessEmail] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setIsProcessed(false); // Reset the process state
    };

    const onEmailChange = (e) => {
        setBusinessEmail(e.target.value);
    };


    const handleProcess = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        
        if (file) {
            console.log(`Processing file: ${file.name}`);

            const formData = new FormData();
            formData.append('csv_file', file);
            formData.append('business_email', businessEmail);
    
            try {
                const response = await axios.post('http://localhost:8000/api/contact/upload_and_process/', formData);
                if (response.data.message) {
                    alert(response.data.message);
                    setTimeout(() => {
                        setCurrentStep(prev => prev + 1);
                    }, 2000);
                }
            } catch (error) {
                alert("There was an error processing the contacts.");
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
                    <Form.Label className="mt-2">Business Email</Form.Label>
                    <Form.Control type="email" placeholder="Business Email" onChange={onEmailChange} />
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
                </div>
                <Button type="submit" className="btn btn-primary">
                    {isLoading ? "loading..." : "Next"}
                </Button>
            </form>
        </div>
    );
}

export default ContactUpload;
