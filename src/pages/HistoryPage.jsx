import { QrCode, ReceiptText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getUserPurchases } from '../services/eventsApi.js';
import { formatCurrency, formatDate } from '../utils/formatters.js';

export default function HistoryPage({ user, onOpenPurchase }) {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setStatusMessage('');

    getUserPurchases(user)
      .then((items) => {
        if (!ignore) setPurchases(items);
      })
      .catch(() => {
        if (!ignore) {
          setPurchases([]);
          setStatusMessage('No pudimos cargar tus compras en este momento. Intenta nuevamente en unos minutos.');
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [user]);

  return (
    <section className="list-page">
      <div className="section-heading compact">
        <div>
          <span>Compras</span>
          <h1>Historial de compras</h1>
        </div>
      </div>

      {isLoading ? (
        <div className="empty-state compact">
          <h2>Cargando tus compras.</h2>
          <p>Estamos consultando tus entradas recientes.</p>
        </div>
      ) : statusMessage ? (
        <div className="empty-state compact">
          <h2>No se pudo cargar el historial.</h2>
          <p>{statusMessage}</p>
        </div>
      ) : purchases.length === 0 ? (
        <div className="empty-state compact">
          <h2>Aun no tienes compras registradas.</h2>
          <p>Cuando completes una compra, tus boletas digitales apareceran aqui.</p>
        </div>
      ) : (
        <div className="purchase-list">
          {purchases.map((purchase) => (
            <article key={purchase.id} className="purchase-item">
              <ReceiptText size={22} />
              <div>
                <strong>{purchase.event.title}</strong>
                <span>{purchase.tickets.length} entrada(s) - {formatDate(purchase.purchasedAt)}</span>
              </div>
              <b>{formatCurrency(purchase.total)}</b>
              <em>{purchase.status}</em>
              <button className="ticket-link-button" onClick={() => onOpenPurchase(purchase)}>
                <QrCode size={17} />
                Ver QR
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
