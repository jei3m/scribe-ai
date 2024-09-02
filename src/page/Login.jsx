import React, { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

function Login() {
    const { currentUser, signInWithGoogle, signInWithEmail } = UserAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        if (currentUser) {
            navigate('/home');
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        // Basic form validation
        setIsFormValid(email.length > 0 && pass.length > 0);
    }, [email, pass]);

    async function handleEmailSignIn(e) {
        e.preventDefault();
        try {
            await signInWithEmail(email, pass);
            navigate('/home'); // Redirect to home or another page after successful sign-in
        } catch (e) {
            console.error('Error signing in with email:', e);
            // Optionally, set some state to show error message to the user
        }
    }

    async function handleGoogleSignIn() {
        try {
            await signInWithGoogle();
            navigate('/home'); // Redirect to home or another page after successful sign-in
        } catch (e) {
            console.error('Error signing in with Google:', e);
            // Optionally, set some state to show error message to the user
        }
    }

    return (
        <div className="Appokform"> {/* Wrapper for the form container, applies styling from a CSS class */}
            <div className="Appcardform"> {/* Card-like container for the login form */}
                <h2 style={{ fontSize: '2em' }}>Login</h2> {/* Header for the form with inline font size styling */}
                <form className="auth-form-container" onSubmit={handleEmailSignIn}> {/* Form container with submit handler */}
                    <input 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} // Update the email state on input change.
                        type="email" 
                        placeholder="Email" 
                        id="email" 
                        name="email" 
                    />
                    <input 
                        value={pass} 
                        onChange={(e) => setPass(e.target.value)} // Update the password state on input change.
                        type="password" 
                        placeholder="Password" 
                        id="password" 
                        name="password" 
                    />
                    <button className="buttonform" type="submit" disabled={!isFormValid}> {/* Disable button if form is not valid */}
                        Login
                    </button>
                </form>
                <button onClick={handleGoogleSignIn} className='google-login-btn'>
                    <img 
                        src='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png' 
                        alt='Google logo' 
                        className='google-logo' 
                    />
                    <span className='google-btn-text'>Sign in with Google</span>
                </button>
                <button className="link-btn" onClick={() => navigate('/register')}> {/* Button to navigate to the register page */}
                    Don't have an account? Register here.
                </button>
            </div>
        </div>
    );
}

export default Login;
