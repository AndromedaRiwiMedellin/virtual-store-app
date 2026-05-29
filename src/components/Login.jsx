import React, { useState, useEffect } from 'react';
import { login, register, googleAuth } from '../services/api'; 
import { GoogleLogin } from '@react-oauth/google'; 
import { jwtDecode } from 'jwt-decode'; 
import logoOrbix from '../assets/image.png';

// 🎯 VISTA PRINCIPAL (HOME) AGREGADA TEMPORALMENTE AQUÍ ADENTRO
function Home({ onLogout }) {
  return (
    <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#009990', fontSize: '28px', fontWeight: '700' }}>🚀 ¡Bienvenido a la Vista Principal de Orbix!</h2>
      <p style={{ color: '#64748b', marginTop: '10px' }}>Esta es la interfaz de administración del sistema (Home).</p>
      <button 
        onClick={onLogout}
        style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
      >
        Volver al Login alternativo
      </button>
    </div>
  );
}

export default function Login() {
  // 🎯 FUERZA EL INGRESO DIRECTO A HOME CAMBIANDO ESTE TRUE/FALSE
  const [isLoggedIn, setIsLoggedIn] = useState(true); 

  const [activeTab, setActiveTab] = useState('signin');
  const [backendError, setBackendError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [passwordCriteria, setPasswordCriteria] = useState({
    hasLength: false,
    hasUpper: false,
    hasNumber: false
  });
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  useEffect(() => {
    setBackendError('');
    setSuccessMessage('');
  }, [activeTab]);

  useEffect(() => {
    const pass = signUpData.password;
    setPasswordCriteria({
      hasLength: pass.length >= 8,
      hasUpper: /[A-Z]/.test(pass),
      hasNumber: /[0-9]/.test(pass)
    });
  }, [signUpData.password]);

  useEffect(() => {
    if (signUpData.password || signUpData.confirmPassword) {
      setPasswordsMatch(signUpData.password === signUpData.confirmPassword);
    } else {
      setPasswordsMatch(false);
    }
  }, [signUpData.password, signUpData.confirmPassword]);

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setBackendError('');
    setLoading(true);
    try {
      const response = await login(signInData.email, signInData.password);
      alert(`Welcome! ${response.message || 'Login successful.'}`);
      setIsLoggedIn(true); // Redirige al loguearse localmente
    } catch (error) {
      setBackendError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setBackendError('');
    setSuccessMessage('');

    const { hasLength, hasUpper, hasNumber } = passwordCriteria;
    if (!hasLength || !hasUpper || !hasNumber) {
      setBackendError('The password does not meet the requirements.');
      return;
    }
    if (!passwordsMatch) {
      setBackendError('The passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await register(
          signUpData.fullName,
          signUpData.email,
          signUpData.password,
          signUpData.confirmPassword
      );
      setSuccessMessage(response.message || 'Account successfully registered!');
      setSignUpData({ fullName: '', email: '', password: '', confirmPassword: '' });
      setActiveTab('signin');
    } catch (error) {
      setBackendError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setBackendError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const response = await googleAuth(
          decoded.sub,          
          decoded.email,        
          decoded.name,         
          decoded.picture       
      );
      setIsLoggedIn(true); // Redirige al loguearse con Google
    } catch (error) {
      setBackendError("Error de sincronización con el servidor de autenticación.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setBackendError("La autenticación con Google falló o fue cancelada.");
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc', color: '#334155', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', marginTop: '6px', marginBottom: '16px'
  };

  const labelStyle = { fontSize: '14px', fontWeight: '500', color: '#475569', display: 'block' };
  const separatorStyle = { display: 'flex', alignItems: 'center', textAlign: 'center', color: '#94a3b8', fontSize: '12px', margin: '20px 0' };
  const lineStyle = { flex: 1, borderBottom: '1px solid #e2e8f0' };

  // 🎯 CONDICIONAL: SI ESTÁ LOGUEADO, MUESTRA LA VISTA HOME DIRECTO
  if (isLoggedIn) {
    return <Home onLogout={() => setIsLoggedIn(false)} />;
  }

  // SI NO ESTÁ LOGUEADO, RENDERIZA EL FORMULARIO NORMAL
  return (
      <div style={{
        display: 'flex', width: '100%', maxWidth: '960px', minHeight: '540px',
        backgroundColor: '#ffffff', borderRadius: '20px', overflow: 'hidden',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <div style={{ flex: '1 1 45%', backgroundColor: '#009990', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#ffffff' }}>
          <img src={logoOrbix} alt="Orbix Logo" style={{ width: '120px', marginBottom: '20px' }} />
          <h2 style={{ fontSize: '32px', fontWeight: '700', margin: '0' }}>Orbix</h2>
          <p style={{ fontSize: '15px', color: '#E1FFBB', margin: '5px 0' }}>The center of your events</p>
        </div>

        <div style={{ flex: '1 1 55%', padding: '50px 60px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#009990', marginRight: '8px' }} />
            <span style={{ fontSize: '13px', color: '#009990', fontWeight: '600' }}>Secure access</span>
            <div style={{ marginLeft: 'auto' }}>
              <button type="button" onClick={() => setActiveTab('signin')} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: activeTab === 'signin' ? '#074799' : '#94a3b8', fontWeight: activeTab === 'signin' ? '700' : '400' }}>Get into</button>
              <button type="button" onClick={() => setActiveTab('signup')} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', marginLeft: '12px', color: activeTab === 'signup' ? '#074799' : '#94a3b8', fontWeight: activeTab === 'signup' ? '700' : '400' }}>Register</button>
            </div>
          </div>

          {backendError && <div style={{ padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' }}>{backendError}</div>}
          {successMessage && <div style={{ padding: '12px', backgroundColor: '#f0fdf4', border: '1px solid #86efac', color: '#166534', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' }}>{successMessage}</div>}

          {activeTab === 'signin' ? (
              <>
                <form onSubmit={handleSignInSubmit}>
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={signInData.email} onChange={(e) => setSignInData({ ...signInData, email: e.target.value })} placeholder="user@orbix.com" required style={inputStyle} />
                  <label style={labelStyle}>Password</label>
                  <input type="password" value={signInData.password} onChange={(e) => setSignInData({ ...signInData, password: e.target.value })} placeholder="••••••••" required style={inputStyle} />
                  <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#009990', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>{loading ? 'Processing...' : 'Sign In'}</button>
                </form>
                <div style={separatorStyle}><span style={lineStyle}></span><span style={{ padding: '0 10px' }}>or continue with</span><span style={lineStyle}></span></div>
                <div style={{ display: 'flex', justifyContent: 'center' }}><GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} theme="outline" size="large" width="100%" /></div>
              </>
          ) : (
              <>
                <form onSubmit={handleSignUpSubmit}>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" value={signUpData.fullName} onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })} placeholder="Juan Pérez" required style={inputStyle} />
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={signUpData.email} onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })} placeholder="user@orbix.com" required style={inputStyle} />
                  <label style={labelStyle}>Password</label>
                  <input type="password" value={signUpData.password} onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })} placeholder="••••••••" required style={inputStyle} />
                  <label style={labelStyle}>Confirm Password</label>
                  <input type="password" value={signUpData.confirmPassword} onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })} placeholder="••••••••" required style={inputStyle} />
                  <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#009990', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>{loading ? 'Creando cuenta...' : 'Registrar Cuenta'}</button>
                </form>
              </>
          )}
          <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '12px', color: '#94a3b8' }}>Orbix © 2026 — the center of your events</div>
        </div>
      </div>
  );
}