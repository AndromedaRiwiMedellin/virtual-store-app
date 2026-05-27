import { LockKeyhole, Mail } from 'lucide-react';

export default function LoginPage({ reason }) {
  return (
    <section className="auth-page">
      <div className="auth-panel">
        <span className="event-category">Acceso de usuarios</span>
        <h1>Inicia sesión para continuar</h1>
        <p>{reason ?? 'Accede a tus compras, favoritos y beneficios exclusivos de OrbiX.'}</p>

        <form className="auth-form">
          <label>
            Correo electrónico
            <div className="auth-input">
              <Mail size={18} />
              <input placeholder="correo@ejemplo.com" type="email" />
            </div>
          </label>
          <label>
            Contraseña
            <div className="auth-input">
              <LockKeyhole size={18} />
              <input placeholder="Tu contraseña" type="password" />
            </div>
          </label>
          <button className="primary-button" type="button" disabled>
            Ingresar
          </button>
        </form>
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
