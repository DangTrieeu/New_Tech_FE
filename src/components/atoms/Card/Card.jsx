import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = 'p-6',
  shadow = true,
  hover = false,
  onClick 
}) => {
  const baseStyles = 'bg-white dark:bg-gray-800 rounded-lg transition-all duration-200';
  const shadowStyles = shadow ? 'shadow-md' : '';
  const hoverStyles = hover ? 'hover:shadow-lg cursor-pointer' : '';
  const clickableStyles = onClick ? 'cursor-pointer' : '';

  return (
    <div 
      className={`${baseStyles} ${shadowStyles} ${hoverStyles} ${clickableStyles} ${padding} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
