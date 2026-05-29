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
      setStatus({ type: 'error', message: error.message || 'Invalid credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    if (!passwordCriteria.hasLength || !passwordCriteria.hasUpper || !passwordCriteria.hasNumber) {
      setStatus({ type: 'error', message: 'The password does not meet the requirements.' });
      return;
    }

    if (!passwordsMatch) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setIsLoading(true);

    try {
      const user = await register({
        fullName: registerData.fullName,
        email: registerData.email,
        password: registerData.password
      });
      setStatus({ type: 'success', message: 'Account created successfully.' });
      setRegisterData(initialRegister);
      onAuthenticated(user);
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'We could not create the account.' });
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
          <p>Your events hub</p>
          <span />
        </aside>

        <div className="main-auth-content">
          <div className="main-auth-top">
            <div className="secure-access">
              <i />
              <span>Secure access</span>
            </div>

            <div className="auth-tabs" role="tablist" aria-label="User access">
              <button
                type="button"
                className={activeTab === 'signin' ? 'active' : ''}
                onClick={() => setActiveTab('signin')}
              >
                Sign in
              </button>
              <button
                type="button"
                className={activeTab === 'signup' ? 'active' : ''}
                onClick={() => setActiveTab('signup')}
              >
                Register
              </button>
            </div>
          </div>

          <h1>{activeTab === 'signin' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="main-auth-copy">
            {reason || (activeTab === 'signin'
              ? 'Enter your details to continue your OrbiX experience.'
              : 'Complete your details to buy tickets and save your events.')}
          </p>

          {status.message && (
            <div className={`form-status ${status.type}`}>
              {status.message}
            </div>
          )}

          {activeTab === 'signin' ? (
            <form className="main-auth-form" onSubmit={handleSignIn}>
              <label>
                Email
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(event) => setLoginData({ ...loginData, email: event.target.value })}
                  placeholder="usuario@orbix.com"
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(event) => setLoginData({ ...loginData, password: event.target.value })}
                  placeholder="Enter your password"
                  required
                />
              </label>

              <button className="main-auth-submit" type="submit" disabled={isLoading}>
                {isLoading ? 'Validating...' : 'Sign in'}
              </button>
            </form>
          ) : (
            <form className="main-auth-form" onSubmit={handleSignUp}>
              <label>
                Full name
                <input
                  value={registerData.fullName}
                  onChange={(event) => setRegisterData({ ...registerData, fullName: event.target.value })}
                  placeholder="Your name"
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(event) => setRegisterData({ ...registerData, email: event.target.value })}
                  placeholder="usuario@orbix.com"
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(event) => setRegisterData({ ...registerData, password: event.target.value })}
                  placeholder="Minimum 8 characters"
                  required
                />
              </label>

              {registerData.password && (
                <div className="password-rules">
                  <span className={passwordCriteria.hasLength ? 'valid' : 'invalid'}>Minimum 8 characters</span>
                  <span className={passwordCriteria.hasUpper ? 'valid' : 'invalid'}>One uppercase letter</span>
                  <span className={passwordCriteria.hasNumber ? 'valid' : 'invalid'}>One number</span>
                </div>
              )}

              <label>
                Confirm password
                <input
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(event) => setRegisterData({ ...registerData, confirmPassword: event.target.value })}
                  placeholder="Repeat your password"
                  required
                />
              </label>

              {registerData.confirmPassword && (
                <span className={passwordsMatch ? 'password-match valid' : 'password-match invalid'}>
                  {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                </span>
              )}

              <button className="main-auth-submit" type="submit" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          )}

          <small className="main-auth-footer">OrbiX 2026 - Your events hub</small>
        </div>
      </div>
    </section>
  );
}
