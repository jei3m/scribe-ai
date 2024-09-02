import React from 'react';
import './HomeCreate.css';

function HomeCreate({ setIsAdd }) {
	return (
		<div className='homeCreateDiv'>
			<div className='textContainer'>
				<p className='homeCreateText'>Start adding</p>
				<p className='homeCreateSubText'>DOCUMENTS</p>
			</div>
			<div className='buttonSeparatorContainer'>
				<button onClick={() => setIsAdd(true)} className='homeCreateBtn'>
					+
				</button>
			</div>
			<div className='separator' />
		</div>
	);
}

export default HomeCreate;
