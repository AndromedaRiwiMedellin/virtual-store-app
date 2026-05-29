import { ArrowLeft, CalendarDays, Download, QrCode, Ticket, UserRound } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters.js';

function qrImageUrl(value) {
  const data = encodeURIComponent(value || 'ORBIX');
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${data}`;
}

export default function DigitalTicketPage({ purchase, onBack }) {
  const tickets = purchase?.tickets ?? [];

  if (!purchase || tickets.length === 0) {
    return (
      <section className="empty-state">
        <h2>No ticket selected.</h2>
        <p>Once you complete a purchase, the digital ticket will appear here.</p>
        <button className="primary-button" onClick={onBack}>Back</button>
      </section>
    );
  }

  return (
    <section className="digital-ticket-page">
      <button className="ghost-button" onClick={onBack}>
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="ticket-hero">
        <div>
          <span className="event-category">Digital ticket</span>
          <h1>{purchase.event.title}</h1>
          <p>{purchase.event.venue} - {formatDate(purchase.event.date)}</p>
        </div>
        <button className="primary-button" onClick={() => window.print()}>
          <Download size={18} />
          Download
        </button>
      </div>

      <div className="ticket-layout">
        <article className="ticket-summary-card">
          <div className="ticket-summary-row">
            <CalendarDays size={20} />
            <div>
              <span>Date</span>
              <strong>{formatDate(purchase.event.date)}</strong>
            </div>
          </div>
          <div className="ticket-summary-row">
            <Ticket size={20} />
            <div>
              <span>Zone</span>
              <strong>{purchase.zone.name}</strong>
            </div>
          </div>
          <div className="ticket-summary-row">
            <UserRound size={20} />
            <div>
              <span>Holder</span>
              <strong>{purchase.user.fullName || purchase.user.email}</strong>
            </div>
          </div>
          <div className="ticket-total-line">
            <span>Total paid</span>
            <strong>{formatCurrency(purchase.total)}</strong>
          </div>
        </article>

        <div className="ticket-qr-list">
          {tickets.map((ticket, index) => (
            <article className="ticket-qr-card" key={ticket.id ?? `${ticket.qrCode}-${index}`}>
              <div className="ticket-qr-head">
                <QrCode size={20} />
                <div>
                  <span>Ticket {index + 1}</span>
                  <strong>Seat {ticket.seatNumber}</strong>
                </div>
              </div>
              <img src={qrImageUrl(ticket.qrCode)} alt={`Ticket QR ${ticket.seatNumber}`} />
              <div className="ticket-code">
                <span>Code</span>
                <strong>{ticket.qrCode}</strong>
              </div>
              <em>{ticket.status ?? 'valid'}</em>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
