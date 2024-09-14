// import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
// import React, { useEffect, useState, useRef } from 'react';
// import ReactQuill, { Quill } from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import { useNavigate, useParams } from 'react-router-dom';
// import { db } from '../firebase';
// import './Docs.css';
// import { UserAuth } from '../context/AuthContext';
// import Loading from './Loading';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowLeft, faFileAlt } from '@fortawesome/free-solid-svg-icons';
// import "quill/dist/quill.snow.css";
// import imageResize from 'quill-image-resize-module-react';
// import { GoogleGenerativeAI } from "@google/generative-ai"; // Import Google Generative AI SDK

// // Import Quill and register the imageResize module
// Quill.register('modules/imageResize', imageResize);

// // Toolbar options for ReactQuill
// const TOOL_BAR_OPTIONS = [
//   [{ header: [1, 2, 3, 4, 5, 6, false] }],
//   [{ font: [] }],
//   [{ list: 'ordered' }, { list: 'bullet' }],
//   ['bold', 'italic', 'underline'],
//   [{ align: [] }],
//   ['image', 'blockquote', 'code-block'],
// ];

// // ReactQuill modules configuration
// const modules = {
//   toolbar: {
//     container: TOOL_BAR_OPTIONS,
//   },
//   imageResize: {
//     modules: ["Resize", "DisplaySize"],
//   },
// };

// const apiKey = process.env.REACT_APP_API_KEY; // Store your API key in environment variables
// const genAI = new GoogleGenerativeAI(apiKey); // Initialize the Google AI SDK

// function Docs() {
//   const params = useParams();
//   const [editorData, setEditorData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const { currentUser } = UserAuth();
//   const navigate = useNavigate();
//   const editorRef = useRef(null);
//   const [suggestions, setSuggestions] = useState('');

//   useEffect(() => {
//     const documentUnsubscribe = onSnapshot(
//       doc(collection(db, 'docs-data'), params.id),
//       (res) => {
//         const data = res.data();
//         if (data.author !== currentUser.email) {
//           navigate('/error');
//         } else {
//           setEditorData(data.body);
//           setIsLoading(false);
//         }
//       }
//     );
//     return documentUnsubscribe;
//   }, [currentUser.email, params.id, navigate]);

//   // Function to generate AI suggestions using Google AI SDK
//   const generateAISuggestions = async (content) => {
//     try {
//       const model = genAI.getGenerativeModel({
//         model: "gemini-1.5-pro-exp-0827",
//         systemInstruction: `Only provide concise suggestions. You are a writer helper`,
//       });
//       const result = await model.generateContent(content);
//       const response = await result.response;
//       const text = await response.text();
//       setSuggestions(text);
//     } catch (error) {
//       console.error('Error generating AI suggestions:', error);
//     }
//   };

//   function handleChange(value) {
//     setEditorData(value);
//     generateAISuggestions(value); // Generate suggestions from AI based on the current content
//   }

//   useEffect(() => {
//     const updateDocumentTimeout = setTimeout(() => {
//       if (editorData !== null) {
//         updateDoc(doc(collection(db, 'docs-data'), params.id), {
//           body: editorData,
//         });
//       }
//     }, 500);
//     return () => clearTimeout(updateDocumentTimeout);
//   }, [editorData, params.id]);

//   function goToHome() {
//     navigate('/home');
//   }

//   return (
//     <div className='Docs-container'>
//       <div className='Docs'>
//         {isLoading ? (
//           <Loading />
//         ) : (
//           <>
//             <div className='editorContainer'>
//               <ReactQuill
//                 ref={editorRef}
//                 modules={modules}
//                 theme='snow'
//                 value={editorData}
//                 onChange={handleChange}
//                 className='ReactQuill'
//               />
//               <div className="suggestions">
//                 <p>{suggestions}</p> 
//               </div>
//             </div>
//           </>
//         )}
//         <div className='button-container'>
//           <button onClick={goToHome} className='backButton'>
//             <FontAwesomeIcon icon={faArrowLeft} /> Back
//           </button>
//           <button
//             onClick={() => {
//               window.print();
//             }}
//             className='printButton'
//           >
//             Print <FontAwesomeIcon icon={faFileAlt} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Docs;