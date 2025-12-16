import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CacheManagement from '@/components/organisms/CacheManagement/CacheManagement';

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--background-color)' }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <button
          onClick={() => navigate('/chat')}
          className="flex items-center gap-2 mb-4 px-4 py-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Chat</span>
        </button>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Admin Dashboard
        </h1>
        <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
          Quản lý hệ thống và AI Cache
        </p>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cache Management */}
          <CacheManagement />

          {/* Placeholder for other admin features */}
          <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--surface-color)' }}>
            <h3 className="font-semibold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
              Thống kê hệ thống
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Các tính năng quản trị khác sẽ được thêm vào đây...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

