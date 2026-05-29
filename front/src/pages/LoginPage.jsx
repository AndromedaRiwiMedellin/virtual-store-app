import { useEffect, useMemo, useState } from 'react';
import orbixMark from '../assets/orbix-mark.png';
import { login, register } from '../services/authApi.js';

const initialLogin = { email: '', password: '' };
const initialRegister = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
};

export default function LoginPage({ reason, onAuthenticated }) {
  const [activeTab, setActiveTab] = useState('signin');
  const [loginData, setLoginData] = useState(initialLogin);
  const [registerData, setRegisterData] = useState(initialRegister);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const passwordCriteria = useMemo(() => ({
    hasLength: registerData.password.length >= 8,
    hasUpper: /[A-Z]/.test(registerData.password),
    hasNumber: /[0-9]/.test(registerData.password)
  }), [registerData.password]);

  const passwordsMatch = registerData.password.length > 0
    && registerData.password === registerData.confirmPassword;

  useEffect(() => {
    setStatus({ type: '', message: '' });
  }, [activeTab]);

  const handleSignIn = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const user = await login(loginData);
      onAuthenticated(user);
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Credenciales invalidas.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    if (!passwordCriteria.hasLength || !passwordCriteria.hasUpper || !passwordCriteria.hasNumber) {
      setStatus({ type: 'error', message: 'La contrasena no cumple los requisitos.' });
      return;
    }

    if (!passwordsMatch) {
      setStatus({ type: 'error', message: 'Las contrasenas no coinciden.' });
      return;
    }

    setIsLoading(true);

    try {
      const user = await register({
        fullName: registerData.fullName,
        email: registerData.email,
        password: registerData.password
      });
      setStatus({ type: 'success', message: 'Cuenta creada correctamente.' });
      setRegisterData(initialRegister);
      onAuthenticated(user);
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'No fue posible crear la cuenta.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-page main-auth-page">
      <div className="main-auth-card">
        <aside className="main-auth-brand">
          <img src={orbixMark} alt="OrbiX" />
          <h2>OrbiX</h2>
          <p>El centro de tus eventos</p>
          <span />
        </aside>

        <div className="main-auth-content">
          <div className="main-auth-top">
            <div className="secure-access">
              <i />
              <span>Acceso seguro</span>
            </div>

            <div className="auth-tabs" role="tablist" aria-label="Acceso de usuarios">
              <button
                type="button"
                className={activeTab === 'signin' ? 'active' : ''}
                onClick={() => setActiveTab('signin')}
              >
                Ingresar
              </button>
              <button
                type="button"
                className={activeTab === 'signup' ? 'active' : ''}
                onClick={() => setActiveTab('signup')}
              >
                Registro
              </button>
            </div>
          </div>

          <h1>{activeTab === 'signin' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}</h1>
          <p className="main-auth-copy">
            {reason || (activeTab === 'signin'
              ? 'Ingresa tus datos para continuar con tu experiencia OrbiX.'
              : 'Completa tus datos para comprar entradas y guardar tus eventos.')}
          </p>

          {status.message && (
            <div className={`form-status ${status.type}`}>
              {status.message}
            </div>
          )}

          {activeTab === 'signin' ? (
            <form className="main-auth-form" onSubmit={handleSignIn}>
              <label>
                Correo electronico
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(event) => setLoginData({ ...loginData, email: event.target.value })}
                  placeholder="usuario@orbix.com"
                  required
                />
              </label>

              <label>
                Contrasena
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(event) => setLoginData({ ...loginData, password: event.target.value })}
                  placeholder="Ingresa tu contrasena"
                  required
                />
              </label>

              <button className="main-auth-submit" type="submit" disabled={isLoading}>
                {isLoading ? 'Validando...' : 'Ingresar'}
              </button>
            </form>
          ) : (
            <form className="main-auth-form" onSubmit={handleSignUp}>
              <label>
                Nombre completo
                <input
                  value={registerData.fullName}
                  onChange={(event) => setRegisterData({ ...registerData, fullName: event.target.value })}
                  placeholder="Tu nombre"
                  required
                />
              </label>

              <label>
                Correo electronico
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(event) => setRegisterData({ ...registerData, email: event.target.value })}
                  placeholder="usuario@orbix.com"
                  required
                />
              </label>

              <label>
                Contrasena
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(event) => setRegisterData({ ...registerData, password: event.target.value })}
                  placeholder="Minimo 8 caracteres"
                  required
                />
              </label>

              {registerData.password && (
                <div className="password-rules">
                  <span className={passwordCriteria.hasLength ? 'valid' : 'invalid'}>Minimo 8 caracteres</span>
                  <span className={passwordCriteria.hasUpper ? 'valid' : 'invalid'}>Una letra mayuscula</span>
                  <span className={passwordCriteria.hasNumber ? 'valid' : 'invalid'}>Un numero</span>
                </div>
              )}

              <label>
                Confirmar contrasena
                <input
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(event) => setRegisterData({ ...registerData, confirmPassword: event.target.value })}
                  placeholder="Repite tu contrasena"
                  required
                />
              </label>

              {registerData.confirmPassword && (
                <span className={passwordsMatch ? 'password-match valid' : 'password-match invalid'}>
                  {passwordsMatch ? 'Las contrasenas coinciden' : 'Las contrasenas no coinciden'}
                </span>
              )}

              <button className="main-auth-submit" type="submit" disabled={isLoading}>
                {isLoading ? 'Creando cuenta...' : 'Registrar cuenta'}
              </button>
            </form>
          )}

          <small className="main-auth-footer">OrbiX 2026 - El centro de tus eventos</small>
        </div>
      </div>
    </section>
  );
}
