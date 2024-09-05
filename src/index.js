import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Create root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app
root.render(
  <BrowserRouter>       {/* Provides routing capabilities */}
    <AuthProvider>     {/* Provides authentication context */}
      <React.StrictMode>
        <App />         {/* Main application component */}
      </React.StrictMode>
    </AuthProvider>
  </BrowserRouter>
);
