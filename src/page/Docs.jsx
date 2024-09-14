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
  const [isDragging, setIsDragging] = useState(false);
  const buttonRef = useRef(null);
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [touchStartPosition, setTouchStartPosition] = useState({ x: 0, y: 0 });

  const preventScroll = (e) => {
    e.preventDefault();
  };

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
    const selection = window.getSelection();
    const text = selection.toString().trim();
    setSelectedText(text);

    if (text) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const editorRect = editorRef.current.editor.root.getBoundingClientRect();

      setButtonPosition({
        x: rect.left - editorRect.left + rect.width / 2,
        y: rect.top - editorRect.top + 20 // 10px above the selection
      });
    }
  };

  // Text selection for touch devices
  // const handleTouchSelection = (e) => {
  //   handleTextSelection();
  // };

  // const handleMouseDown = (e) => {
  //   setIsDragging(true);
  //   const startX = e.pageX - buttonPosition.x;
  //   const startY = e.pageY - buttonPosition.y;

  //   // const handleMouseMove = (e) => {
  //   //   if (docsRef.current) {
  //   //     const rect = docsRef.current.getBoundingClientRect();
  //   //     const newX = e.pageX - startX;
  //   //     const newY = e.pageY - startY;

  //   //     setButtonPosition({
  //   //       x: Math.max(rect.left, Math.min(newX, rect.right - buttonRef.current.offsetWidth)),
  //   //       y: Math.max(rect.top, Math.min(newY, rect.bottom - buttonRef.current.offsetHeight)),
  //   //     });
  //   //   }
  //   // };

  //   // const handleMouseUp = () => {
  //   //   setIsDragging(false);
  //   //   document.removeEventListener('mousemove', handleMouseMove);
  //   //   document.removeEventListener('mouseup', handleMouseUp);
  //   // };

  //   // document.addEventListener('mousemove', handleMouseMove);
  //   // document.addEventListener('mouseup', handleMouseUp);
  // };

  // Drag handling for touch devices
  // const handleTouchStart = (e) => {
  //   const touch = e.touches[0];
  //   const startX = touch.pageX - buttonPosition.x;
  //   const startY = touch.pageY - buttonPosition.y;
  //   setTouchStartPosition({ x: startX, y: startY });
  //   setTouchStartTime(new Date().getTime());

  //   const handleTouchMove = (e) => {
  //     e.preventDefault();
  //     if (docsRef.current) {
  //       const rect = docsRef.current.getBoundingClientRect();
  //       const touch = e.touches[0];
  //       const newX = touch.pageX - startX;
  //       const newY = touch.pageY - startY;

  //       setButtonPosition({
  //         x: Math.max(rect.left, Math.min(newX, rect.right - buttonRef.current.offsetWidth)),
  //         y: Math.max(rect.top, Math.min(newY, rect.bottom - buttonRef.current.offsetHeight)),
  //       });
  //     }
  //   };

  //   const handleTouchEnd = (e) => {
  //     const touchEndTime = new Date().getTime();
  //     const touchDuration = touchEndTime - touchStartTime;
  //     const touch = e.changedTouches[0];
  //     const endX = touch.pageX - buttonPosition.x;
  //     const endY = touch.pageY - buttonPosition.y;
  //     const distance = Math.sqrt(
  //       Math.pow(endX - touchStartPosition.x, 2) + Math.pow(endY - touchStartPosition.y, 2)
  //     );

  //     if (touchDuration < 200 && distance < 10) {
  //       // This was a tap, not a drag
  //       handleDoubleClick(e);
  //     }

  //     document.removeEventListener('touchmove', handleTouchMove);
  //     document.removeEventListener('touchend', handleTouchEnd);
  //   };

  //   document.addEventListener('touchmove', handleTouchMove, { passive: false });
  //   document.addEventListener('touchend', handleTouchEnd);
  // };

  const handleSingleClick = () => {
    navigate('/chat', { state: { selectedText } });
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
              {selectedText && (
                <button
                  ref={buttonRef}
                  className='askAiButton'
                  style={{
                    left: `${buttonPosition.x}px`,
                    top: `${buttonPosition.y}px`,
                  }}
                  onClick={handleSingleClick} // Change to onClick
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
          <button onClick={() => navigate('/chat')} className='printButton'>
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
    </div>
  );
}

export default Docs;
