import { LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useState } from 'react';
import { login, register } from '../services/authApi.js';

export default function LoginPage({ reason, onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegister = mode === 'register';

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const user = isRegister
        ? await register(form)
        : await login({ email: form.email, password: form.password });
      onAuthenticated(user);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Revisa tus datos e intentalo nuevamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <span className="event-category">Acceso de usuarios</span>
        <h1>{isRegister ? 'Crea tu cuenta OrbiX' : 'Inicia sesion para continuar'}</h1>
        <p>{reason || 'Accede a tus compras, favoritos y beneficios exclusivos de OrbiX.'}</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <label>
              Nombre completo
              <div className="auth-input">
                <UserRound size={18} />
                <input
                  value={form.fullName}
                  onChange={(event) => updateField('fullName', event.target.value)}
                  placeholder="Tu nombre"
                  required
                />
              </div>
            </label>
          )}

          <label>
            Correo electronico
            <div className="auth-input">
              <Mail size={18} />
              <input
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="correo@ejemplo.com"
                type="email"
                required
              />
            </div>
          </label>

          <label>
            Contrasena
            <div className="auth-input">
              <LockKeyhole size={18} />
              <input
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                placeholder="Tu contrasena"
                type="password"
                minLength={isRegister ? 8 : 1}
                required
              />
            </div>
          </label>

          {status.message && (
            <div className={`form-status ${status.type}`}>
              {status.message}
            </div>
          )}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Validando...' : isRegister ? 'Crear cuenta' : 'Ingresar'}
          </button>
        </form>

        <button
          className="auth-switch"
          type="button"
          onClick={() => {
            setMode(isRegister ? 'login' : 'register');
            setStatus({ type: '', message: '' });
          }}
        >
          {isRegister ? 'Ya tengo cuenta' : 'Crear una cuenta nueva'}
        </button>
      </div>
      <aside className="auth-note">
        <strong>Tu cuenta OrbiX</strong>
        <span>
          Guarda tus eventos favoritos, consulta tus entradas y recibe soporte personalizado desde un solo lugar.
        </span>
      </aside>
    </section>
  );
}
