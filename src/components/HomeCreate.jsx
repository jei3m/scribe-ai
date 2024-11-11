import React, { useState } from 'react';
import { Plus, FileText, ChevronDown } from 'lucide-react';
import './HomeCreate.css';

const HomeCreate = ({ setIsAdd }) => {

  return (
    <header className="headerCreate">
      <div className="container">
        <div className="header-content">
          <div className="title-container">
            <h1 className="main-title">Select text</h1>
            <p className="sub-title">to analyze with ScribeAI <span style={{ color: 'white' }}>🧠</span></p>
            <div className="title-underline"></div>
          </div>
          <button
            className='add-button'
            onClick={() => setIsAdd(true)}
          >
            <Plus className="plus-icon" />
            <span className="button-text">Add Document</span>
          </button>
        </div>
        <div className="recent-documents">
          <FileText className="file-icon" />
          <span className="recent-text">Recent Documents</span>
        </div>
      </div>
      {/* <div className="gradient-overlay"></div>
      <div className="bottom-border"></div> */}
    </header>
  );
};

export default HomeCreate;