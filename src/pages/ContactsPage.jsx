import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const contacts = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', status: 'online' },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com', status: 'offline' },
    { id: 3, name: 'Lê Văn C', email: 'levanc@example.com', status: 'online' },
    { id: 4, name: 'Phạm Thị D', email: 'phamthid@example.com', status: 'offline' },
    { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@example.com', status: 'online' },
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Danh bạ</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm liên hệ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Contacts List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-700">
              Tất cả liên hệ ({filteredContacts.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {contact.name.charAt(0)}
                    </div>
                    {contact.status === 'online' && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                    <p className="text-sm text-gray-500">{contact.email}</p>
                  </div>
                  <button
                    onClick={() => navigate('/chat')}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Nhắn tin
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Không tìm thấy liên hệ nào
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactsPage;
