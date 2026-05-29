import { QrCode, ReceiptText, Save, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getUserPurchases } from '../services/eventsApi.js';
import { formatCurrency, formatDate } from '../utils/formatters.js';

export default function ProfilePage({ user, onOpenPurchase }) {
  const [purchases, setPurchases] = useState([]);
  const [isLoadingPurchases, setIsLoadingPurchases] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState('');
  const recentPurchases = purchases.slice(0, 3);

  useEffect(() => {
    let ignore = false;
    setIsLoadingPurchases(true);
    setPurchaseStatus('');

    getUserPurchases(user)
      .then((items) => {
        if (!ignore) setPurchases(items);
      })
      .catch(() => {
        if (!ignore) {
          setPurchases([]);
          setPurchaseStatus('We could not load your recent purchases. Please try again in a few minutes.');
        }
      })
      .finally(() => {
        if (!ignore) setIsLoadingPurchases(false);
      });

    return () => {
      ignore = true;
    };
  }, [user]);

  return (
    <section className="form-page">
      <div className="section-heading compact">
        <div>
          <span>Account</span>
          <h1>Edit personal profile</h1>
        </div>
      </div>

      <form className="profile-form">
        <label>
          Full name
          <input defaultValue={user?.fullName ?? 'Cliente OrbiX'} />
        </label>
        <label>
          Email
          <input defaultValue={user?.email ?? ''} />
        </label>
        <label>
          Phone
          <input defaultValue={user?.phone ?? ''} />
        </label>
        <label>
          City
          <input defaultValue="Medellin" />
        </label>
        <button className="primary-button" type="button">
          <Save size={18} />
          Save changes
        </button>
      </form>

      <aside className="profile-card">
        <UserRound size={28} />
        <strong>Your information</strong>
        <span>Keep your details updated to receive tickets and updates without issues.</span>
      </aside>

      <section className="profile-purchases">
        <div className="section-heading compact">
          <div>
            <span>Purchases</span>
            <h2>Recent history</h2>
          </div>
        </div>

        {isLoadingPurchases ? (
          <div className="empty-state compact">
            <h2>Loading recent purchases.</h2>
            <p>We are updating your ticket information.</p>
          </div>
        ) : purchaseStatus ? (
          <div className="empty-state compact">
            <h2>This section could not be loaded.</h2>
            <p>{purchaseStatus}</p>
          </div>
        ) : recentPurchases.length === 0 ? (
          <div className="empty-state compact">
            <h2>You do not have registered purchases yet.</h2>
            <p>Once you complete a purchase, your tickets will also appear in your profile.</p>
          </div>
        ) : (
          <div className="purchase-list profile-purchase-list">
            {recentPurchases.map((purchase) => (
              <article key={purchase.id} className="purchase-item">
                <ReceiptText size={22} />
                <div>
                  <strong>{purchase.event.title}</strong>
                  <span>{purchase.tickets.length} ticket(s) - {formatDate(purchase.purchasedAt)}</span>
                </div>
                <b>{formatCurrency(purchase.total)}</b>
                <em>{purchase.status}</em>
                <button className="ticket-link-button" type="button" onClick={() => onOpenPurchase(purchase)}>
                  <QrCode size={17} />
                  View QR
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
