import EventSection from '../components/EventSection.jsx';

export default function FavoritesPage({ events, onOpenEvent }) {
  return (
    <EventSection
      title="Eventos favoritos"
      subtitle="Guardados"
      events={events.slice(0, 3)}
      onOpen={onOpenEvent}
    />
  );
}
