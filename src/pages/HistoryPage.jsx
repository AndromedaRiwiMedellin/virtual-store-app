import { ReceiptText } from 'lucide-react';
import { purchases } from '../data/events.js';
import { formatCurrency, formatDate } from '../utils/formatters.js';

export default function HistoryPage() {
  return (
    <section className="list-page">
      <div className="section-heading compact">
        <div>
          <span>Compras</span>
          <h1>Historial de compras</h1>
        </div>
      </div>

      <div className="purchase-list">
        {purchases.map((purchase) => (
          <article key={purchase.id} className="purchase-item">
            <ReceiptText size={22} />
            <div>
              <strong>{purchase.event}</strong>
              <span>{purchase.id} · {formatDate(purchase.date)}</span>
            </div>
            <b>{formatCurrency(purchase.total)}</b>
            <em>{purchase.status}</em>
          </article>
        ))}
      </div>
    </section>
  );
}
