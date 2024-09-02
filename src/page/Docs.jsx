import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import '../style/style.css';
import './Docs.css';
import { UserAuth } from '../context/AuthContext';
import Loading from './Loading';

const TOOL_BAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline'],
  [{ align: [] }],
];

const modules = {
  toolbar: {
    container: TOOL_BAR_OPTIONS,
  },
};

function Docs() {
  const params = useParams();
  const [editorData, setEditorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = UserAuth();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  useEffect(() => {
    const documentUnsubscribe = onSnapshot(
      doc(collection(db, 'docs-data'), params.id),
      (res) => {
        const data = res.data();
        if (data.author !== currentUser.email) {
          navigate('/error');
        } else {
          setEditorData(data.body);
          setIsLoading(false);
        }
      }
    );
    return documentUnsubscribe;
  }, [currentUser.email, params.id, navigate]);

  function handleChange(value) {
    setEditorData(value);
  }

  useEffect(() => {
    const updateDocumentTimeout = setTimeout(() => {
      if (editorData !== null) {
        updateDoc(doc(collection(db, 'docs-data'), params.id), {
          body: editorData,
        });
      }
    }, 500);
    return () => clearTimeout(updateDocumentTimeout);
  }, [editorData, params.id]);

  function goToHome() {
    navigate('/home');
  }

  useEffect(() => {
    const preventOverflow = () => {
      if (editorRef.current) {
        const editor = editorRef.current.getEditor();
        if (editor) {
          const maxHeight = 1120; // Adjust based on your height requirement
          const container = editor.root.parentNode;
  
          // Get the content height
          const contentHeight = editor.root.scrollHeight;
  
          // Check if the content exceeds max height
          if (contentHeight > maxHeight) {
            editor.root.style.overflow = 'hidden';
            editor.root.style.height = `${maxHeight}px`;
            editor.disable(); // Disable further editing
          } else {
            editor.root.style.overflow = 'hidden'; // Ensure no scrolling is enabled
            editor.root.style.height = 'auto';
            editor.enable(); // Enable editing if content height is within limit
          }
        }
      }
    };

    // Check and prevent overflow on text change
    const editor = editorRef.current?.getEditor();
    if (editor) {
      editor.on('text-change', preventOverflow);
    }

    return () => {
      if (editor) {
        editor.off('text-change', preventOverflow);
      }
    };
  }, []);

  return (
    <div className='Docs'>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className='button-container'>
            <button onClick={goToHome} className='backButton'>
              Back
            </button>
            <button
              onClick={() => {
                window.print();
              }}
              className='printButton'
            >
              Print
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
