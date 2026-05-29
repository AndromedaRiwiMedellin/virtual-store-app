import React, { useState, useEffect } from 'react';
import { login, register, googleAuth } from '../services/api'; // <-- Importamos googleAuth
import { GoogleLogin } from '@react-oauth/google'; // <-- Botón oficial de Google
import { jwtDecode } from 'jwt-decode'; // <-- Para leer los datos devueltos por Google
import logoOrbix from '../assets/image.png';

export default function Login() {
  const [activeTab, setActiveTab] = useState('signin');
  const [backendError, setBackendError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Datos de los formularios
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Validaciones de contraseña
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

  // Manejo de envío manual: Inicio de Sesión
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setBackendError('');
    setLoading(true);
    try {
      const response = await login(signInData.email, signInData.password);
      alert(`Welcome! ${response.message || 'Login successful.'}`);
    } catch (error) {
      setBackendError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejo de envío manual: Registro
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

  // 🔥 NUEVO MANEJADOR: Éxito con la autenticación de Google
  const handleGoogleSuccess = async (credentialResponse) => {
    setBackendError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      // 1. Decodificar el Token JWT seguro enviado por los servidores de Google
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Datos decodificados de Google:", decoded);

      // 2. Disparar petición al Backend cumpliendo tus 4 reglas de negocio
      const response = await googleAuth(
          decoded.sub,          // googleId único
          decoded.email,        // email
          decoded.name,         // fullName
          decoded.picture       // profileImage
      );

      console.log("Respuesta de .NET:", response);
      alert(`¡Autenticación con Google exitosa! ${response.message}`);

    } catch (error) {
      console.error("Error conectando al backend:", error);
      setBackendError("Error de sincronización con el servidor de autenticación.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setBackendError("La autenticación con Google falló o fue cancelada.");
  };

  // Estilos comunes para los inputs
  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    color: '#334155',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    marginTop: '6px',
    marginBottom: '16px',
    transition: 'border-color 0.2s'
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#475569',
    display: 'block'
  };

  // Estilos para el separador "O"
  const separatorStyle = {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '12px',
    margin: '20px 0'
  };

  const lineStyle = {
    flex: 1,
    borderBottom: '1px solid #e2e8f0'
  };

  return (
      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: '960px',
        minHeight: '540px',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>

        {/* COLUMNA IZQUIERDA: PANEL DE MARCA (TURQUESA) */}
        <div style={{
          flex: '1 1 45%',
          backgroundColor: '#009990',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: '#ffffff'
        }}>
          <img
              src={logoOrbix}
              alt="Orbix Logo"
              style={{ width: '120px', height: 'auto', marginBottom: '20px', filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.1))' }}
          />
          <h2 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>
            Orbix
          </h2>
          <p style={{ fontSize: '15px', color: '#E1FFBB', margin: '0 0 30px 0', fontWeight: '500' }}>
            The center of your events
          </p>
          <div style={{ width: '40px', height: '1px', backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: '30px' }} />
        </div>

        {/* COLUMNA DERECHA: FORMULARIOS */}
        <div style={{
          flex: '1 1 55%',
          padding: '50px 60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#ffffff'
        }}>

          {/* Selector de pestañas */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#009990' }} />
            <span style={{ fontSize: '13px', color: '#009990', fontWeight: '600' }}>Secure access</span>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
              <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  style={{
                    border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '13px',
                    fontWeight: activeTab === 'signin' ? '700' : '400',
                    color: activeTab === 'signin' ? '#074799' : '#94a3b8',
                    borderBottom: activeTab === 'signin' ? '2px solid #074799' : 'transparent',
                    paddingBottom: '2px'
                  }}
              >
                Get into
              </button>
              <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  style={{
                    border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '13px',
                    fontWeight: activeTab === 'signup' ? '700' : '400',
                    color: activeTab === 'signup' ? '#074799' : '#94a3b8',
                    borderBottom: activeTab === 'signup' ? '2px solid #074799' : 'transparent',
                    paddingBottom: '2px'
                  }}
              >
                Register
              </button>
            </div>
          </div>

          <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0' }}>
            {activeTab === 'signin' ? 'Welcome back' : 'Create an account'}
          </h3>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 32px 0' }}>
            {activeTab === 'signin' ? 'Enter your credentials to continue' : 'Fill in the fields to register on the platform'}
          </p>

          {backendError && (
              <div style={{ padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' }}>
                {backendError}
              </div>
          )}
          {successMessage && (
              <div style={{ padding: '12px', backgroundColor: '#f0fdf4', border: '1px solid #86efac', color: '#166534', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' }}>
                {successMessage}
              </div>
          )}

          {/* VISTA INICIAR SESIÓN */}
          {activeTab === 'signin' ? (
              <>
                <form onSubmit={handleSignInSubmit}>
                  <label style={labelStyle}>Email</label>
                  <input
                      type="email"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      placeholder="user@orbix.com"
                      required
                      style={inputStyle}
                  />

                  <label style={labelStyle}>Password</label>
                  <input
                      type="password"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      placeholder="••••••••"
                      required
                      style={inputStyle}
                  />

                  <button
                      type="submit"
                      disabled={loading}
                      style={{
                        width: '100%', padding: '12px', backgroundColor: '#009990', color: '#ffffff',
                        border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px'
                      }}
                  >
                    {loading ? 'Processing...' : 'Sign In'}
                  </button>
                </form>

                {/* Separador visual */}
                <div style={separatorStyle}>
                  <span style={lineStyle}></span>
                  <span style={{ padding: '0 10px' }}>or continue with</span>
                  <span style={lineStyle}></span>
                </div>

                {/* 🚀 BOTÓN DE GOOGLE PARA LOGIN */}
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      theme="outline"
                      size="large"
                      width="100%"
                  />
                </div>
              </>
          ) : (
              /* VISTA REGISTRO */
              <>
                <form onSubmit={handleSignUpSubmit}>
                  <label style={labelStyle}>Full Name</label>
                  <input
                      type="text"
                      value={signUpData.fullName}
                      onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                      placeholder="Juan Pérez"
                      required
                      style={inputStyle}
                  />

                  <label style={labelStyle}>Email</label>
                  <input
                      type="email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      placeholder="user@orbix.com"
                      required
                      style={inputStyle}
                  />

                  <label style={labelStyle}>Password</label>
                  <input
                      type="password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      placeholder="••••••••"
                      required
                      style={inputStyle}
                  />

                  {signUpData.password && (
                      <div style={{ padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px', fontSize: '12px' }}>
                        <div style={{ color: passwordCriteria.hasLength ? '#009990' : '#ef4444' }}>
                          {passwordCriteria.hasLength ? '✓' : '✕'} Minimum 8 characters
                        </div>
                        <div style={{ color: passwordCriteria.hasUpper ? '#009990' : '#ef4444', marginTop: '4px' }}>
                          {passwordCriteria.hasUpper ? '✓' : '✕'} At least one uppercase letter
                        </div>
                        <div style={{ color: passwordCriteria.hasNumber ? '#009990' : '#ef4444', marginTop: '4px' }}>
                          {passwordCriteria.hasNumber ? '✓' : '✕'} At least one number
                        </div>
                      </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={labelStyle}>Confirm Password</label>
                    {signUpData.confirmPassword && (
                        <span style={{ fontSize: '12px', fontWeight: '600', color: passwordsMatch ? '#009990' : '#ef4444' }}>
                    {passwordsMatch ? '✓ Matches' : '✕ Doesn\'t Match'}
                  </span>
                    )}
                  </div>
                  <input
                      type="password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      required
                      style={inputStyle}
                  />

                  <button
                      type="submit"
                      disabled={loading}
                      style={{
                        width: '100%', padding: '12px', backgroundColor: '#009990', color: '#ffffff',
                        border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px'
                      }}
                  >
                    {loading ? 'Creando cuenta...' : 'Registrar Cuenta'}
                  </button>
                </form>

                {/* Separador visual */}
                <div style={separatorStyle}>
                  <span style={lineStyle}></span>
                  <span style={{ padding: '0 10px' }}>or register with</span>
                  <span style={lineStyle}></span>
                </div>

                {/* 🚀 BOTÓN DE GOOGLE PARA REGISTRO */}
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      theme="outline"
                      size="large"
                      width="100%"
                  />
                </div>
              </>
          )}

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '12px', color: '#94a3b8' }}>
            Orbix © 2026 — the center of your events
          </div>
        </div>
      </div>
  );
}