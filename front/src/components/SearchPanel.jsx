import { Calendar, MapPin, Search, Tags } from 'lucide-react';
import { categories, cities } from '../data/events.js';

export default function SearchPanel({ filters, onFiltersChange }) {
  const update = (key, value) => onFiltersChange({ ...filters, [key]: value });

  return (
    <section className="search-panel" aria-label="Buscar eventos">
      <div className="filter-row">
        <label className="filter-field">
          <span><MapPin size={16} /> Ciudad</span>
          <select value={filters.city} onChange={(event) => update('city', event.target.value)}>
            <option value="Todas">Todas</option>
            {cities.map((city) => <option key={city} value={city}>{city}</option>)}
          </select>
        </label>

        <label className="filter-field">
          <span><Tags size={16} /> Categoría</span>
          <select value={filters.category} onChange={(event) => update('category', event.target.value)}>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </label>

        <label className="filter-field">
          <span><Calendar size={16} /> Fecha</span>
          <input type="date" value={filters.date} onChange={(event) => update('date', event.target.value)} />
        </label>
      </div>

      <label className="search-box">
        <Search size={20} />
        <input
          value={filters.query}
          onChange={(event) => update('query', event.target.value)}
          placeholder="Buscar por artista, evento, escenario o ciudad"
        />
        <button type="button">Buscar</button>
      </label>
    </section>
  );
}
