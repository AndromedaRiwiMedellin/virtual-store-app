export const categories = [
  'Todos',
  'Conciertos',
  'Cine',
  'Teatro',
  'Deportes',
  'Familia',
  'Experiencias',
  'Eventos'
];

export const cities = ['Medellin', 'Bogota', 'Cali', 'Barranquilla', 'Cartagena'];

export const events = [
  {
    id: 'evt-001',
    title: 'Noche Andromeda Live',
    category: 'Conciertos',
    city: 'Medellin',
    venue: 'Movistar Arena Medellin',
    address: 'Carrera 48 # 10-45',
    date: '2026-06-14',
    time: '20:00',
    priceFrom: 85000,
    featured: true,
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1400&q=80',
    description: 'Una noche de musica urbana, luces inmersivas y artistas invitados para abrir temporada.',
    zones: [
      { id: 'vip', name: 'VIP', price: 180000, available: 42 },
      { id: 'preferente', name: 'Preferente', price: 125000, available: 84 },
      { id: 'general', name: 'General', price: 85000, available: 160 }
    ]
  },
  {
    id: 'evt-002',
    title: 'Teatro en la Ciudad',
    category: 'Teatro',
    city: 'Bogota',
    venue: 'Teatro Central',
    address: 'Calle 45 # 18-22',
    date: '2026-06-18',
    time: '19:30',
    priceFrom: 55000,
    featured: true,
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1400&q=80',
    description: 'Una obra contemporanea sobre memoria, familia y decisiones que cambian una vida.',
    zones: [
      { id: 'platea', name: 'Platea', price: 95000, available: 28 },
      { id: 'balcon', name: 'Balcon', price: 70000, available: 64 },
      { id: 'general', name: 'General', price: 55000, available: 110 }
    ]
  },
  {
    id: 'evt-003',
    title: 'Final Urbana 2026',
    category: 'Deportes',
    city: 'Medellin',
    venue: 'Estadio Metropolitano',
    address: 'Av. Regional # 70-10',
    date: '2026-06-22',
    time: '17:00',
    priceFrom: 45000,
    featured: false,
    image: 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=1400&q=80',
    description: 'La gran final local con tribunas llenas, experiencia familiar y zonas preferenciales.',
    zones: [
      { id: 'occidental', name: 'Occidental', price: 110000, available: 90 },
      { id: 'oriental', name: 'Oriental', price: 75000, available: 130 },
      { id: 'norte', name: 'Norte', price: 45000, available: 240 }
    ]
  },
  {
    id: 'evt-004',
    title: 'Festival Familiar Orbital',
    category: 'Familia',
    city: 'Cali',
    venue: 'Parque Cultural',
    address: 'Av. 3 Norte # 12-30',
    date: '2026-06-28',
    time: '14:00',
    priceFrom: 30000,
    featured: false,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1400&q=80',
    description: 'Shows, talleres creativos, gastronomia y experiencias para todas las edades.',
    zones: [
      { id: 'familiar', name: 'Familiar', price: 70000, available: 50 },
      { id: 'adulto', name: 'Adulto', price: 45000, available: 160 },
      { id: 'nino', name: 'Nino', price: 30000, available: 140 }
    ]
  },
  {
    id: 'evt-005',
    title: 'Museo Nocturno',
    category: 'Experiencias',
    city: 'Cartagena',
    venue: 'Centro Historico',
    address: 'Plaza Mayor # 4-12',
    date: '2026-07-03',
    time: '21:00',
    priceFrom: 65000,
    featured: false,
    image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1400&q=80',
    description: 'Recorrido guiado con arte, musica y narrativas urbanas en una noche especial.',
    zones: [
      { id: 'premium', name: 'Premium', price: 120000, available: 24 },
      { id: 'ruta', name: 'Ruta guiada', price: 65000, available: 78 }
    ]
  }
];

export const venues = [
  { name: 'Movistar Arena Medellin', city: 'Medellin', events: 12 },
  { name: 'Teatro Central', city: 'Bogota', events: 8 },
  { name: 'Parque Cultural', city: 'Cali', events: 6 },
  { name: 'Centro Historico', city: 'Cartagena', events: 5 }
];

export const purchases = [
  { id: 'ORD-1024', event: 'Noche Andromeda Live', date: '2026-06-14', total: 265000, status: 'Confirmada' },
  { id: 'ORD-1019', event: 'Teatro en la Ciudad', date: '2026-06-18', total: 140000, status: 'Pendiente' }
];
