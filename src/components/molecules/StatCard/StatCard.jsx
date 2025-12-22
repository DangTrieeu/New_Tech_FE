import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, iconColor, iconBgColor }) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${iconBgColor || 'bg-gray-100'}`}>
                    <Icon className={`w-6 h-6 ${iconColor || 'text-gray-600'}`} />
                </div>
            </div>
            <div>
                <p className="text-sm text-gray-500 mb-1">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
