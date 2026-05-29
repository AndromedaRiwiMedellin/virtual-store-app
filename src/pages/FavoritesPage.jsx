import EventSection from '../components/EventSection.jsx';

export default function FavoritesPage({ events, onOpenEvent }) {
  return (
    <EventSection
      title="Favorite events"
      subtitle="Saved"
      events={events.slice(0, 3)}
      onOpen={onOpenEvent}
    />
  );
}
