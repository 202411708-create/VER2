/**
 * Debounce utility for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 500) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Debounced localStorage write
 */
let storageWriteTimers = {};

export function debouncedStorageWrite(key, value, delay = 500) {
  if (storageWriteTimers[key]) {
    clearTimeout(storageWriteTimers[key]);
  }

  storageWriteTimers[key] = setTimeout(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to write to localStorage:', error);
    }
    delete storageWriteTimers[key];
  }, delay);
}
