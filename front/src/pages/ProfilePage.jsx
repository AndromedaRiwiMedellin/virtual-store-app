import { Save, UserRound } from 'lucide-react';

export default function ProfilePage() {
  return (
    <section className="form-page">
      <div className="section-heading compact">
        <div>
          <span>Cuenta</span>
          <h1>Editar perfil personal</h1>
        </div>
      </div>

      <form className="profile-form">
        <label>
          Nombre completo
          <input defaultValue="Cliente OrbiX" />
        </label>
        <label>
          Correo
          <input defaultValue="cliente@orbix.local" />
        </label>
        <label>
          Teléfono
          <input defaultValue="+57 300 000 0000" />
        </label>
        <label>
          Ciudad
          <input defaultValue="Medellin" />
        </label>
        <button className="primary-button" type="button">
          <Save size={18} />
          Guardar cambios
        </button>
      </form>

      <aside className="profile-card">
        <UserRound size={28} />
        <strong>Tu información</strong>
        <span>Mantén tus datos actualizados para recibir tus entradas y novedades sin contratiempos.</span>
      </aside>
    </section>
  );
}
