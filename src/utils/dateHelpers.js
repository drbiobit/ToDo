export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
};

export const formatTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const getNextOccurrence = (currentDate, recurrenceType, options = {}) => {
  const date = new Date(currentDate);
  
  switch (recurrenceType) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      return null;
  }
  
  return date.toISOString();
};

export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date() && !dueDate.includes('T23:59:59');
};

export const getDayName = (date) => {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date(date));
};
