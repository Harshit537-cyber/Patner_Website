export const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export const formatTime = (date) =>
  new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatDateTime = (date) => `${formatDate(date)}, ${formatTime(date)}`;

export const truncate = (text = '', len = 80) =>
  text.length > len ? `${text.slice(0, len).trim()}...` : text;

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
