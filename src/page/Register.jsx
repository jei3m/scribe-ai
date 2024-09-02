import React, { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Register() {
    const { signUpWithEmail, signInWithGoogle } = UserAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setIsFormValid(
            name.length > 0 && 
            email.length > 0 && 
            pass.length >= 6 && 
            profilePic !== null
        );
    }, [name, email, pass, profilePic]);

    function handleFileChange(e) {
        if (e.target.files[0]) {
            setProfilePic(e.target.files[0]);
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        setError('');
        try {
            if (signUpWithEmail) {
                await signUpWithEmail(email, pass, profilePic, name);
                navigate('/home');
            }
        } catch (e) {
            console.error('Error registering:', e);
            setError(`Registration failed: ${e.message}`);
        }
    }

    async function handleGoogleSignIn() {
        try {
            if (signInWithGoogle) {
                await signInWithGoogle();
                navigate('/home');
            }
        } catch (e) {
            console.error('Error signing in with Google:', e);
            setError(`Google sign-in failed: ${e.message}`);
        }
    }

    return (
        <div className="Appokform">
            <div className="Appcardform">
                <h2 style={{ fontSize: '2em' }}>Register</h2>
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
                        onChange={handleFileChange}
                    />
                    <button className="buttonform" type="submit" disabled={!isFormValid}>
                        Register
                    </button>
                </form>
                {error && <p className="error-message">{error}</p>}
                <button onClick={handleGoogleSignIn} className="google-login-btn">
                    <img
                        src='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png'
                        alt='Google logo'
                        className='google-logo'
                    />
                    <span className='google-btn-text'>Sign up with Google</span>
                </button>
                <button className="link-btn" onClick={() => navigate('/')}>
                    Already have an account? Login here.
                </button>
            </div>
        </div>
    );
}

export default Register;
