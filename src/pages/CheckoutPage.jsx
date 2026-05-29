import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  Ticket
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getEventSeats, purchaseTickets } from '../services/eventsApi.js';
import { formatCurrency } from '../utils/formatters.js';

const HOLD_SECONDS = 30;

function normalizeText(value = '') {
  return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function getVipZone(zones = []) {
  if (!zones.length) return null;
  return zones.find((zone) => normalizeText(zone.name).includes('vip'))
    ?? [...zones].sort((a, b) => (b.price ?? 0) - (a.price ?? 0))[0];
}

function getGeneralZone(zones = [], vipZone) {
  return zones.find((zone) => normalizeText(zone.name).includes('general') && String(zone.id) !== String(vipZone?.id))
    ?? zones.find((zone) => String(zone.id) !== String(vipZone?.id))
    ?? vipZone
    ?? null;
}

function buildFallbackSeats(zones = []) {
  const vipZone = getVipZone(zones) ?? { id: 'vip', name: 'VIP' };
  const generalZone = getGeneralZone(zones, vipZone) ?? { id: 'general', name: 'General' };

  const vipSeats = Array.from({ length: 200 }, (_, index) => ({
    id: `${vipZone.id}-V${index + 1}`,
    eventAreaId: vipZone.id,
    seatNumber: `V${index + 1}`,
    rowLabel: `VIP ${Math.floor(index / 20) + 1}`,
    status: index % 47 === 0 ? 'sold' : 'available'
  }));

  const generalSeats = Array.from({ length: 200 }, (_, index) => ({
    id: `${generalZone.id}-G${index + 1}`,
    eventAreaId: generalZone.id,
    seatNumber: `G${index + 1}`,
    rowLabel: `General ${Math.floor(index / 20) + 1}`,
    status: index % 53 === 0 ? 'sold' : 'available'
  }));

  return [...vipSeats, ...generalSeats];
}

function isVipZone(zone) {
  return normalizeText(zone?.name).includes('vip');
}

function getSeatZone(seat, zones = []) {
  return zones.find((zone) => String(zone.id) === String(seat.eventAreaId))
    ?? zones.find((zone) => String(zone.id) === String(seat.areaId))
    ?? zones.find((zone) => String(zone.id) === String(seat.zoneId))
    ?? null;
}

function getSeatNumberValue(seat) {
  const value = Number(String(seat.seatNumber ?? '').replace(/[^0-9]/g, ''));
  return Number.isFinite(value) ? value : 0;
}

function sortSeats(a, b) {
  const rowA = a.rowLabel ?? '';
  const rowB = b.rowLabel ?? '';
  if (rowA !== rowB) return rowA.localeCompare(rowB, 'es', { numeric: true });
  return getSeatNumberValue(a) - getSeatNumberValue(b);
}

function buildVenueSeats(seats, zones = []) {
  const sortedSeats = [...seats].sort(sortSeats);
  const vipZone = getVipZone(zones);
  const generalZone = getGeneralZone(zones, vipZone);
  const vipSeats = sortedSeats.filter((seat) => {
    const zone = getSeatZone(seat, zones);
    return String(zone?.id) === String(vipZone?.id) || isVipZone(zone);
  });
  const generalSeats = sortedSeats.filter((seat) => {
    const zone = getSeatZone(seat, zones);
    return String(zone?.id) !== String(vipZone?.id) && !isVipZone(zone ?? generalZone);
  });

  const vip = vipSeats.slice(0, 200).map((seat, index) => {
    const row = Math.floor(index / 20);
    const col = index % 20;
    const side = col < 10 ? 'left' : 'right';
    const sideCol = side === 'left' ? col : col - 10;
    const curve = Math.abs(4.5 - sideCol) * (row < 3 ? 3.6 : 1.6);
    const x = side === 'left' ? 318 + sideCol * 28 - row * 2 : 696 + sideCol * 28 + row * 2;
    const y = 220 + row * 34 + curve;
    return { seat, x, y, zoneKind: 'vip', section: 'Central VIP' };
  });

  const left = generalSeats.slice(0, 60).map((seat, index) => {
    const row = Math.floor(index / 6);
    const col = index % 6;
    return { seat, x: 92 + col * 33 - row * 3, y: 302 + row * 35, zoneKind: 'general', section: 'Left General' };
  });

  const right = generalSeats.slice(60, 120).map((seat, index) => {
    const row = Math.floor(index / 6);
    const col = index % 6;
    return { seat, x: 972 + col * 33 + row * 3, y: 302 + row * 35, zoneKind: 'general', section: 'Right General' };
  });

  const rear = generalSeats.slice(120, 200).map((seat, index) => {
    const row = Math.floor(index / 20);
    const col = index % 20;
    const arc = Math.abs(9.5 - col) * 1.3;
    return { seat, x: 305 + col * 32, y: 618 + row * 34 + arc, zoneKind: 'general', section: 'Rear General' };
  });

  return [...vip, ...left, ...right, ...rear];
}

function normalizeCardNumber(value) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
}

function normalizeExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function CheckoutPage({ event, user, onBack, onPurchaseComplete }) {
  const [selectedZoneId, setSelectedZoneId] = useState(event?.zones?.[0]?.id ?? '');
  const [seats, setSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);
  const [orderStatus, setOrderStatus] = useState({ type: '', message: '' });
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('seats');
  const [holdExpiresAt, setHoldExpiresAt] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [cardForm, setCardForm] = useState({
    holder: '',
    number: '',
    expiry: '',
    cvv: ''
  });

  const selectedZone = event?.zones?.find((zone) => String(zone.id) === String(selectedZoneId));
  const activeZoneKind = isVipZone(selectedZone) ? 'vip' : 'general';
  const selectedSeats = seats.filter((seat) => selectedSeatIds.includes(String(seat.id)));
  const total = useMemo(
    () => (selectedZone ? selectedZone.price * selectedSeatIds.length : 0),
    [selectedZone, selectedSeatIds.length]
  );
  const holdSeconds = holdExpiresAt ? Math.max(0, Math.ceil((holdExpiresAt - now) / 1000)) : 0;
  const paymentReady = cardForm.holder.trim().length >= 3
    && cardForm.number.replace(/\D/g, '').length >= 12
    && cardForm.expiry.length === 5
    && cardForm.cvv.replace(/\D/g, '').length >= 3;

  useEffect(() => {
    setSelectedZoneId(event?.zones?.[0]?.id ?? '');
    setCheckoutStep('seats');
    setHoldExpiresAt(null);
  }, [event?.id, event?.zones]);

  useEffect(() => {
    if (!event || !selectedZone) return;

    let ignore = false;
    setIsLoadingSeats(true);
    setSelectedSeatIds([]);
    setCheckoutStep('seats');
    setHoldExpiresAt(null);

    getEventSeats(event.id)
      .then((apiSeats) => {
        if (!ignore) setSeats(apiSeats.length ? apiSeats : buildFallbackSeats(event.zones ?? []));
      })
      .catch(() => {
        if (!ignore) setSeats(buildFallbackSeats(event.zones ?? []));
      })
      .finally(() => {
        if (!ignore) setIsLoadingSeats(false);
      });

    return () => {
      ignore = true;
    };
  }, [event]);

  useEffect(() => {
    if (!holdExpiresAt) return undefined;
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 500);
    return () => window.clearInterval(interval);
  }, [holdExpiresAt]);

  useEffect(() => {
    if (!holdExpiresAt || selectedSeatIds.length === 0 || isCreatingOrder) return;
    if (Date.now() < holdExpiresAt) return;

    setSelectedSeatIds([]);
    setHoldExpiresAt(null);
    setCheckoutStep('seats');
    setOrderStatus({
      type: 'error',
      message: 'The 30-second hold expired. Select your seats again.'
    });
  }, [holdExpiresAt, now, selectedSeatIds.length, isCreatingOrder]);

  const venueSeats = useMemo(() => buildVenueSeats(seats, event?.zones ?? []), [seats, event?.zones]);
  const visibleVenueSeats = useMemo(() => (
    venueSeats.filter(({ seat }) => String(getSeatZone(seat, event?.zones ?? [])?.id ?? seat.eventAreaId) === String(selectedZoneId))
  ), [event?.zones, selectedZoneId, venueSeats]);

  const toggleSeat = (seat) => {
    const status = seat.status?.toLowerCase();
    if (status !== 'available') return;

    setOrderStatus({ type: '', message: '' });
    setSelectedSeatIds((current) => {
      const seatId = String(seat.id);
      const seatZoneId = String(seat.eventAreaId);
      const isChangingZone = selectedZoneId && String(selectedZoneId) !== seatZoneId;
      if (isChangingZone) setSelectedZoneId(seat.eventAreaId);

      const next = current.includes(seatId)
        ? current.filter((id) => id !== seatId)
        : isChangingZone
          ? [seatId]
          : current.length >= 6
          ? current
          : [...current, seatId];

      setHoldExpiresAt(next.length ? Date.now() + HOLD_SECONDS * 1000 : null);
      if (checkoutStep === 'payment' && next.length === 0) setCheckoutStep('seats');
      return next;
    });
  };

  const continueToPayment = () => {
    if (selectedSeats.length === 0) return;
    setHoldExpiresAt(Date.now() + HOLD_SECONDS * 1000);
    setCheckoutStep('payment');
    setOrderStatus({ type: '', message: '' });
  };

  const handleCardChange = (field, value) => {
    setCardForm((current) => ({
      ...current,
      [field]: field === 'number'
        ? normalizeCardNumber(value)
        : field === 'expiry'
          ? normalizeExpiry(value)
          : field === 'cvv'
            ? value.replace(/\D/g, '').slice(0, 4)
            : value
    }));
  };

  const createOrder = async () => {
    if (!selectedZone || selectedSeats.length === 0 || isCreatingOrder || !paymentReady) return;
    if (holdExpiresAt && Date.now() >= holdExpiresAt) {
      setOrderStatus({ type: 'error', message: 'The hold expired. Select your seats again.' });
      return;
    }

    setIsCreatingOrder(true);
    setOrderStatus({ type: '', message: '' });

    try {
      const ticketResponse = await purchaseTickets({ user, event, zone: selectedZone, seats: selectedSeats });
      const tickets = (ticketResponse?.tickets ?? []).map((ticket, index) => ({
        id: ticket.id,
        qrCode: ticket.qrCode,
        seatNumber: ticket.seatNumber ?? selectedSeats[index]?.seatNumber,
        status: ticket.status ?? 'valid',
        purchasedAt: ticket.purchasedAt ?? new Date().toISOString()
      }));

      setSeats((current) => current.map((seat) => (
        selectedSeatIds.includes(String(seat.id)) ? { ...seat, status: 'sold' } : seat
      )));

      onPurchaseComplete({
        id: globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${event.id}-${Date.now()}`,
        event: {
          id: event.id,
          title: event.title,
          date: event.date,
          time: event.time,
          venue: event.venue,
          category: event.category,
          image: event.image
        },
        zone: {
          id: selectedZone.id,
          name: selectedZone.name,
          price: selectedZone.price
        },
        seats: selectedSeats.map((seat) => ({ id: seat.id, seatNumber: seat.seatNumber })),
        tickets,
        total,
        status: 'Paid',
        purchasedAt: new Date().toISOString(),
        user: {
          id: user?.id,
          fullName: user?.fullName,
          email: user?.email
        }
      });
    } catch (error) {
      setOrderStatus({
        type: 'error',
        message: error.message || 'We could not complete the purchase. Please try again.'
      });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (!event) {
    return (
      <section className="empty-state">
        <h2>No event selected.</h2>
        <button onClick={onBack}>Back</button>
      </section>
    );
  }

  return (
    <section className="checkout-layout">
      <button className="ghost-button" onClick={onBack}>
        <ArrowLeft size={18} />
        Back to details
      </button>

      <div className="checkout-grid">
        <article className="checkout-main">
          <span className="event-category">{event.category}</span>
          <h1>{checkoutStep === 'payment' ? 'Pay by card' : 'Select your tickets'}</h1>
          <p>{event.title} - {event.venue}</p>

          <div className="seat-zone-tabs" aria-label="Available zones">
            {(event.zones ?? []).map((zone) => (
              <button
                key={zone.id}
                className={String(selectedZoneId) === String(zone.id) ? 'seat-zone-tab active' : 'seat-zone-tab'}
                onClick={() => {
                  setSelectedZoneId(zone.id);
                  setSelectedSeatIds([]);
                  setHoldExpiresAt(null);
                  setCheckoutStep('seats');
                }}
              >
                <strong>{zone.name}</strong>
                <span>{formatCurrency(zone.price)} - {zone.available} available</span>
              </button>
            ))}
          </div>

          <div className="seat-picker-shell">
            <div className="seat-field-header">
              <div>
                <span>Seat map</span>
                <strong>{selectedZone?.name ?? 'Zone'}</strong>
              </div>
              <small>{seats.length} seats in the venue</small>
            </div>

            <div className="stage-wrap">
              <span className="stage-label">STAGE</span>
              <div className="stage-glow" />
            </div>

            <div className="venue-zone-overview" aria-label="General venue layout">
              <button
                type="button"
                className={`venue-zone-pill vip ${isVipZone(selectedZone) ? 'active' : ''}`}
                onClick={() => {
                  const vipZone = getVipZone(event.zones ?? []);
                  if (vipZone) {
                    setSelectedZoneId(vipZone.id);
                    setSelectedSeatIds([]);
                    setHoldExpiresAt(null);
                    setCheckoutStep('seats');
                  }
                }}
              >
                <strong>VIP</strong>
                <span>In front of the stage</span>
              </button>
              <div className="venue-aisle-line"><span>Runway</span></div>
              <button
                type="button"
                className={`venue-zone-pill general ${!isVipZone(selectedZone) ? 'active' : ''}`}
                onClick={() => {
                  const generalZone = getGeneralZone(event.zones ?? [], getVipZone(event.zones ?? []));
                  if (generalZone) {
                    setSelectedZoneId(generalZone.id);
                    setSelectedSeatIds([]);
                    setHoldExpiresAt(null);
                    setCheckoutStep('seats');
                  }
                }}
              >
                <strong>General</strong>
                <span>Sides and rear area</span>
              </button>
            </div>

            <div className="seat-legend" aria-label="Seat legend">
              <span><i className="legend-dot available" /> Available</span>
              <span><i className="legend-dot selected" /> Held</span>
              <span><i className="legend-dot unavailable" /> Unavailable</span>
            </div>

            {isLoadingSeats ? (
              <div className="seat-loading">
                <LoaderCircle size={22} />
                Loading seats
              </div>
            ) : (
              <div className="venue-seat-map" aria-label="Seat selector">
                <div className={`venue-plan-canvas ${activeZoneKind}-view`}>
                  <div className="map-green-room">Green room</div>
                  <div className="map-stage">Main stage</div>
                  <div className="map-screen left">Screen</div>
                  <div className="map-screen right">Screen</div>
                  <div className="map-ramp">Runway</div>
                  <div className="map-barrier left" />
                  <div className="map-barrier right" />
                  <div className="map-section-label vip">Central VIP</div>
                  <div className="map-section-label general-left">Left General</div>
                  <div className="map-section-label general-right">Right General</div>
                  <div className="map-section-label general-rear">Rear General</div>
                  <div className="map-service-label north">North entry</div>
                  <div className="map-service-label south">South entry</div>

                  {visibleVenueSeats.map(({ seat, x, y, zoneKind, section }) => {
                    const seatId = String(seat.id);
                    const isSelected = selectedSeatIds.includes(seatId);
                    const isAvailable = seat.status?.toLowerCase() === 'available';
                    const seatNumber = String(seat.seatNumber).replace(/^[A-Za-z]+/, '');
                    return (
                      <button
                        key={seat.id}
                        type="button"
                        className={[
                          'venue-seat',
                          zoneKind,
                          isAvailable ? 'available' : 'unavailable',
                          isSelected ? 'selected' : ''
                        ].join(' ')}
                        style={{ left: `${x}px`, top: `${y}px` }}
                        onClick={() => toggleSeat(seat)}
                        disabled={!isAvailable || isCreatingOrder}
                        title={`${section} - ${seat.seatNumber}`}
                        aria-label={`${section}, seat ${seat.seatNumber} ${isAvailable ? 'available' : 'unavailable'}`}
                      >
                        {seatNumber}
                      </button>
                    );
                  })}
                  {visibleVenueSeats.length === 0 && (
                    <div className="seat-empty">No seats are configured for this zone.</div>
                  )}
                </div>
              </div>
            )}

            <div className="seat-limit-note">
              <Ticket size={16} />
              You can select up to 6 seats per purchase.
            </div>
          </div>

          <div className="selected-seat-strip">
            {selectedSeats.length === 0 ? (
              <span>Select one or more seats from the map.</span>
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
            <span>Event</span>
            <strong>{event.title}</strong>
          </div>
          <div className="summary-line">
            <span>Zone</span>
            <strong>{selectedZone?.name}</strong>
          </div>
          <div className="summary-line">
            <span>Seats</span>
            <strong>{selectedSeats.length || 'Not selected'}</strong>
          </div>
          <div className="summary-seat-list">
            {selectedSeats.map((seat) => (
              <span key={seat.id}>
                <CheckCircle2 size={15} />
                {seat.seatNumber}
              </span>
            ))}
          </div>
          {selectedSeats.length > 0 && (
            <div className="hold-timer">
              <LockKeyhole size={16} />
              <span>Active hold</span>
              <strong>{holdSeconds}s</strong>
            </div>
          )}
          <div className="summary-total">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>

          {checkoutStep === 'payment' && (
            <div className="payment-panel">
              <div className="payment-panel-head">
                <CreditCard size={18} />
                <strong>Payment card</strong>
              </div>
              <label>
                Name on card
                <input
                  value={cardForm.holder}
                  onChange={(event) => handleCardChange('holder', event.target.value)}
                  placeholder="Full name"
                />
              </label>
              <label>
                Card number
                <input
                  inputMode="numeric"
                  value={cardForm.number}
                  onChange={(event) => handleCardChange('number', event.target.value)}
                  placeholder="4242 4242 4242 4242"
                />
              </label>
              <div className="payment-inline-fields">
                <label>
                  Expires
                  <input
                    inputMode="numeric"
                    value={cardForm.expiry}
                    onChange={(event) => handleCardChange('expiry', event.target.value)}
                    placeholder="MM/AA"
                  />
                </label>
                <label>
                  CVV
                  <input
                    inputMode="numeric"
                    value={cardForm.cvv}
                    onChange={(event) => handleCardChange('cvv', event.target.value)}
                    placeholder="123"
                  />
                </label>
              </div>
            </div>
          )}

          {orderStatus.message && (
            <div className={`form-status ${orderStatus.type}`}>
              {orderStatus.message}
            </div>
          )}
          {checkoutStep === 'payment' ? (
            <button
              className="primary-button"
              disabled={selectedSeats.length === 0 || isCreatingOrder || !paymentReady}
              onClick={createOrder}
            >
              {isCreatingOrder ? 'Processing...' : 'Pay and generate QR'}
            </button>
          ) : (
            <button
              className="primary-button"
              disabled={selectedSeats.length === 0}
              onClick={continueToPayment}
            >
              Continue to payment
            </button>
          )}
          <p className="secure-note"><ShieldCheck size={16} /> Purchase linked to your OrbiX account.</p>
        </aside>
      </div>
    </section>
  );
}
