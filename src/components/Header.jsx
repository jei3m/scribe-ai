import React from 'react';
import { UserAuth } from '../context/AuthContext';

function Header() {
  const { logOut, currentUser } = UserAuth();

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #dee2e6',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000
    }}>
      <a href='/' style={{
        textDecoration: 'none',
        color: '#000',
        fontWeight: 'bold',
        fontSize: '1.8rem'
      }}>
        <span style={{ color: '#007bff' }}>Jeiem</span>docs
      </a>
      <div style={{
        display: 'flex',
        alignItems: 'center'
      }}>
        {currentUser && (
			<img
			src={currentUser.photoURL}
			alt='User Avatar'
			style={{
				width: '50px',
				height: '50px',
				borderRadius: '50%',
				marginRight: '1rem',
				border: '3px solid #007bff' // Added a border
			}}
/>
        )}
			<button
			onClick={logOut}
			style={{
				background: '#007bff',
				border: 'none',
				color: '#ffffff', // Fixed the typo for white color
				fontSize: '1rem',
				cursor: 'pointer',
				transition: 'background-color 0.3s ease, transform 0.3s ease',
				borderRadius: '4px',
				padding: '0.5rem 1rem',
				display: 'inline-block',
			}}
			onMouseOver={e => {
				e.currentTarget.style.backgroundColor = '#0056b3';
				e.currentTarget.style.transform = 'scale(1.05)';
			}}
			onMouseOut={e => {
				e.currentTarget.style.backgroundColor = '#007bff';
				e.currentTarget.style.transform = 'scale(1)';
			}}
			>
			Log Out
			</button>
      </div>
    </header>
  );
}

export default Header;
