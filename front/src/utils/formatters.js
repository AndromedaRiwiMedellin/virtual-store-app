export function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDate(dateValue) {
  const date = new Date(`${dateValue}T12:00:00`);
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

export function getDateParts(dateValue) {
  const date = new Date(`${dateValue}T12:00:00`);
  return {
    day: new Intl.DateTimeFormat('es-CO', { day: '2-digit' }).format(date),
    month: new Intl.DateTimeFormat('es-CO', { month: 'short' }).format(date).replace('.', '')
  };
}
