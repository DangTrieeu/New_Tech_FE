import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/molecules/SearchBar/SearchBar';
import ContactItem from '../components/molecules/ContactItem/ContactItem';
import Button from '../components/atoms/Button/Button';

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
          <Button
            onClick={() => navigate('/chat')}
            variant="ghost"
            style={{ color: 'var(--primary-color)' }}
          >
            ← Quay lại
          </Button>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Danh bạ
          </h1>
          <div className="w-10"></div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm liên hệ..."
          />
        </div>

        {/* Contacts List */}
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--surface-color)' }}>
          {filteredContacts.map((contact, index) => (
            <ContactItem
              key={contact.id}
              avatar={contact.avatar}
              name={contact.name}
              status={contact.status}
              showBorder={index < filteredContacts.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;

