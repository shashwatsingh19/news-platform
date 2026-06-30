// Utility Functions for News Application

/**
 * Debounces a function to prevent it from being executed too rapidly
 * @param {Function} func The function to execute
 * @param {number} delay The delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

/**
 * Formats an ISO date string into a relative time (e.g., '3 hours ago')
 * @param {string} dateString ISO string date
 * @returns {string} Relative time representation
 */
function timeAgo(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const secondsDiff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (isNaN(secondsDiff) || secondsDiff < 0) {
      return 'just now';
    }

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [key, value] of Object.entries(intervals)) {
      const count = Math.floor(secondsDiff / value);
      if (count >= 1) {
        return `${count} ${key}${count > 1 ? 's' : ''} ago`;
      }
    }

    return 'just now';
  } catch (e) {
    return 'recently';
  }
}

/**
 * Safe local storage manager with fallback
 */
const storage = {
  get(key, defaultValue = null) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : defaultValue;
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('Error writing to localStorage:', e);
      return false;
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn('Error removing from localStorage:', e);
      return false;
    }
  }
};

// Export to window object for modular script access
window.utils = {
  debounce,
  timeAgo,
  storage
};
