import React from 'react';
import Card from '../components/atoms/Card/Card';
import FormField from '../components/molecules/FormField/FormField';
import Button from '../components/atoms/Button/Button';
import { Shield } from 'lucide-react';
import useAdminLogin from '../hooks/useAdminLogin';

const AdminLoginPage = () => {
  const {
    formData,
    error,
    loading,
    handleChange,
    handleSubmit
  } = useAdminLogin();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md" padding="p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Shield size={32}/>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Log in to manage the system.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@chatapp.com"
            required
          />

          <FormField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
