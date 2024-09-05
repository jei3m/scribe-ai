import React, { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Header from '../components/Header';

function Register() {
    const { signUpWithEmail} = UserAuth(); // Auth functions
    const navigate = useNavigate(); // Navigation hook

    const [name, setName] = useState(''); // State for name
    const [email, setEmail] = useState(''); // State for email
    const [pass, setPass] = useState(''); // State for password
    const [profilePic, setProfilePic] = useState(null); // State for profile picture
    const [isFormValid, setIsFormValid] = useState(false); // State for form validation
    const [error, setError] = useState(''); // State for error messages

    useEffect(() => {
        // Validate form inputs
        setIsFormValid(
            name.length > 0 && 
            email.length > 0 && 
            pass.length >= 6 && 
            profilePic !== null
        );
    }, [name, email, pass, profilePic]);

    function handleFileChange(e) {
        if (e.target.files[0]) {
            setProfilePic(e.target.files[0]); // Update profile picture
        }
    }

    async function handleRegister(e) {
        e.preventDefault(); // Prevent form submission
        setError('');
        try {
            if (signUpWithEmail) {
                await signUpWithEmail(email, pass, profilePic, name); // Register user
                navigate('/home'); // Redirect to home
            }
        } catch (e) {
            console.error('Error registering:', e);
            setError(`Registration failed: ${e.message}`); // Set error message
        }
    }

    return (
        <div className="Appokform">
            <Header/>
            <div className="Appcardform">
                <h2 style={{ fontSize: '2em', marginBottom:'14px' }}>Register</h2>
                <form className="auth-form-container" onSubmit={handleRegister}>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder="Full Name"
                        id="name"
                        name="name"
                    />
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Email"
                        id="email"
                        name="email"
                    />
                    <input
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        type="password"
                        placeholder="Password"
                        id="password"
                        name="password"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange} // Handle file input change
                    />
                    <button className="buttonform" type="submit" disabled={!isFormValid}>
                        Register
                    </button>
                </form>
                {error && <p className="error-message">{error}</p>} {/* Display error message */}
                <button className="link-btn" onClick={() => navigate('/')}>
                    Already have an account? Login here.
                </button>
            </div>
        </div>
    );
}

export default Register;
