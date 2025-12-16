import { useEffect } from 'react';

/**
 * useClickOutside Hook
 * Detects clicks outside of a specified element
 * Useful for closing dropdowns, modals, etc.
 *
 * @param {React.RefObject} ref - Reference to the element
 * @param {Function} handler - Callback function to execute on outside click
 */
export const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    // Add event listeners for both mouse and touch events
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

