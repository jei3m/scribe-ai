import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import '../style/style.css';
import './Docs.css';
import { UserAuth } from '../context/AuthContext';
import Loading from './Loading';
import Quill from 'quill';

// Define a custom blot for page breaks
const Block = Quill.import('blots/block');

class PageBreakBlot extends Block {
  static create() {
    let node = super.create();
    node.classList.add('page-break');
    return node;
  }

  static formats(node) {
    return true;
  }

  static value(node) {
    return true;
  }

  format(name, value) {
    super.format(name, value);
  }
}

PageBreakBlot.blotName = 'page-break';
PageBreakBlot.tagName = 'div';

Quill.register(PageBreakBlot);

// Define the toolbar options and custom handler
const TOOL_BAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, 7] }],
  [{ font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline'],
  [{ align: [] }],
];

const modules = {
  toolbar: {
    container: TOOL_BAR_OPTIONS,
    handlers: {
      'page-break': function () {
        const quill = this.quill;
        const range = quill.getSelection();
        if (range) {
          quill.insertEmbed(range.index, 'page-break', true);
        }
      }
    }
  }
};

function Docs() {
  const params = useParams();
  const [editorData, setEditorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = UserAuth();
  const navigate = useNavigate();

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
          <ReactQuill
            modules={modules}
            theme='snow'
            value={editorData}
            onChange={handleChange}
            className='ReactQuill'
          />
        </>
      )}
    </div>
  );
}

export default Docs;
