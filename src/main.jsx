import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// 1. AGREGAMOS ESTA IMPORTACIÓN AQUÍ ARRIBA:
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        {/* 2. ENVOLVEMOS EL <App /> CON EL PROVEEDOR DE GOOGLE */}
        {/* Recuerda cambiar luego el clientId por el tuyo real de Google Console */}
        <GoogleOAuthProvider clientId="15639194860-94g33vmsmna1ffp8ietkifrcc7pvh9uo.apps.googleusercontent.com">
            <App />
        </GoogleOAuthProvider>
    </StrictMode>,
)