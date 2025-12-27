import React, { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import * as adminService from '../services/adminService';
import { MoreVertical, Eye, Trash2 } from 'lucide-react';
import Button from '@/components/atoms/Button/Button';
import { useDebounce } from '@/hooks/useDebounce';
import TableControls from '@/components/organisms/TableControls/TableControls';
import SortableTableHeader from '@/components/molecules/SortableTableHeader/SortableTableHeader';
import Pagination from '@/components/molecules/Pagination/Pagination';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit, setLimit] = useState(10);
  
  // Sorting states
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers({
        page: currentPage,
        limit,
        sortBy,
        sortOrder,
        search: debouncedSearch
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setTotalUsers(response.data.total);
    } catch (error) {
      toast.error('Lỗi tải danh sách users');
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, sortBy, sortOrder, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!confirm('Bạn có chắc muốn xóa user này?')) return;

    try {
      await adminService.deleteUser(userId);
      toast.success('Xóa user thành công');
      fetchUsers();
      setOpenDropdown(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi xóa user');
    }
  };

  const viewUserDetail = async (userId) => {
    try {
      const response = await adminService.getUserById(userId);
      setSelectedUser(response.data);
      setOpenDropdown(null);
    } catch (error) {
      toast.error('Lỗi tải chi tiết user');
    }
  };

  const toggleDropdown = (userId) => {
    setOpenDropdown(openDropdown === userId ? null : userId);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
      </div>

      <TableControls
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Tìm kiếm theo tên hoặc email..."
        limitValue={limit}
        onLimitChange={handleLimitChange}
        totalItems={totalUsers}
        itemLabel="users"
      />

      <div className="bg-white rounded-xl shadow overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-gray-600">Đang tải...</div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <SortableTableHeader
                  label="ID"
                  field="id"
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                  sortable={false}
                />
                <SortableTableHeader
                  label="Name"
                  field="name"
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Email"
                  field="email"
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Role"
                  field="role"
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Status"
                  field="status"
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Rooms"
                  field="totalRoomsJoined"
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Messages"
                  field="totalMessagesSent"
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${user.status === 'ONLINE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.totalRoomsJoined}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.totalMessagesSent}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="relative">
                      <Button
                        useTailwind
                        onClick={() => toggleDropdown(user.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </Button>

                      {/* Dropdown Menu */}
                      {openDropdown === user.id && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-[60]"
                        >
                      <div className="py-1">
                        <Button
                          useTailwind
                          onClick={() => viewUserDetail(user.id)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                        {user.role !== 'ADMIN' && (
                          <Button
                            useTailwind
                            onClick={() => handleDeleteUser(user.id)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete User
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalUsers}
          itemsPerPage={limit}
          onPageChange={handlePageChange}
          itemsOnCurrentPage={users.length}
        />
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Chi tiết User</h2>
              <Button
                useTailwind
                onClick={() => setSelectedUser(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Thông tin cơ bản</h3>
                <p><strong>Tên:</strong> {selectedUser.user.name}</p>
                <p><strong>Email:</strong> {selectedUser.user.email}</p>
                <p><strong>Role:</strong> {selectedUser.user.role}</p>
                <p><strong>Status:</strong> {selectedUser.user.status}</p>
                <p><strong>Tổng Rooms:</strong> {selectedUser.user.totalRoomsJoined}</p>
                <p><strong>Tổng Messages:</strong> {selectedUser.user.totalMessagesSent}</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Rooms đã tham gia</h3>
                <div className="space-y-2">
                  {selectedUser.rooms.map((room) => (
                    <div key={room.id} className="p-3 bg-gray-50 rounded">
                      <p className="font-medium">{room.name}</p>
                      <p className="text-sm text-gray-600">Type: {room.type}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
