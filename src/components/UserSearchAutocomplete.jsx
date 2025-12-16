import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useClickOutside } from '@/hooks/useClickOutside';
import { searchUsers } from '@/services/userService';
import { SEARCH_CONFIG } from '@/config/api';

/**
 * UserSearchAutocomplete Component
 * Provides autocomplete search functionality for finding users
 * Features: debounced search, keyboard navigation, loading states
 *
 * @param {Function} onSelect - Callback when user is selected
 * @param {string} placeholder - Input placeholder text
 * @param {number} limit - Max number of results
 */
const UserSearchAutocomplete = ({
  onSelect,
  placeholder = 'Tìm kiếm người dùng...',
  limit = SEARCH_CONFIG.MAX_RESULTS
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState(null);

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const debouncedQuery = useDebounce(query, SEARCH_CONFIG.DEBOUNCE_DELAY);

  // Close dropdown when clicking outside
  useClickOutside(dropdownRef, () => setIsOpen(false));

  // Fetch search results when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length >= SEARCH_CONFIG.MIN_CHARS) {
      performSearch();
    } else {
      setResults([]);
      setIsOpen(false);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, limit]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await searchUsers(debouncedQuery, limit);
      const users = response.data || [];

      setResults(users);
      setIsOpen(true);

      if (users.length === 0 && debouncedQuery.length >= SEARCH_CONFIG.MIN_CHARS) {
        setError('Không tìm thấy người dùng nào');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Lỗi khi tìm kiếm. Vui lòng thử lại.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (user) => {
    onSelect(user);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    setError(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;

      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;

      default:
        break;
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 border rounded-lg outline-none transition-all"
          style={{
            backgroundColor: 'var(--background-secondary)',
            borderColor: isOpen ? 'var(--primary-color)' : 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
        />

        {/* Loading or Clear Button */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--primary-color)' }} />
          ) : query ? (
            <button
              onClick={handleClear}
              className="hover:opacity-70 transition-opacity"
              type="button"
            >
              <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            </button>
          ) : null}
        </div>
      </div>

      {/* Minimum characters hint */}
      {query.length > 0 && query.length < SEARCH_CONFIG.MIN_CHARS && (
        <p className="text-xs mt-1 ml-1" style={{ color: 'var(--text-secondary)' }}>
          Nhập ít nhất {SEARCH_CONFIG.MIN_CHARS} ký tự để tìm kiếm
        </p>
      )}

      {/* Dropdown Results */}
      {isOpen && (
        <div
          className="absolute z-50 w-full mt-2 rounded-lg shadow-lg border overflow-hidden"
          style={{
            backgroundColor: 'var(--background-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          {error ? (
            <div className="p-4 text-center" style={{ color: 'var(--text-secondary)' }}>
              {error}
            </div>
          ) : results.length > 0 ? (
            <ul className="max-h-64 overflow-y-auto">
              {results.map((user, index) => (
                <li key={user.id}>
                  <button
                    onClick={() => handleSelect(user)}
                    className="w-full px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer"
                    style={{
                      backgroundColor: selectedIndex === index
                        ? 'var(--hover-color)'
                        : 'transparent',
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'var(--primary-color)' }}
                    >
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-left overflow-hidden">
                      <p
                        className="font-medium truncate"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {user.name}
                      </p>
                      <p
                        className="text-sm truncate"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {user.email}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default UserSearchAutocomplete;

