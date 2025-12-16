import React, { useState } from 'react';
import UserSearchAutocomplete from '@/components/UserSearchAutocomplete';
import FileUpload from '@/components/FileUpload';
import toast from 'react-hot-toast';

/**
 * Demo Page for Autocomplete Search & File Upload
 * Shows usage examples of both components
 */
const DemoPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleUserSelect = (user) => {
    console.log('Selected user:', user);
    setSelectedUser(user);
    toast.success(`Đã chọn: ${user.name}`);
  };

  const handleUploadSuccess = (result) => {
    console.log('Upload success:', result);
    setUploadedFile(result);
    toast.success('Tải file thành công!');
  };

  const handleUploadError = (error) => {
    console.error('Upload error:', error);
    toast.error('Lỗi khi tải file');
  };

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: 'var(--background-color)' }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Search & Upload Demo
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Test autocomplete search và file upload
          </p>
        </div>

        {/* User Search Section */}
        <section
          className="p-6 rounded-lg shadow-md"
          style={{ backgroundColor: 'var(--background-secondary)' }}
        >
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            🔍 Tìm kiếm người dùng
          </h2>

          <UserSearchAutocomplete onSelect={handleUserSelect} />

          {selectedUser && (
            <div
              className="mt-4 p-4 rounded-lg"
              style={{
                backgroundColor: 'var(--hover-color)',
                borderLeft: '4px solid var(--primary-color)',
              }}
            >
              <p
                className="font-semibold mb-1"
                style={{ color: 'var(--text-primary)' }}
              >
                Người dùng đã chọn:
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
                  {selectedUser.avatar_url ? (
                    <img
                      src={selectedUser.avatar_url}
                      alt={selectedUser.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p
                    className="font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {selectedUser.name}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {selectedUser.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* File Upload Section */}
        <section
          className="p-6 rounded-lg shadow-md"
          style={{ backgroundColor: 'var(--background-secondary)' }}
        >
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            📁 Tải file lên
          </h2>

          <FileUpload
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            autoUpload={false}
          />

          {uploadedFile && (
            <div
              className="mt-4 p-4 rounded-lg"
              style={{
                backgroundColor: 'var(--hover-color)',
                borderLeft: '4px solid var(--primary-color)',
              }}
            >
              <p
                className="font-semibold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                File đã tải lên:
              </p>
              <div className="space-y-1 text-sm">
                <p style={{ color: 'var(--text-secondary)' }}>
                  <span className="font-medium">URL:</span>{' '}
                  <a
                    href={uploadedFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline break-all"
                  >
                    {uploadedFile.url}
                  </a>
                </p>
                <p style={{ color: 'var(--text-secondary)' }}>
                  <span className="font-medium">Filename:</span> {uploadedFile.filename}
                </p>
                <p style={{ color: 'var(--text-secondary)' }}>
                  <span className="font-medium">Type:</span> {uploadedFile.mimetype}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Usage Example Code */}
        <section
          className="p-6 rounded-lg shadow-md"
          style={{ backgroundColor: 'var(--background-secondary)' }}
        >
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            💻 Cách sử dụng
          </h2>

          <div className="space-y-4">
            <div>
              <h3
                className="font-medium mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                User Search Autocomplete:
              </h3>
              <pre
                className="p-3 rounded text-xs overflow-x-auto"
                style={{
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-primary)',
                }}
              >
{`<UserSearchAutocomplete
  onSelect={(user) => {
    console.log('Selected:', user);
    // Do something with selected user
  }}
  placeholder="Tìm kiếm người dùng..."
  limit={10}
/>`}
              </pre>
            </div>

            <div>
              <h3
                className="font-medium mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                File Upload:
              </h3>
              <pre
                className="p-3 rounded text-xs overflow-x-auto"
                style={{
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-primary)',
                }}
              >
{`<FileUpload
  onUploadSuccess={(result) => {
    console.log('Uploaded:', result.url);
    // Send message with file URL, etc.
  }}
  onUploadError={(error) => {
    console.error('Error:', error);
  }}
  autoUpload={false} // or true for auto-upload
/>`}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DemoPage;

