import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ContactsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const contacts = [
    { id: 1, name: 'Nguyễn Văn A', avatar: '👤', status: 'online' },
    { id: 2, name: 'Trần Thị B', avatar: '👤', status: 'offline' },
    { id: 3, name: 'Lê Văn C', avatar: '👤', status: 'online' },
    { id: 4, name: 'Phạm Thị D', avatar: '👤', status: 'offline' },
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/chat')}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--primary-color)' }}
          >
            ← Quay lại
          </button>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Danh bạ
          </h1>
          <div className="w-10"></div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm liên hệ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg outline-none"
            style={{
              backgroundColor: 'var(--surface-color)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)'
            }}
          />
        </div>

        {/* Contacts List */}
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--surface-color)' }}>
          {filteredContacts.map((contact, index) => (
            <div
              key={contact.id}
              className="flex items-center p-4 cursor-pointer transition-colors"
              style={{
                borderBottom: index < filteredContacts.length - 1 ? '1px solid var(--border-color)' : 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-color)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div className="relative mr-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: 'var(--hover-color)' }}>
                  {contact.avatar}
                </div>
                {contact.status === 'online' && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2"
                    style={{ borderColor: 'var(--surface-color)' }}></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {contact.name}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {contact.status === 'online' ? 'Đang hoạt động' : 'Không hoạt động'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;

