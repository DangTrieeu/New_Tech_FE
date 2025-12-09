import React from 'react';

const Badge = ({
    children,
    variant = 'primary',
    size = 'medium',
    className = '',
    style = {}
}) => {
    const sizeStyles = {
        small: { padding: '0.125rem 0.375rem', fontSize: '0.625rem' },
        medium: { padding: '0.125rem 0.5rem', fontSize: '0.75rem' },
        large: { padding: '0.25rem 0.625rem', fontSize: '0.875rem' },
    };

    const variantStyles = {
        primary: { backgroundColor: '#3b82f6', color: '#ffffff' },
        danger: { backgroundColor: '#ef4444', color: '#ffffff' },
        success: { backgroundColor: '#10b981', color: '#ffffff' },
        warning: { backgroundColor: '#f59e0b', color: '#ffffff' },
    };

    const baseStyles = {
        borderRadius: '9999px',
        fontWeight: '500',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sizeStyles[size],
        ...variantStyles[variant],
    };

    const combinedStyles = {
        ...baseStyles,
        ...style,
    };

    return (
        <span className={className} style={combinedStyles}>
            {children}
        </span>
    );
};

export default Badge;
