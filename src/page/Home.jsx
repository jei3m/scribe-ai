import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import HomeCreate from '../components/HomeCreate';
import DocsItem from '../components/DocsItem';
import HomeModal from '../components/HomeModal';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { UserAuth } from '../context/AuthContext';
import LoadingElement from '../components/LoadingElement';

const Home = () => {
  const [docs, setDocs] = useState([]); // State for documents
  const [isDocsLoading, setIsDocsLoading] = useState(true); // State for loading status
  const { currentUser } = UserAuth(); // Authentication context
  const [isAdd, setIsAdd] = useState(false); // State for modal visibility

  useEffect(() => {
    if (currentUser) {
      // Listen for changes in the 'docs-data' collection
      const unsubscribe = onSnapshot(collection(db, 'docs-data'), (snapshot) => {
        const userDocs = snapshot.docs
          .map(doc => doc.data().author === currentUser.email ? { ...doc.data(), id: doc.id } : null)
          .filter(doc => doc !== null);
        
        setDocs(userDocs); // Update state with user's documents
        setIsDocsLoading(false); // Loading complete
      });

      return () => unsubscribe(); // Cleanup subscription on component unmount
    }
  }, [currentUser]);

  return (
    <div className='home'>
      <Header />
      <HomeCreate setIsAdd={setIsAdd} />
      <div className='homeItems'>
        <p>{docs.length ? 'Your Documents:' : 'No Documents'}</p>
        <div className='homeItemContainer'>
          {isDocsLoading ? (
            <LoadingElement /> // Show loading spinner
          ) : docs.length ? (
            docs.map(doc => <DocsItem key={doc.id} value={doc} />) // Display documents
          ) : (
            <h2 style={{margin:'0'}}>Click the <span className='create-icon'>+</span> above to create one.</h2>
          )}
        </div>
      </div>
      {isAdd && <HomeModal setIsAdd={setIsAdd} existingDocs={docs} />} 
    </div> // Show modal if isAdd is true
  );
};

export default Home;
