import { categories } from '../data/events.js';

export default function CategoryTabs({ activeCategory, onSelect }) {
  return (
    <div className="category-tabs" aria-label="Categorias de eventos">
      {categories.map((category) => (
        <button
          key={category}
          className={category === activeCategory ? 'category-tab active' : 'category-tab'}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
