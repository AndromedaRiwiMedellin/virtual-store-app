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
        <h2>No hay boleta seleccionada.</h2>
        <p>Cuando completes una compra, la boleta digital aparecera aqui.</p>
        <button className="primary-button" onClick={onBack}>Volver</button>
      </section>
    );
  }

  return (
    <section className="digital-ticket-page">
      <button className="ghost-button" onClick={onBack}>
        <ArrowLeft size={18} />
        Volver
      </button>

      <div className="ticket-hero">
        <div>
          <span className="event-category">Boleta digital</span>
          <h1>{purchase.event.title}</h1>
          <p>{purchase.event.venue} - {formatDate(purchase.event.date)}</p>
        </div>
        <button className="primary-button" onClick={() => window.print()}>
          <Download size={18} />
          Descargar
        </button>
      </div>

      <div className="ticket-layout">
        <article className="ticket-summary-card">
          <div className="ticket-summary-row">
            <CalendarDays size={20} />
            <div>
              <span>Fecha</span>
              <strong>{formatDate(purchase.event.date)}</strong>
            </div>
          </div>
          <div className="ticket-summary-row">
            <Ticket size={20} />
            <div>
              <span>Zona</span>
              <strong>{purchase.zone.name}</strong>
            </div>
          </div>
          <div className="ticket-summary-row">
            <UserRound size={20} />
            <div>
              <span>Titular</span>
              <strong>{purchase.user.fullName || purchase.user.email}</strong>
            </div>
          </div>
          <div className="ticket-total-line">
            <span>Total pagado</span>
            <strong>{formatCurrency(purchase.total)}</strong>
          </div>
        </article>

        <div className="ticket-qr-list">
          {tickets.map((ticket, index) => (
            <article className="ticket-qr-card" key={ticket.id ?? `${ticket.qrCode}-${index}`}>
              <div className="ticket-qr-head">
                <QrCode size={20} />
                <div>
                  <span>Entrada {index + 1}</span>
                  <strong>Asiento {ticket.seatNumber}</strong>
                </div>
              </div>
              <img src={qrImageUrl(ticket.qrCode)} alt={`QR de boleta ${ticket.seatNumber}`} />
              <div className="ticket-code">
                <span>Codigo</span>
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
