import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import './Docs.css';
import { UserAuth } from '../context/AuthContext';
import Loading from './Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCommentDots, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import "quill/dist/quill.snow.css";
import imageResize from 'quill-image-resize-module-react';
import Chat from './Chat'; // Add this import
import Modal from 'react-modal'; // Add this import (you may need to install it: npm install react-modal)

// Set the app element for accessibility
Modal.setAppElement('#root');

Quill.register('modules/imageResize', imageResize);

const TOOL_BAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline'],
  [{ align: [] }],
  ['image', 'blockquote', 'code-block'],
];

const modules = {
  toolbar: {
    container: TOOL_BAR_OPTIONS,
  },
  imageResize: {
    modules: ["Resize", "DisplaySize"],
  },
};

function Docs() {
  const params = useParams();
  const [editorData, setEditorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = UserAuth();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [selectedText, setSelectedText] = useState('');
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Add this state
  const [showAnalyzeButton, setShowAnalyzeButton] = useState(true);

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

  const handleTextSelection = () => {
    if (isButtonPressed) return; // Don't update position if button is being pressed

    const selection = window.getSelection();
    const text = selection.toString().trim();
    setSelectedText(text);

    if (text) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const editorRect = editorRef.current.editor.root.getBoundingClientRect();

      setButtonPosition({
        x: rect.left - editorRect.left + rect.width / 2,
        y: rect.top - editorRect.top + 20
      });
      setShowAnalyzeButton(true); // Show the button when text is selected
    } else {
      setShowAnalyzeButton(false); // Hide the button when no text is selected
    }
  };

  const openChatModal = () => {
    setIsModalOpen(true);
    setShowAnalyzeButton(false);
    document.body.style.overflow = 'hidden'; // Add this line
  };

  const closeChatModal = () => {
    setIsModalOpen(false);
    setSelectedText('');
    document.body.style.overflow = 'auto'; // Add this line
  };

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
    <div className='Docs-container'>
      <div className='Docs'>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div
              className='editorContainer'
              onMouseUp={handleTextSelection}
              onTouchEnd={handleTextSelection} // Handle touch selection
            >
              <ReactQuill
                ref={editorRef}
                modules={modules}
                theme='snow'
                value={editorData}
                onChange={handleChange}
                className='ReactQuill'
              />
              {selectedText && showAnalyzeButton && (
                <button
                  ref={buttonRef}
                  className='askAiButton'
                  style={{
                    left: `${buttonPosition.x}px`,
                    top: `${buttonPosition.y}px`,
                    position: 'absolute', // Add this line
                    transform: 'translateX(-50%)', // Add this line
                  }}
                  onClick={openChatModal} // Change to onClick
                >
                  Analyze 🧠
                </button>
              )}
            </div>
          </>
        )}
        <div className='button-container'>
          <button onClick={goToHome} className='backButton'>
            <FontAwesomeIcon icon={faArrowLeft} /> Back
          </button>
          <button onClick={openChatModal} className='printButton'>
            ScribeAI 🧠
          </button>
          <button
            onClick={() => {
              window.print();
            }}
            className='printButton'
          >
            Print <FontAwesomeIcon icon={faFileAlt} />
          </button>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeChatModal}
        contentLabel="Chat Modal"
        className="chat-modal"
        overlayClassName="chat-modal-overlay"
      >
        <Chat selectedText={selectedText} onClose={closeChatModal} />
      </Modal>
    </div>
  );
}

export default Docs;
