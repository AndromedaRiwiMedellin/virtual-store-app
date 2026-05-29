import { Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPqrs, getMyPqrs } from '../services/pqrsApi.js';
import { formatDate } from '../utils/formatters.js';

const initialForm = {
  type: 'Peticion',
  subject: '',
  message: ''
};

const statusLabels = {
  OPEN: 'Abierta',
  ANSWERED: 'Respondida',
  CLOSED: 'Cerrada',
  IN_REVIEW: 'En revision'
};

function getStatusLabel(status) {
  return statusLabels[String(status ?? '').toUpperCase()] ?? status ?? 'Abierta';
}

export default function PqrsPage({ user }) {
  const [form, setForm] = useState(initialForm);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const loadRequests = () => {
    setIsLoading(true);
    getMyPqrs(user)
      .then(setRequests)
      .catch(() => {
        setStatus({
          type: 'error',
          message: 'No pudimos cargar tus solicitudes en este momento.'
        });
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadRequests();
  }, [user]);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setStatus({ type: '', message: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!form.subject.trim() || !form.message.trim()) {
      setStatus({ type: 'error', message: 'Completa el asunto y el mensaje para enviar tu solicitud.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      await createPqrs(user, form);
      setForm(initialForm);
      setStatus({ type: 'success', message: 'Solicitud enviada. Podras consultar el estado desde esta misma seccion.' });
      loadRequests();
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'No fue posible enviar la solicitud.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="form-page">
      <div className="section-heading compact">
        <div>
          <span>Soporte</span>
          <h1>Estado y respuestas de PQRS</h1>
        </div>
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>
          Tipo de solicitud
          <select value={form.type} onChange={(event) => handleChange('type', event.target.value)}>
            <option>Peticion</option>
            <option>Queja</option>
            <option>Reclamo</option>
            <option>Sugerencia</option>
          </select>
        </label>
        <label>
          Asunto
          <input
            value={form.subject}
            onChange={(event) => handleChange('subject', event.target.value)}
            placeholder="Ej. Problema con mi orden"
          />
        </label>
        <label className="full">
          Mensaje
          <textarea
            rows="6"
            value={form.message}
            onChange={(event) => handleChange('message', event.target.value)}
            placeholder="Describe tu solicitud"
          />
        </label>
        {status.message && (
          <div className={`form-status ${status.type}`}>
            {status.message}
          </div>
        )}
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          <Send size={18} />
          {isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
        </button>
      </form>

      <div className="status-panel">
        <strong>Mis solicitudes</strong>
        {isLoading ? (
          <p>Cargando solicitudes recientes.</p>
        ) : requests.length === 0 ? (
          <p>Aun no tienes solicitudes registradas.</p>
        ) : (
          <div className="pqrs-list">
            {requests.map((item) => (
              <article key={item.id} className="pqrs-item">
                <div>
                  <span>{item.type} - {getStatusLabel(item.status)}</span>
                  <strong>{item.subject}</strong>
                  <small>{formatDate(item.createdAt)}</small>
                </div>
                {item.responses?.length > 0 ? (
                  <p>{item.responses[item.responses.length - 1].response}</p>
                ) : (
                  <p>Tu solicitud esta en revision por el equipo de soporte.</p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
