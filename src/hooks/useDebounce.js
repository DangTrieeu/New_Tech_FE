import { useState, useEffect } from 'react';

/**
 * useDebounce Hook
 * Delays updating a value until after a specified delay
 * Useful for search inputs to avoid excessive API calls
 *
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 300)
 * @returns {any} - The debounced value
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: clear timeout if value changes before delay expires
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

