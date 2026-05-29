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
          setStatusMessage('We could not load your purchases right now. Please try again in a few minutes.');
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
          <span>Purchases</span>
          <h1>Purchase history</h1>
        </div>
      </div>

      {isLoading ? (
        <div className="empty-state compact">
          <h2>Loading your purchases.</h2>
          <p>We are checking your recent tickets.</p>
        </div>
      ) : statusMessage ? (
        <div className="empty-state compact">
          <h2>The history could not be loaded.</h2>
          <p>{statusMessage}</p>
        </div>
      ) : purchases.length === 0 ? (
        <div className="empty-state compact">
          <h2>You do not have registered purchases yet.</h2>
          <p>Once you complete a purchase, your digital tickets will appear here.</p>
        </div>
      ) : (
        <div className="purchase-list">
          {purchases.map((purchase) => (
            <article key={purchase.id} className="purchase-item">
              <ReceiptText size={22} />
              <div>
                <strong>{purchase.event.title}</strong>
                <span>{purchase.tickets.length} ticket(s) - {formatDate(purchase.purchasedAt)}</span>
              </div>
              <b>{formatCurrency(purchase.total)}</b>
              <em>{purchase.status}</em>
              <button className="ticket-link-button" onClick={() => onOpenPurchase(purchase)}>
                <QrCode size={17} />
                View QR
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
