import React from 'react';
import { User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminHeader = () => {
    const { user } = useAuth();

    return (
        <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <h1 className="text-lg font-semibold text-gray-900">System Overview</h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 pl-4">
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
                        <p className="text-xs text-gray-500">{user?.email || 'admin@system.com'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white">
                        {user?.avatar_url ? (
                            <img
                                src={user.avatar_url}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <User className="w-5 h-5" />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
