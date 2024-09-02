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
  const [docs, setDocs] = useState([]);
  const [isDocsLoading, setIsDocsLoading] = useState(true);
  const { currentUser } = UserAuth();
  const [isAdd, setIsAdd] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = onSnapshot(collection(db, 'docs-data'), (snapshot) => {
        const userDocs = snapshot.docs
          .map(doc => doc.data().author === currentUser.email ? { ...doc.data(), id: doc.id } : null)
          .filter(doc => doc !== null);
        
        setDocs(userDocs);
        setIsDocsLoading(false);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  return (
    <div className='home'>
      <Header />
      <HomeCreate setIsAdd={setIsAdd} />
      <div className='homeItems'>
        <p>{docs.length ? 'Your Documents:' : 'No documents'}</p>
        <div className='homeItemContainer'>
          {isDocsLoading ? (
            <LoadingElement />
          ) : docs.length ? (
            docs.map(doc => <DocsItem key={doc.id} value={doc} />)
          ) : (
            <h2>Click the <span className='create-icon'>+</span> above to create one.</h2>
          )}
        </div>
      </div>
      {isAdd && <HomeModal setIsAdd={setIsAdd} existingDocs={docs} />}
    </div>
  );
};

export default Home;
