import { ArrowLeft, CalendarDays, Clock, MapPin, Ticket } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters.js';

export default function EventDetailPage({ event, onBack, onCheckout }) {
  if (!event) {
    return (
      <section className="empty-state">
        <h2>Event not found</h2>
        <button onClick={onBack}>Back to events</button>
      </section>
    );
  }

  const priceLabel = event.priceFrom > 0 ? `From ${formatCurrency(event.priceFrom)}` : 'Price to be confirmed';

  return (
    <section className="detail-layout">
      <button className="ghost-button" onClick={onBack}>
        <ArrowLeft size={18} />
        Back to lineup
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
            <span><Ticket size={18} /> {priceLabel}</span>
          </div>
          <button className="primary-button" onClick={() => onCheckout(event.id)}>
            Select tickets
          </button>
        </div>
      </article>

      <section className="zones-panel">
        <div className="section-heading compact">
          <div>
            <span>Availability</span>
            <h2>Zones and prices</h2>
          </div>
        </div>
        <div className="zone-list">
          {(event.zones ?? []).map((zone) => (
            <article key={zone.id} className="zone-item">
              <div>
                <strong>{zone.name}</strong>
                <span>{zone.available} spots available</span>
              </div>
              <b>{formatCurrency(zone.price)}</b>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
