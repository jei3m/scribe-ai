import React, { useState } from 'react';
import Modal from 'react-modal'; // Import React Modal
import { UserAuth } from '../context/AuthContext';
import './Header.css'; // Import the new CSS file

// Set app element for accessibility (optional)
Modal.setAppElement('#root');

function Header() {
  const { logOut, currentUser } = UserAuth(); // Get logOut function and currentUser from context
  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal visibility state

  // Open and close modal functions
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  // Log currentUser for debugging
  console.log('Current User:', currentUser);

  return (
    <header className="header">
      <a href='/' className="header__logo">
        <span className="header__logo--highlight">Jeiem</span>docs
      </a>
      <div className="header__user">
        {currentUser && (
          <>
            <img
              src={currentUser.photoURL}
              alt='User Avatar'
              className="header__user-avatar"
              onClick={openModal} // Open modal on click
            />
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              style={{
                overlay: {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent dark background
                  zIndex: 1000 // Ensure it's above other content
                },
                content: {
                  top: '50%',
                  left: '50%',
                  right: 'auto',
                  bottom: 'auto',
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '8px',
                  padding: '2rem',
                  width: '300px',
                  textAlign: 'center',
                  backgroundColor: '#F8F8FF', // Ensure content background is white
                  border: 'none' // Remove default border
                }
              }}
              contentLabel='Profile Modal'
            >
              <h2 className='modal_h2'>User Profile</h2>
              <img
                src={currentUser.photoURL}
                alt='User Avatar'
                className="modal__user-avatar"
              />
              <p><strong>Name:</strong> {currentUser.displayName || 'No name provided'}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <div className="modal__buttons">
                <button
                  onClick={closeModal}
                  className="modal__button modal__button--close"
                >
                  Close
                </button>
                <button
                  onClick={logOut}
                  className="modal__button modal__button--logout"
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
