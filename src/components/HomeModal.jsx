import { useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import './HomeModal.css';

export default function HomeModal({ setIsAdd, existingDocs }) {
    const { addDocs } = UserAuth(); // Function to add a document
    const [isPrivate, setIsPrivate] = useState(true); // State for document privacy
    const [error, setError] = useState(null); // State for error messages
    const [text, setText] = useState(''); // State for document title

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (text === '') {
            setError('Document title is required'); // Validate title
            return;
        }
        if (text.length > 30) {
            setError('Title too long'); // Validate title length
            return;
        }
        if (existingDocs.some(doc => doc.title === text)) {
            setError('Document already exists'); // Check for duplicate title
            return;
        }
        addDocs(text, isPrivate); // Add document
        setIsAdd(false); // Close modal
    };

    // Toggle document privacy
    const handleCheckboxChange = () => {
        setIsPrivate(!isPrivate);
    };

    // Handle Enter key for form submission
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <div className='homeModalContainer'>
            <form onSubmit={handleSubmit} className='homeAddModal'>
                <input
                    type='text'
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='Add a Document Title'
                    className='homeModalInput'
                />
                <label className='homeModalLabel'>
                    Private
                    <input
                        type='checkbox'
                        checked={isPrivate}
                        onChange={handleCheckboxChange}
                    />
                </label>
                {error && (
                    <p className='homeModalError'>
                        {error}
                    </p>
                )}
                <div className='homeFlex'>
                    <button
                        type='button'
                        onClick={() => setIsAdd(false)}
                        className='homeModalCancel'
                    >
                        Cancel
                    </button>
                    <button
                        type='submit'
                        className='homeModalAdd'
                    >
                        Add
                    </button>
                </div>
            </form>
        </div>
    );
}
