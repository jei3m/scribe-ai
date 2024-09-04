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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFileAlt, faPrint } from '@fortawesome/free-solid-svg-icons';

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

  return (
    <div className='Docs'>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className='button-container'>
            <button onClick={goToHome} className='backButton'>
              <FontAwesomeIcon icon={faArrowLeft} /> Back
            </button>
            <button
              onClick={() => {
                window.print();
              }}
              className='printButton'
            >
              Print  <FontAwesomeIcon icon={faFileAlt} /> 
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
