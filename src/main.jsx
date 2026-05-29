import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import './styles/index.css';

import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="15639194860-bpc0p32b9mdnvdodeg9h30eqauqdma2q.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);