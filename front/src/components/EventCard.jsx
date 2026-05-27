import { ArrowUpRight, Heart, MapPin } from 'lucide-react';
import { formatCurrency, getDateParts } from '../utils/formatters.js';

export default function EventCard({ event, onOpen, isFeatured = false }) {
  const dateParts = getDateParts(event.date);

  return (
    <article className={isFeatured ? 'event-card featured' : 'event-card'}>
      <button className="favorite-dot" aria-label="Agregar a favoritos">
        <Heart size={17} />
      </button>
      <div className="event-media" style={{ backgroundImage: `url(${event.image})` }}>
        <span className="date-chip">
          <strong>{dateParts.day}</strong>
          <small>{dateParts.month}</small>
        </span>
      </div>
      <div className="event-content">
        <span className="event-category">{event.category}</span>
        <h3>{event.title}</h3>
        <p><MapPin size={15} /> {event.venue}, {event.city}</p>
        <div className="event-footer">
          <span>Desde {formatCurrency(event.priceFrom)}</span>
          <button onClick={() => onOpen(event.id)} aria-label={`Ver detalle de ${event.title}`}>
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
