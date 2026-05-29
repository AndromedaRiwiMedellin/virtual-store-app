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
          setPurchaseStatus('No pudimos cargar tus compras recientes. Intenta nuevamente en unos minutos.');
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
          <span>Cuenta</span>
          <h1>Editar perfil personal</h1>
        </div>
      </div>

      <form className="profile-form">
        <label>
          Nombre completo
          <input defaultValue={user?.fullName ?? 'Cliente OrbiX'} />
        </label>
        <label>
          Correo
          <input defaultValue={user?.email ?? ''} />
        </label>
        <label>
          Telefono
          <input defaultValue={user?.phone ?? ''} />
        </label>
        <label>
          Ciudad
          <input defaultValue="Medellin" />
        </label>
        <button className="primary-button" type="button">
          <Save size={18} />
          Guardar cambios
        </button>
      </form>

      <aside className="profile-card">
        <UserRound size={28} />
        <strong>Tu informacion</strong>
        <span>Manten tus datos actualizados para recibir tus entradas y novedades sin contratiempos.</span>
      </aside>

      <section className="profile-purchases">
        <div className="section-heading compact">
          <div>
            <span>Compras</span>
            <h2>Historial reciente</h2>
          </div>
        </div>

        {isLoadingPurchases ? (
          <div className="empty-state compact">
            <h2>Cargando compras recientes.</h2>
            <p>Estamos actualizando la informacion de tus entradas.</p>
          </div>
        ) : purchaseStatus ? (
          <div className="empty-state compact">
            <h2>No se pudo cargar esta seccion.</h2>
            <p>{purchaseStatus}</p>
          </div>
        ) : recentPurchases.length === 0 ? (
          <div className="empty-state compact">
            <h2>Aun no tienes compras registradas.</h2>
            <p>Cuando completes una compra, tus entradas apareceran tambien en tu perfil.</p>
          </div>
        ) : (
          <div className="purchase-list profile-purchase-list">
            {recentPurchases.map((purchase) => (
              <article key={purchase.id} className="purchase-item">
                <ReceiptText size={22} />
                <div>
                  <strong>{purchase.event.title}</strong>
                  <span>{purchase.tickets.length} entrada(s) - {formatDate(purchase.purchasedAt)}</span>
                </div>
                <b>{formatCurrency(purchase.total)}</b>
                <em>{purchase.status}</em>
                <button className="ticket-link-button" type="button" onClick={() => onOpenPurchase(purchase)}>
                  <QrCode size={17} />
                  Ver QR
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
