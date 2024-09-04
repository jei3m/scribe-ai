import React from 'react'
import { useNavigate } from 'react-router-dom'

function ErrorPage() {
	const navigate = useNavigate()
	return (
		<div className='ErrorPage'>
			<h1>File not found</h1>
			<button onClick={() => navigate('/home')}>Back to Home Page</button>
		</div>
	)
}

export default ErrorPage
