import React from 'react';
import Card from '../Card/Card';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue,
  color = 'blue' 
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
    red: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
  };

  const trendColor = trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {trendValue && (
            <p className={`text-sm mt-2 ${trendColor}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
