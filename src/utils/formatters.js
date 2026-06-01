export function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDate(dateValue) {
  if (!dateValue) return 'To be confirmed';

  const normalizedValue = String(dateValue);
  const date = normalizedValue.includes('T')
    ? new Date(normalizedValue)
    : new Date(`${normalizedValue}T12:00:00`);

  if (Number.isNaN(date.getTime())) return 'To be confirmed';

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

export function getDateParts(dateValue) {
  const normalizedValue = String(dateValue ?? '');
  const date = normalizedValue.includes('T')
    ? new Date(normalizedValue)
    : new Date(`${normalizedValue}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return { day: '--', month: 'TBD' };
  }

  return {
    day: new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(date),
    month: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date).replace('.', '')
  };
}
