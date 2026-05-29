import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import { events as fallbackEvents } from './data/events.js';

import CheckoutPage from './pages/CheckoutPage.jsx';
import EventDetailPage from './pages/EventDetailPage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PqrsPage from './pages/PqrsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

import { getEvent, getEvents } from './services/eventsApi.js';

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('orbix_user'));
  } catch {
    return null;
  }
}

const initialFilters = {
  query: '',
  city: 'Todas',
  category: 'Todos',
  date: ''
};

function App() {
  const [view, setView] = useState('home');
  const [user, setUser] = useState(getStoredUser);
  const [authReason, setAuthReason] = useState('');
  const [filters, setFilters] = useState(initialFilters);

  const [events, setEvents] = useState(fallbackEvents);

  const [selectedEventId, setSelectedEventId] = useState(
    fallbackEvents[0]?.id
  );

  const [selectedEvent, setSelectedEvent] = useState(
    fallbackEvents[0]
  );

  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  const isAuthenticated = Boolean(user?.id || user?.email);

  useEffect(() => {
    let ignore = false;

    setIsLoadingEvents(true);

    getEvents(filters)
      .then((apiEvents) => {
        if (ignore) return;

        setEvents(apiEvents);

        if (
          !apiEvents.some(
            (event) => event.id === selectedEventId
          ) &&
          apiEvents.length > 0
        ) {
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
    () =>
      selectedEvent ??
      events.find(
        (event) => event.id === selectedEventId
      ),
    [events, selectedEvent, selectedEventId]
  );

  const handleAuthSuccess = (nextUser) => {
    setUser(nextUser);

    localStorage.setItem(
      'orbix_user',
      JSON.stringify(nextUser)
    );

    setAuthReason('');
    setView('home');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLogout = () => {
    setUser(null);

    localStorage.removeItem('orbix_user');

    setAuthReason('');
    setView('home');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const navigate = (nextView) => {
    const privateViews = [
      'profile',
      'history',
      'favorites',
      'checkout'
    ];

    if (
      !isAuthenticated &&
      privateViews.includes(nextView)
    ) {
      setAuthReason(
        'Ingresa a tu cuenta para ver esta seccion de forma segura.'
      );

      setView('login');

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      return;
    }

    setView(nextView);
  };

  const openEvent = async (eventId) => {
    setSelectedEventId(eventId);

    const localEvent = events.find(
      (event) => event.id === eventId
    );

    setSelectedEvent(localEvent);

    setView('detail');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    try {
      const eventDetail = await getEvent(eventId);

      setSelectedEvent(eventDetail);
    } catch {
      setSelectedEvent(localEvent);
    }
  };

  const goToCheckout = async (eventId) => {
    setSelectedEventId(eventId);

    const localEvent = events.find(
      (event) => event.id === eventId
    );

    setSelectedEvent((current) =>
      current?.id === eventId
        ? current
        : localEvent
    );

    if (!isAuthenticated) {
      setAuthReason(
        'Ingresa a tu cuenta para seleccionar sillas y continuar con tu compra.'
      );

      setView('login');

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      return;
    }

    setView('checkout');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    try {
      const eventDetail = await getEvent(eventId);

      setSelectedEvent(eventDetail);
    } catch {
      setSelectedEvent(
        (current) => current ?? localEvent
      );
    }
  };

  return (
    <div className="app-shell">
      <Header
        activeView={view}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onNavigate={navigate}
      />

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
          <EventDetailPage
            event={currentSelectedEvent}
            onBack={() => navigate('home')}
            onCheckout={goToCheckout}
          />
        )}

        {view === 'checkout' && (
          <CheckoutPage
            event={currentSelectedEvent}
            user={user}
            onBack={() => navigate('detail')}
          />
        )}

        {view === 'profile' && (
          <ProfilePage user={user} />
        )}

        {view === 'history' && (
          <HistoryPage />
        )}

        {view === 'favorites' && (
          <FavoritesPage
            events={events}
            onOpenEvent={openEvent}
          />
        )}

        {view === 'pqrs' && (
          <PqrsPage />
        )}

        {view === 'login' && (
          <LoginPage
            reason={authReason}
            onAuthenticated={handleAuthSuccess}
          />
        )}
      </main>
    </div>
  );
}

export default App;