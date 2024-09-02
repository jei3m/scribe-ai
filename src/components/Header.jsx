import React, { useState } from 'react';
import Modal from 'react-modal'; // Import React Modal
import { UserAuth } from '../context/AuthContext';

// Set app element for accessibility (optional)
Modal.setAppElement('#root');

function Header() {
  const { logOut, currentUser } = UserAuth();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  // Log currentUser for debugging
  console.log('Current User:', currentUser);

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
          <>
            <img
              src={currentUser.photoURL}
              alt='User Avatar'
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                marginRight: '1rem',
                border: '3px solid #007bff',
                cursor: 'pointer' // Add cursor pointer for clickable image
              }}
              onClick={openModal} // Open modal on click
            />
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              style={{
                content: {
                  top: '50%',
                  left: '50%',
                  right: 'auto',
                  bottom: 'auto',
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '8px',
                  padding: '2rem',
                  width: '300px',
                  textAlign: 'center'
                }
              }}
              contentLabel='Profile Modal'
            >
              <h2>User Profile</h2>
              <img
                src={currentUser.photoURL}
                alt='User Avatar'
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  marginBottom: '1rem',
				  marginTop: '10px'
                }}
              />
              <p><strong>Name:</strong> {currentUser.displayName || 'No name provided'}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <div style={{ marginTop: '1rem' }}>
                <button
                  onClick={closeModal}
                  style={{
                    background: '#6c757d',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    padding: '0.5rem 1rem',
                    display: 'inline-block',
                    marginRight: '0.5rem', // Add spacing between buttons
                    transition: 'background-color 0.3s ease, transform 0.3s ease' // Add transition
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.backgroundColor = '#5a6268'; // Lighter gray on hover
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.backgroundColor = '#6c757d'; // Original gray color
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Close
                </button>
                <button
                  onClick={logOut}
                  style={{
                    background: '#007bff',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease, transform 0.3s ease',
                    borderRadius: '4px',
                    padding: '0.5rem 1rem',
                    display: 'inline-block',
                    marginLeft: '0.5rem' // Add spacing between buttons
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
            </Modal>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
