import CategoryTabs from '../components/CategoryTabs.jsx';
import EventSection from '../components/EventSection.jsx';
import SearchPanel from '../components/SearchPanel.jsx';
import VenueStrip from '../components/VenueStrip.jsx';

export default function HomePage({ events, filters, isLoading, onFiltersChange, onOpenEvent }) {
  const filteredEvents = events.filter((event) => {
    const query = filters.query.trim().toLowerCase();
    const matchesQuery = !query
      || event.title.toLowerCase().includes(query)
      || event.venue.toLowerCase().includes(query)
      || event.city.toLowerCase().includes(query)
      || event.category.toLowerCase().includes(query);
    const matchesCategory = filters.category === 'All' || event.category === filters.category;
    const matchesCity = filters.city === 'All' || event.city === filters.city;
    const matchesDate = !filters.date || event.date === filters.date;
    return matchesQuery && matchesCategory && matchesCity && matchesDate;
  });

  const featuredEvents = filteredEvents.filter((event) => event.featured);
  const regularEvents = filteredEvents.filter((event) => !event.featured);

  return (
    <>
      <SearchPanel filters={filters} onFiltersChange={onFiltersChange} />
      <CategoryTabs
        activeCategory={filters.category}
        onSelect={(category) => onFiltersChange({ ...filters, category })}
      />

      {isLoading ? (
        <section className="empty-state">
          <h2>Loading events.</h2>
          <p>We are preparing the lineup for you.</p>
        </section>
      ) : filteredEvents.length === 0 ? (
        <section className="empty-state">
          <h2>No events match those filters.</h2>
          <p>Try another city, category, or date to check availability.</p>
        </section>
      ) : (
        <>
          <EventSection
            title="Featured events"
            subtitle="High demand"
            events={featuredEvents.length ? featuredEvents : filteredEvents.slice(0, 2)}
            onOpen={onOpenEvent}
            featured
          />
          <EventSection
            title="Available lineup"
            subtitle="On sale"
            events={regularEvents.length ? regularEvents : filteredEvents.slice(2)}
            onOpen={onOpenEvent}
          />
          <VenueStrip />
        </>
      )}
    </>
  );
}
