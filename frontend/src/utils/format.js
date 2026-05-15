const euroFormatter = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' });
const dateFormatter = new Intl.DateTimeFormat('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' });
const dateTimeFormatter = new Intl.DateTimeFormat('nl-NL', {
  day: '2-digit', month: '2-digit', year: 'numeric',
  hour: '2-digit', minute: '2-digit',
});

export function formatEuro(value) {
  if (value == null || isNaN(value)) return '€ 0,00';
  return euroFormatter.format(value);
}

export function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  return dateFormatter.format(d);
}

export function formatDateTime(value) {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  return dateTimeFormatter.format(d);
}