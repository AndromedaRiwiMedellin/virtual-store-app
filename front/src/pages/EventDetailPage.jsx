import { ArrowLeft, CalendarDays, Clock, MapPin, Ticket } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters.js';

export default function EventDetailPage({ event, onBack, onCheckout }) {
  if (!event) {
    return (
      <section className="empty-state">
        <h2>Evento no encontrado</h2>
        <button onClick={onBack}>Volver a eventos</button>
      </section>
    );
  }

  return (
    <section className="detail-layout">
      <button className="ghost-button" onClick={onBack}>
        <ArrowLeft size={18} />
        Volver a la cartelera
      </button>

      <article className="detail-hero">
        <div className="detail-image" style={{ backgroundImage: `url(${event.image})` }} />
        <div className="detail-info">
          <span className="event-category">{event.category}</span>
          <h1>{event.title}</h1>
          <p>{event.description}</p>
          <div className="detail-meta-grid">
            <span><CalendarDays size={18} /> {formatDate(event.date)}</span>
            <span><Clock size={18} /> {event.time}</span>
            <span><MapPin size={18} /> {event.venue}</span>
            <span><Ticket size={18} /> Desde {formatCurrency(event.priceFrom)}</span>
          </div>
          <button className="primary-button" onClick={() => onCheckout(event.id)}>
            Seleccionar entradas
          </button>
        </div>
      </article>

      <section className="zones-panel">
        <div className="section-heading compact">
          <div>
            <span>Disponibilidad</span>
            <h2>Zonas y precios</h2>
          </div>
        </div>
        <div className="zone-list">
          {(event.zones ?? []).map((zone) => (
            <article key={zone.id} className="zone-item">
              <div>
                <strong>{zone.name}</strong>
                <span>{zone.available} cupos disponibles</span>
              </div>
              <b>{formatCurrency(zone.price)}</b>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
