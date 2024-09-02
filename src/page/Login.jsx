import React, { useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

function Login() {
	const { currentUser, signInWithGoogle } = UserAuth();
	const navigate = useNavigate();

	async function signIn() {
		try {
			await signInWithGoogle();
		} catch (e) {
			console.error('Error signing in:', e);
		}
	}

	useEffect(() => {
		if (currentUser) {
			navigate('/home');
		}
	}, [currentUser, navigate]);

	return (
		<div className='login-container'>
			<h1 className='login-title'>Welcome to JM DOCS</h1>
			<p className='login-subtitle'>Sign in to access your documents and more</p>
			<button onClick={signIn} className='google-login-btn'>
				<img 
					src='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png' 
					alt='Google logo' 
					className='google-logo' 
				/>
				<span className='google-btn-text'>Sign in with Google</span>
			</button>
		</div>
	);
}

export default Login;
