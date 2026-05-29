import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import { events as fallbackEvents } from './data/events.js';
import CheckoutPage from './pages/CheckoutPage.jsx';
import DigitalTicketPage from './pages/DigitalTicketPage.jsx';
import EventDetailPage from './pages/EventDetailPage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PqrsPage from './pages/PqrsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { getEvent, getEvents } from './services/eventsApi.js';
import { addStoredPurchase } from './services/ticketStorage.js';

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('orbix_user'));
  } catch {
    return null;
  }
}

const initialFilters = {
  query: '',
  city: 'All',
  category: 'All',
  date: ''
};

export default function App() {
  const [view, setView] = useState('home');
  const [user, setUser] = useState(getStoredUser);
  const [authReason, setAuthReason] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [events, setEvents] = useState(fallbackEvents);
  const [selectedEventId, setSelectedEventId] = useState(fallbackEvents[0].id);
  const [selectedEvent, setSelectedEvent] = useState(fallbackEvents[0]);
  const [activePurchase, setActivePurchase] = useState(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  const isAuthenticated = Boolean(user?.id || user?.email);

  useEffect(() => {
    let ignore = false;

    setIsLoadingEvents(true);
    getEvents(filters)
      .then((apiEvents) => {
        if (ignore) return;
        setEvents(apiEvents);
        if (!apiEvents.some((event) => event.id === selectedEventId) && apiEvents.length > 0) {
          setSelectedEventId(apiEvents[0].id);
          setSelectedEvent(apiEvents[0]);
        }
      })
      .catch(() => {
        if (ignore) return;
        setEvents(fallbackEvents);
      })
      .finally(() => {
        if (!ignore) setIsLoadingEvents(false);
      });

    return () => {
      ignore = true;
    };
  }, [filters, selectedEventId]);

  const currentSelectedEvent = useMemo(
    () => selectedEvent ?? events.find((event) => event.id === selectedEventId),
    [events, selectedEvent, selectedEventId]
  );

  const handleAuthSuccess = (nextUser) => {
    setUser(nextUser);
    localStorage.setItem('orbix_user', JSON.stringify(nextUser));
    setAuthReason('');
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('orbix_user');
    setAuthReason('');
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigate = (nextView) => {
    const privateViews = ['profile', 'history', 'favorites', 'checkout', 'ticket', 'pqrs'];
    if (!isAuthenticated && privateViews.includes(nextView)) {
      setAuthReason('Sign in to your account to access this section securely.');
      setView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setView(nextView);
  };

  const handlePurchaseComplete = (purchase) => {
    const storedPurchase = addStoredPurchase(purchase);
    setActivePurchase(storedPurchase);
    setView('ticket');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEvent = async (eventId) => {
    setSelectedEventId(eventId);
    const localEvent = events.find((event) => event.id === eventId);
    setSelectedEvent(localEvent);
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const eventDetail = await getEvent(eventId);
      setSelectedEvent(eventDetail);
    } catch {
      setSelectedEvent(localEvent);
    }
  };

  const goToCheckout = async (eventId) => {
    setSelectedEventId(eventId);
    const localEvent = events.find((event) => event.id === eventId);
    setSelectedEvent((current) => current?.id === eventId ? current : localEvent);
    if (!isAuthenticated) {
      setAuthReason('Sign in to select seats and continue your purchase.');
      setView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const eventDetail = await getEvent(eventId);
      setSelectedEvent(eventDetail);
    } catch {
      setSelectedEvent((current) => current ?? localEvent);
    }
  };

  return (
    <div className="app-shell">
      <Header activeView={view} isAuthenticated={isAuthenticated} onLogout={handleLogout} onNavigate={navigate} />
      <main className="page-shell">
        {view === 'home' && (
          <HomePage
            events={events}
            filters={filters}
            isLoading={isLoadingEvents}
            onFiltersChange={setFilters}
            onOpenEvent={openEvent}
          />
        )}
        {view === 'detail' && (
          <EventDetailPage event={currentSelectedEvent} onBack={() => navigate('home')} onCheckout={goToCheckout} />
        )}
        {view === 'checkout' && (
          <CheckoutPage
            event={currentSelectedEvent}
            user={user}
            onBack={() => navigate('detail')}
            onPurchaseComplete={handlePurchaseComplete}
          />
        )}
        {view === 'profile' && (
          <ProfilePage
            user={user}
            onOpenPurchase={(purchase) => {
              setActivePurchase(purchase);
              setView('ticket');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
        {view === 'history' && (
          <HistoryPage
            user={user}
            onOpenPurchase={(purchase) => {
              setActivePurchase(purchase);
              setView('ticket');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
        {view === 'favorites' && <FavoritesPage events={events} onOpenEvent={openEvent} />}
        {view === 'pqrs' && <PqrsPage user={user} />}
        {view === 'login' && <LoginPage reason={authReason} onAuthenticated={handleAuthSuccess} />}
        {view === 'ticket' && <DigitalTicketPage purchase={activePurchase} onBack={() => navigate('history')} />}
      </main>
    </div>
  );
}
