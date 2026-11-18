/**
 * Formats a number into Indian Rupee currency format (e.g., ₹1,50,000)
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats an ISO date string into readable Indian standard format (e.g., "14 Nov 2026")
 */
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch (err) {
    return dateString;
  }
};

/**
 * Formats date into YYYY-MM-DD for standard HTML input elements
 */
export const toInputDateFormat = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Visual metadata for agreement statuses
 */
export const statusConfig = {
  Draft: {
    label: 'Draft',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
  },
  Pending: {
    label: 'Pending',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  Confirmed: {
    label: 'Confirmed',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  Completed: {
    label: 'Completed',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  Cancelled: {
    label: 'Cancelled',
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
  },
};
