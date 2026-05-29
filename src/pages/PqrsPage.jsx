import { Send } from 'lucide-react';

export default function PqrsPage() {
  return (
    <section className="form-page">
      <div className="section-heading compact">
        <div>
          <span>Soporte</span>
          <h1>Estado y respuestas de PQRS</h1>
        </div>
      </div>

      <form className="profile-form">
        <label>
          Tipo de solicitud
          <select defaultValue="Peticion">
            <option>Peticion</option>
            <option>Queja</option>
            <option>Reclamo</option>
            <option>Sugerencia</option>
          </select>
        </label>
        <label>
          Asunto
          <input placeholder="Ej. Problema con mi orden" />
        </label>
        <label className="full">
          Mensaje
          <textarea rows="6" placeholder="Describe tu solicitud" />
        </label>
        <button className="primary-button" type="button">
          <Send size={18} />
          Enviar solicitud
        </button>
      </form>

      <div className="status-panel">
        <strong>Ultima solicitud</strong>
        <span>PQRS-204 - En revision</span>
        <p>El equipo de soporte respondera desde el modulo administrativo.</p>
      </div>
    </section>
  );
}
