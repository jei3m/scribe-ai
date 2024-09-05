import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import './Docs.css';
import { UserAuth } from '../context/AuthContext';
import Loading from './Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFileAlt } from '@fortawesome/free-solid-svg-icons';

// Toolbar options for ReactQuill
const TOOL_BAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline'],
  [{ align: [] }],
];

// ReactQuill modules configuration
const modules = {
  toolbar: {
    container: TOOL_BAR_OPTIONS,
  },
};

function Docs() {
  const params = useParams(); // Get document ID from URL parameters
  const [editorData, setEditorData] = useState(null); // State for editor content
  const [isLoading, setIsLoading] = useState(true); // State for loading status
  const { currentUser } = UserAuth(); // Authentication context
  const navigate = useNavigate(); // Navigation hook
  const editorRef = useRef(null); // Ref for ReactQuill component

  useEffect(() => {
    // Subscribe to document changes
    const documentUnsubscribe = onSnapshot(
      doc(collection(db, 'docs-data'), params.id),
      (res) => {
        const data = res.data();
        if (data.author !== currentUser.email) {
          navigate('/error'); // Redirect if user is not the author
        } else {
          setEditorData(data.body); // Set editor content
          setIsLoading(false); // Loading complete
        }
      }
    );
    return documentUnsubscribe; // Cleanup subscription on component unmount
  }, [currentUser.email, params.id, navigate]);

  function handleChange(value) {
    setEditorData(value); // Update editor content
  }

  useEffect(() => {
    // Debounce document update
    const updateDocumentTimeout = setTimeout(() => {
      if (editorData !== null) {
        updateDoc(doc(collection(db, 'docs-data'), params.id), {
          body: editorData,
        });
      }
    }, 500);
    return () => clearTimeout(updateDocumentTimeout); // Cleanup timeout
  }, [editorData, params.id]);

  function goToHome() {
    navigate('/home'); // Navigate to home page
  }

  return (
    <div className='Docs'>
      {isLoading ? (
        <Loading /> // Show loading spinner
      ) : (
        <>
          <div className='button-container'>
            <button onClick={goToHome} className='backButton'>
              <FontAwesomeIcon icon={faArrowLeft} /> Back
            </button>
            <button
              onClick={() => {
                window.print(); // Print the document
              }}
              className='printButton'
            >
              Print <FontAwesomeIcon icon={faFileAlt} />
            </button>
          </div>
          <div className='editorContainer'>
            <ReactQuill
              ref={editorRef}
              modules={modules}
              theme='snow'
              value={editorData}
              onChange={handleChange}
              className='ReactQuill'
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Docs;
