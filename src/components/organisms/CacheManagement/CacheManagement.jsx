import React, { useState, useEffect } from 'react';
import { Database, Trash2, RefreshCw, TrendingUp } from 'lucide-react';
import { getCacheStats, clearCache } from '@/services/aiService';
import toast from 'react-hot-toast';
import Button from '../../atoms/Button/Button';

const CacheManagement = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await getCacheStats();
      setStats(response.data || response);
    } catch (error) {
      console.error('Load cache stats error:', error);
      toast.error('Không thể tải thống kê cache');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa toàn bộ cache?')) return;

    try {
      setClearing(true);
      await clearCache();
      toast.success('Đã xóa cache thành công');
      await loadStats();
    } catch (error) {
      console.error('Clear cache error:', error);
      toast.error('Không thể xóa cache');
    } finally {
      setClearing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const hitRate = stats?.hits && stats?.total
    ? ((stats.hits / stats.total) * 100).toFixed(1)
    : 0;

  return (
    <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--surface-color)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--primary-color)' }}>
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
              Quản lý Cache AI
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Thống kê và quản lý cache hệ thống
            </p>
          </div>
        </div>
        <button
          onClick={loadStats}
          disabled={loading}
          className="p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
          style={{ color: 'var(--primary-color)' }}
          title="Làm mới"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats Grid */}
      {loading && !stats ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary-color)' }}></div>
        </div>
      ) : stats ? (
        <div className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cache Hits */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background-color)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Cache Hits</span>
                <TrendingUp className="w-4 h-4" style={{ color: '#10b981' }} />
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {stats.hits || 0}
              </p>
            </div>

            {/* Cache Misses */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background-color)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Cache Misses</span>
                <TrendingUp className="w-4 h-4" style={{ color: '#ef4444' }} />
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {stats.misses || 0}
              </p>
            </div>

            {/* Hit Rate */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background-color)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Hit Rate</span>
                <TrendingUp className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {hitRate}%
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span>Cache Efficiency</span>
              <span>{hitRate}%</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-color)' }}>
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${hitRate}%`,
                  backgroundColor: hitRate > 70 ? '#10b981' : hitRate > 40 ? '#f59e0b' : '#ef4444',
                }}
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleClearCache}
            disabled={clearing}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#ef4444', color: 'white' }}
          >
            {clearing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang xóa...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Xóa toàn bộ Cache</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <p style={{ color: 'var(--text-secondary)' }}>Không có dữ liệu thống kê</p>
        </div>
      )}
    </div>
  );
};

export default CacheManagement;

