import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import publicIcon from '../assets/img/publicIcon.png'
import privateIcon from '../assets/img/privateIcon.png'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './DocsItem.css'

function DocsItem({ value }) {
	const navigate = useNavigate()
	const [isOpen, setIsOpen] = useState(false)

	function handleClick(id) {
		navigate(`/document/${id}`)
	}

	async function handleDel() {
		setIsOpen(false)
		await deleteDoc(doc(db, 'docs-data', value.id))
	}

	function handleOpenView() {
		setIsOpen(false)
		navigate(`/document/${value.id}/view`)
	}

	function handleCopyLink() {
		if (value.private) {
			toast.error('This document is private, the link cannot be copied.')
		} else {
			navigator.clipboard.writeText(
				`http://jeiem-docs.netlify.app//document/${value.id}/view`
			)
			toast.success('Link copied to clipboard!')
		}
		setIsOpen(false)
	}

	function handleChangeV() {
		updateDoc(doc(db, 'docs-data', value.id), {
			private: !value.private,
		})
		setIsOpen(false)
	}

	return (
		<div className='docsItem'>
			<p onClick={() => handleClick(value.id)}>{value?.title}</p>
			{value?.private === false ? (
				<img alt='img' style={{ width: '36px' }} src={publicIcon} />
			) : (
				<img alt='img' style={{ width: '36px' }} src={privateIcon} />
			)}
			<button className='docsItemBtn' onClick={() => setIsOpen(!isOpen)}>
				...
			</button>
			{isOpen && (
				<div className='openModalCon'>
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
			<ToastContainer />
		</div>
	)
}

export default DocsItem
