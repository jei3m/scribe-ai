import React from 'react';
import { useNavigate } from 'react-router-dom';

function ErrorPage() {
    const navigate = useNavigate(); // Navigation hook for redirecting

    return (
        <div className='ErrorPage'>
            <h1>File not found</h1> {/* Display error message */}
            <button onClick={() => navigate('/home')}>Back to Home Page</button> {/* Navigate to home page */}
        </div>
    );
}

export default ErrorPage;
