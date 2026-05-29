import { Calendar, MapPin, Search, Tags } from 'lucide-react';
import { categories, cities } from '../data/events.js';

export default function SearchPanel({ filters, onFiltersChange }) {
  const update = (key, value) => onFiltersChange({ ...filters, [key]: value });

  return (
    <section className="search-panel" aria-label="Search events">
      <div className="filter-row">
        <label className="filter-field">
          <span><MapPin size={16} /> City</span>
          <select value={filters.city} onChange={(event) => update('city', event.target.value)}>
            <option value="All">All</option>
            {cities.map((city) => <option key={city} value={city}>{city}</option>)}
          </select>
        </label>

        <label className="filter-field">
          <span><Tags size={16} /> Category</span>
          <select value={filters.category} onChange={(event) => update('category', event.target.value)}>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </label>

        <label className="filter-field">
          <span><Calendar size={16} /> Date</span>
          <input type="date" value={filters.date} onChange={(event) => update('date', event.target.value)} />
        </label>
      </div>

      <label className="search-box">
        <Search size={20} />
        <input
          value={filters.query}
          onChange={(event) => update('query', event.target.value)}
          placeholder="Search by artist, event, venue, or city"
        />
        <button type="button">Search</button>
      </label>
    </section>
  );
}
