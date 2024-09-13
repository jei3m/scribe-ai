import { collection, doc, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../firebase'
import Loading from './Loading'
import { UserAuth } from '../context/AuthContext'
import ReactQuill from 'react-quill'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import './ViewDocs.css' 

function ViewDocs() {
	const params = useParams()
	const [textData, setTextData] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const navigate = useNavigate()
	const { currentUser } = UserAuth()

	useEffect(() => {
		const documentUnsubscribe = onSnapshot(
			doc(collection(db, 'docs-data'), params.id),
			res => {
				const data = res.data()
				if (data.author !== currentUser.email && data.private === true) {
					navigate('/error')
				} else {
					setTextData(data.body)
					setIsLoading(false)
				}
			}
		)
		return documentUnsubscribe
	}, [currentUser.email, params.id, navigate])

	function goToHome() {
		navigate('/home'); // Navigate to home page
	  }

	return (
		<div className='ViewDocs'>
		 <div className='view-docs-container'>
			{isLoading ? (
				<Loading />
			) : (
				<ReactQuill 
					value={textData} 
					readOnly={true} 
					className="responsive-quill view-only-quill" 
					modules={{toolbar: false}} // Disable toolbar
				/>
			)}
		 </div>
			<div className='button-container-view'>
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
		</div>
	)
}

export default ViewDocs
