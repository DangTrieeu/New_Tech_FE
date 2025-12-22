import React, { useState } from 'react';
import { X, Users, Search, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { searchUsers } from '@/services/userService';
import { createGroupRoom } from '@/services/roomService';
import { SEARCH_CONFIG } from '@/config/api';
import Button from '../../atoms/Button/Button';
import Input from '../../atoms/Input/Input';

/**
 * CreateGroupModal Component
 * Modal để tạo nhóm chat với nhiều người dùng
 * Features: tìm kiếm người dùng, chọn nhiều người, đặt tên nhóm
 */
const CreateGroupModal = ({ isOpen, onClose, onSuccess, currentUserId }) => {
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const debouncedQuery = useDebounce(searchQuery, SEARCH_CONFIG.DEBOUNCE_DELAY);

  // Tìm kiếm người dùng khi query thay đổi
  React.useEffect(() => {
    if (debouncedQuery.length >= SEARCH_CONFIG.MIN_CHARS) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery]);

  const performSearch = async () => {
    setIsSearching(true);
    try {
      const response = await searchUsers(debouncedQuery, SEARCH_CONFIG.MAX_RESULTS);
      const users = response.data || [];
      // Lọc bỏ người dùng hiện tại và những người đã được chọn
      const filteredUsers = users.filter(
        user => user.id !== currentUserId && !selectedUsers.find(selected => selected.id === user.id)
      );
      setSearchResults(filteredUsers);
    } catch (err) {
      console.error('Search error:', err);
      setError('Lỗi khi tìm kiếm người dùng');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUsers(prev => [...prev, user]);
    setSearchResults(prev => prev.filter(u => u.id !== user.id));
    setSearchQuery('');
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError('Vui lòng nhập tên nhóm');
      return;
    }

    if (selectedUsers.length === 0) {
      setError('Vui lòng chọn ít nhất 1 người');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const participantIds = selectedUsers.map(user => user.id);
      const response = await createGroupRoom(groupName, participantIds);

      // Reset form
      setGroupName('');
      setSelectedUsers([]);
      setSearchQuery('');
      setSearchResults([]);

      // Gọi callback thành công
      if (onSuccess) {
        onSuccess(response.data);
      }

      onClose();
    } catch (err) {
      console.error('Create group error:', err);
      setError(err.response?.data?.message || 'Lỗi khi tạo nhóm');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setGroupName('');
    setSelectedUsers([]);
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="w-full max-w-lg mx-4 rounded-lg shadow-xl"
        style={{ backgroundColor: 'var(--surface-color)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Tạo nhóm mới
            </h2>
          </div>
          <Button
            variant='ghost'
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-opacity-10 hover:bg-gray-500"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {/* Group Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Tên nhóm
            </label>
            <Input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Nhập tên nhóm..."
              className="w-full"
            />
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Thành viên đã chọn ({selectedUsers.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                  >
                    <span className="text-sm">{user.name}</span>
                    <Button
                      variant="ghost"
                      onClick={() => handleRemoveUser(user.id)}
                      className="ml-2 hover:opacity-80 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Users */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Thêm thành viên
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <Search className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              </div>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm người dùng..."
                className="w-full"
                style={{ paddingLeft: '2.5rem', paddingRight: isSearching ? '2.5rem' : '1rem' }}
              />
              {isSearching && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none z-10">
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--text-secondary)' }} />
                </div>
              )}
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
              <div className="max-h-60 overflow-y-auto">
                {searchResults.map(user => (
                  <Button
                    key={user.id}
                    variant="ghost"
                    onClick={() => handleSelectUser(user)}
                    className="w-full flex items-center p-3 hover:bg-opacity-10 hover:bg-gray-500 border-b last:border-b-0 justify-start"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-3">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        user.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                        {user.name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {user.email}
                      </p>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500 bg-opacity-10">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <Button
            variant="ghost"
            onClick={handleClose}
            className="px-4 py-2"
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateGroup}
            disabled={isCreating || !groupName.trim() || selectedUsers.length === 0}
            className="px-4 py-2 flex items-center"
          >
            {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isCreating ? 'Đang tạo...' : 'Tạo nhóm'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;

