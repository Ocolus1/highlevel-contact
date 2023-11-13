import React from "react";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();

    let errorMessage = 'An unexpected error has occurred';

    if (error instanceof Error) {
        // error is now treated as an Error object
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        // error is a string
        errorMessage = error;
    }

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{errorMessage}</i>
            </p>
        </div>
    );
}
