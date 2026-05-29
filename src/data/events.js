export const categories = [
  'All',
  'Concerts',
  'Movies',
  'Theater',
  'Sports',
  'Family',
  'Experiences',
  'Events'
];

export const cities = ['Medellin', 'Bogota', 'Cali', 'Barranquilla', 'Cartagena'];

export const events = [
  {
    id: 'evt-001',
    title: 'Noche Andromeda Live',
    category: 'Concerts',
    city: 'Medellin',
    venue: 'Movistar Arena Medellin',
    address: 'Carrera 48 # 10-45',
    date: '2026-06-14',
    time: '20:00',
    priceFrom: 85000,
    featured: true,
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1400&q=80',
    description: 'A night of urban music, immersive lights, and guest artists to open the season.',
    zones: [
      { id: 'vip', name: 'VIP', price: 180000, available: 42 },
      { id: 'preferente', name: 'Preferente', price: 125000, available: 84 },
      { id: 'general', name: 'General', price: 85000, available: 160 }
    ]
  },
  {
    id: 'evt-002',
    title: 'Theater in the City',
    category: 'Theater',
    city: 'Bogota',
    venue: 'Teatro Central',
    address: 'Calle 45 # 18-22',
    date: '2026-06-18',
    time: '19:30',
    priceFrom: 55000,
    featured: true,
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1400&q=80',
    description: 'A contemporary play about memory, family, and decisions that change a life.',
    zones: [
      { id: 'platea', name: 'Orchestra', price: 95000, available: 28 },
      { id: 'balcon', name: 'Balcony', price: 70000, available: 64 },
      { id: 'general', name: 'General', price: 55000, available: 110 }
    ]
  },
  {
    id: 'evt-003',
    title: 'Final Urbana 2026',
    category: 'Sports',
    city: 'Medellin',
    venue: 'Estadio Metropolitano',
    address: 'Av. Regional # 70-10',
    date: '2026-06-22',
    time: '17:00',
    priceFrom: 45000,
    featured: false,
    image: 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=1400&q=80',
    description: 'The big local final with packed stands, family experience, and preferred zones.',
    zones: [
      { id: 'occidental', name: 'West', price: 110000, available: 90 },
      { id: 'oriental', name: 'East', price: 75000, available: 130 },
      { id: 'norte', name: 'North', price: 45000, available: 240 }
    ]
  },
  {
    id: 'evt-004',
    title: 'Festival Familiar Orbital',
    category: 'Family',
    city: 'Cali',
    venue: 'Parque Cultural',
    address: 'Av. 3 Norte # 12-30',
    date: '2026-06-28',
    time: '14:00',
    priceFrom: 30000,
    featured: false,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1400&q=80',
    description: 'Shows, creative workshops, food, and experiences for all ages.',
    zones: [
      { id: 'familiar', name: 'Family', price: 70000, available: 50 },
      { id: 'adulto', name: 'Adult', price: 45000, available: 160 },
      { id: 'nino', name: 'Child', price: 30000, available: 140 }
    ]
  },
  {
    id: 'evt-005',
    title: 'Museo Nocturno',
    category: 'Experiences',
    city: 'Cartagena',
    venue: 'Centro Historico',
    address: 'Plaza Mayor # 4-12',
    date: '2026-07-03',
    time: '21:00',
    priceFrom: 65000,
    featured: false,
    image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1400&q=80',
    description: 'Guided tour with art, music, and urban storytelling on a special night.',
    zones: [
      { id: 'premium', name: 'Premium', price: 120000, available: 24 },
      { id: 'ruta', name: 'Guided route', price: 65000, available: 78 }
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
  { id: 'ORD-1024', event: 'Noche Andromeda Live', date: '2026-06-14', total: 265000, status: 'Confirmed' },
  { id: 'ORD-1019', event: 'Theater in the City', date: '2026-06-18', total: 140000, status: 'Pending' }
];
