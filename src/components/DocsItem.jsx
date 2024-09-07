import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import publicIcon from '../assets/img/publicIcon.png';
import privateIcon from '../assets/img/privateIcon.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DocsItem.css';


function DocsItem({ value }) {
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [isOpen, setIsOpen] = useState(false); // State to toggle the options menu
  function handleClick(id) {
    navigate(`/document/${id}`);
  }

  
  // Delete the document from Firestore and close the options menu.
   
  async function handleDel() {
    setIsOpen(false); // Close the options menu
    await deleteDoc(doc(db, 'docs-data', value.id)); // Delete document
  }


   // Navigate to the document's view page.

  function handleOpenView() {
    setIsOpen(false); // Close the options menu
    navigate(`/document/${value.id}/view`);
  }

  
   // Copy the document view link to the clipboard if the document is public
   
  function handleCopyLink() {
    if (value.private) {
      toast.error('This document is private, the link cannot be copied.');
    } else {
      navigator.clipboard.writeText(
        `https://jeiem-docs.netlify.app/document/${value.id}/view`
      );
      toast.success('Link copied to clipboard!');
    }
    setIsOpen(false); // Close the options menu
  }

  
   
  // Toggle the visibility of the document between public and private.
   
  async function handleChangeV() {
    await updateDoc(doc(db, 'docs-data', value.id), {
      private: !value.private, // Toggle the private field
    });
    setIsOpen(false); // Close the options menu
  }

  return (
    <div className='docsItem'>
      <div className='docsItemContent'>
        <p onClick={() => handleClick(value.id)} className='docsTitle'>
          {value?.title}
        </p>
      </div>
      <div className='visibility'>
        {/* Display icon based on document privacy */}
        {value?.private === false ? (
          <img alt='Public Icon' style={{ width: '36px' }} src={publicIcon} />
        ) : (
          <img alt='Private Icon' style={{ width: '36px' }} src={privateIcon} />
        )}
      </div>
      <button className='docsItemBtn' onClick={() => setIsOpen(!isOpen)}>
        ...
      </button>
      {isOpen && (
        <div className='openModalCon'>
          <button onClick={() => handleClick(value.id)} className='opemModalBtn'>
            Edit Document
          </button>
          <button onClick={handleChangeV} className='opemModalBtn'>
            Change to {value?.private === true ? 'public' : 'private'}
          </button>
          <button onClick={handleOpenView} className='opemModalBtn'>
            Open view
          </button>
          <button onClick={handleCopyLink} className='opemModalBtn'>
            Copy view link
          </button>
          <button onClick={handleDel} className='opemModalBtn'>
            Delete
          </button>
        </div>
      )}
      <ToastContainer /> {/* Toast container for notifications */}
    </div>
  );
}

export default DocsItem;
