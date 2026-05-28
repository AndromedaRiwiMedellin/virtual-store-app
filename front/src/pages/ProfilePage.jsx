import { Save, UserRound } from 'lucide-react';

export default function ProfilePage({ user }) {
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
          <input defaultValue={user?.fullName ?? 'Cliente OrbiX'} />
        </label>
        <label>
          Correo
          <input defaultValue={user?.email ?? ''} />
        </label>
        <label>
          Telefono
          <input defaultValue={user?.phone ?? ''} />
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
        <strong>Tu informacion</strong>
        <span>Manten tus datos actualizados para recibir tus entradas y novedades sin contratiempos.</span>
      </aside>
    </section>
  );
}
