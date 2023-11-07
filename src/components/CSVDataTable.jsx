import React from 'react';
import { Table } from 'react-bootstrap';

const CSVDataTable = () => {
    const data = [
        {
            first_name: "John",
            last_name: "Doe",
            phone: "(123) 456-7890",
            email: "johndoe@example.com",
            address: "123 Main St, Example City, EX 12345"
        },
        {
            first_name: "Jane",
            last_name: "Smith",
            phone: "(987) 654-3210",
            email: "janesmith@example.org",
            address: "456 Elm St, Sample Town, ST 67890"
        },
        {
            first_name: "Alice",
            last_name: "Johnson",
            phone: "(555) 777-9999",
            email: "alicejohnson@example.net",
            address: "789 Pine St, Testville, TV 11223"
        }
    ];

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>First_Name</th>
                    <th>Last_Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Address</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <tr key={index}>
                        <td>{row.first_name}</td>
                        <td>{row.last_name}</td>
                        <td>{row.phone}</td>
                        <td>{row.email}</td>
                        <td>{row.address}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default CSVDataTable;
