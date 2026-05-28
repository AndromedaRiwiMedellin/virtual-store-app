import { Armchair, ArrowLeft, CheckCircle2, LoaderCircle, ShieldCheck, Ticket } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getEventSeats, purchaseTickets } from '../services/eventsApi.js';
import { formatCurrency } from '../utils/formatters.js';

function buildFallbackSeats(zone) {
  if (!zone) return [];
  const count = Math.min(zone.available || zone.capacity || 12, 24);
  const prefix = zone.name?.toLowerCase().includes('vip') ? 'V' : 'G';

  return Array.from({ length: count }, (_, index) => ({
    id: `${zone.id}-${index + 1}`,
    eventAreaId: zone.id,
    seatNumber: `${prefix}${index + 1}`,
    rowLabel: prefix === 'V' ? 'VIP' : 'General',
    status: 'available'
  }));
}

function getSeatRow(seat, zoneName) {
  if (seat.rowLabel) return seat.rowLabel;
  const match = String(seat.seatNumber).match(/^[A-Za-z]+/);
  if (match) return match[0].toUpperCase();
  return zoneName ?? 'Fila';
}

export default function CheckoutPage({ event, user, onBack }) {
  const [selectedZoneId, setSelectedZoneId] = useState(event?.zones?.[0]?.id ?? '');
  const [seats, setSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);
  const [orderStatus, setOrderStatus] = useState({ type: '', message: '' });
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const selectedZone = event?.zones?.find((zone) => String(zone.id) === String(selectedZoneId));
  const selectedSeats = seats.filter((seat) => selectedSeatIds.includes(seat.id));
  const total = useMemo(
    () => (selectedZone ? selectedZone.price * selectedSeatIds.length : 0),
    [selectedZone, selectedSeatIds.length]
  );

  useEffect(() => {
    setSelectedZoneId(event?.zones?.[0]?.id ?? '');
  }, [event?.id, event?.zones]);

  useEffect(() => {
    if (!event || !selectedZone) return;

    let ignore = false;
    setIsLoadingSeats(true);
    setSelectedSeatIds([]);

    getEventSeats(event.id, selectedZone.id)
      .then((apiSeats) => {
        if (!ignore) setSeats(apiSeats);
      })
      .catch(() => {
        if (!ignore) setSeats(buildFallbackSeats(selectedZone));
      })
      .finally(() => {
        if (!ignore) setIsLoadingSeats(false);
      });

    return () => {
      ignore = true;
    };
  }, [event, selectedZone]);

  const groupedSeats = useMemo(() => {
    return seats.reduce((groups, seat) => {
      const row = getSeatRow(seat, selectedZone?.name);
      if (!groups[row]) groups[row] = [];
      groups[row].push(seat);
      return groups;
    }, {});
  }, [seats, selectedZone?.name]);

  const toggleSeat = (seat) => {
    if (!seat.status?.toLowerCase().includes('available')) return;

    setSelectedSeatIds((current) => {
      if (current.includes(seat.id)) {
        return current.filter((id) => id !== seat.id);
      }

      if (current.length >= 6) {
        return current;
      }

      return [...current, seat.id];
    });
  };

  const createOrder = async () => {
    if (!selectedZone || selectedSeats.length === 0 || isCreatingOrder) return;

    setIsCreatingOrder(true);
    setOrderStatus({ type: '', message: '' });

    try {
      const ticketResponse = await purchaseTickets({ user, event, zone: selectedZone, seats: selectedSeats });
      setOrderStatus({
        type: 'success',
        message: ticketResponse?.message ?? 'Tus entradas quedaron registradas correctamente.'
      });
      setSeats((current) => current.map((seat) => (
        selectedSeatIds.includes(seat.id) ? { ...seat, status: 'sold' } : seat
      )));
      setSelectedSeatIds([]);
    } catch (error) {
      setOrderStatus({
        type: 'error',
        message: error.message || 'No fue posible crear la orden. Intentalo nuevamente.'
      });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (!event) {
    return (
      <section className="empty-state">
        <h2>No hay evento seleccionado.</h2>
        <button onClick={onBack}>Volver</button>
      </section>
    );
  }

  return (
    <section className="checkout-layout">
      <button className="ghost-button" onClick={onBack}>
        <ArrowLeft size={18} />
        Volver al detalle
      </button>

      <div className="checkout-grid">
        <article className="checkout-main">
          <span className="event-category">{event.category}</span>
          <h1>Selecciona tus entradas</h1>
          <p>{event.title} · {event.venue}</p>

          <div className="seat-zone-tabs" aria-label="Zonas disponibles">
            {(event.zones ?? []).map((zone) => (
              <button
                key={zone.id}
                className={String(selectedZoneId) === String(zone.id) ? 'seat-zone-tab active' : 'seat-zone-tab'}
                onClick={() => setSelectedZoneId(zone.id)}
              >
                <strong>{zone.name}</strong>
                <span>{formatCurrency(zone.price)} · {zone.available} libres</span>
              </button>
            ))}
          </div>

          <div className="seat-picker-shell">
            <div className="seat-field-header">
              <div>
                <span>Campo de sillas</span>
                <strong>{selectedZone?.name ?? 'Zona'}</strong>
              </div>
              <small>{seats.length} sillas en esta zona</small>
            </div>

            <div className="stage-wrap">
              <span className="stage-label">ESCENARIO</span>
              <div className="stage-glow" />
            </div>

            <div className="seat-legend" aria-label="Convenciones de asientos">
              <span><i className="legend-dot available" /> Disponible</span>
              <span><i className="legend-dot selected" /> Seleccionado</span>
              <span><i className="legend-dot unavailable" /> No disponible</span>
            </div>

            {isLoadingSeats ? (
              <div className="seat-loading">
                <LoaderCircle size={22} />
                Cargando asientos
              </div>
            ) : (
              <div className="seating-bowl" aria-label="Selector de asientos">
                {Object.entries(groupedSeats).map(([row, rowSeats]) => (
                  <div className="seat-row-line" key={row}>
                    <span className="row-label">{row}</span>
                    <div className="seat-grid" style={{ '--seat-count': Math.max(rowSeats.length, 8) }}>
                      {rowSeats.map((seat) => {
                        const isSelected = selectedSeatIds.includes(seat.id);
                        const isAvailable = seat.status?.toLowerCase().includes('available');
                        return (
                          <button
                            key={seat.id}
                            type="button"
                            className={[
                              'seat-button',
                              isAvailable ? 'available' : 'unavailable',
                              isSelected ? 'selected' : ''
                            ].join(' ')}
                            onClick={() => toggleSeat(seat)}
                            disabled={!isAvailable}
                            aria-label={`Asiento ${seat.seatNumber} ${isAvailable ? 'disponible' : 'no disponible'}`}
                          >
                            <Armchair size={17} />
                            <span>{seat.seatNumber}</span>
                          </button>
                        );
                      })}
                    </div>
                    <span className="row-label mirror">{row}</span>
                  </div>
                ))}
                {seats.length === 0 && (
                  <div className="seat-empty">No hay asientos configurados para esta zona.</div>
                )}
              </div>
            )}

            <div className="seat-limit-note">
              <Ticket size={16} />
              Puedes seleccionar hasta 6 asientos por compra.
            </div>
          </div>

          <div className="selected-seat-strip">
            {selectedSeats.length === 0 ? (
              <span>Selecciona uno o más asientos del mapa.</span>
            ) : (
              selectedSeats.map((seat) => (
                <strong key={seat.id}>{seat.seatNumber}</strong>
              ))
            )}
          </div>
        </article>

        <aside className="order-summary">
          <h2>Resumen</h2>
          <div className="summary-line">
            <span>Evento</span>
            <strong>{event.title}</strong>
          </div>
          <div className="summary-line">
            <span>Zona</span>
            <strong>{selectedZone?.name}</strong>
          </div>
          <div className="summary-line">
            <span>Asientos</span>
            <strong>{selectedSeats.length || 'Sin seleccionar'}</strong>
          </div>
          <div className="summary-seat-list">
            {selectedSeats.map((seat) => (
              <span key={seat.id}>
                <CheckCircle2 size={15} />
                {seat.seatNumber}
              </span>
            ))}
          </div>
          <div className="summary-total">
            <span>Total estimado</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
          {orderStatus.message && (
            <div className={`form-status ${orderStatus.type}`}>
              {orderStatus.message}
            </div>
          )}
          <button
            className="primary-button"
            disabled={selectedSeats.length === 0 || isCreatingOrder}
            onClick={createOrder}
          >
            {isCreatingOrder ? 'Creando orden...' : 'Crear orden'}
          </button>
          <p className="secure-note"><ShieldCheck size={16} /> Compra asociada a tu cuenta OrbiX.</p>
        </aside>
      </div>
    </section>
  );
}
