import { Building2 } from 'lucide-react';
import { venues } from '../data/events.js';

export default function VenueStrip() {
  return (
    <section className="venue-strip">
      <div className="section-heading compact">
        <div>
          <span>Venues</span>
          <h2>Active places</h2>
        </div>
      </div>
      <div className="venue-list">
        {venues.map((venue) => (
          <article key={venue.name} className="venue-item">
            <Building2 size={20} />
            <div>
              <strong>{venue.name}</strong>
              <span>{venue.city} - {venue.events} events</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
