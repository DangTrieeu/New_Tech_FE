import React from 'react';

const IconButton = ({
    children,
    onClick,
    type = 'button',
    size = 'medium',
    disabled = false,
    className = '',
    style = {},
    title = ''
}) => {
    const sizeStyles = {
        small: { padding: '0.375rem', fontSize: '1rem' },
        medium: { padding: '0.5rem', fontSize: '1.25rem' },
        large: { padding: '0.75rem', fontSize: '1.5rem' },
    };

    const baseStyles = {
        borderRadius: '0.5rem',
        backgroundColor: 'var(--hover-color)',
        color: 'var(--text-primary)',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sizeStyles[size],
    };

    const combinedStyles = {
        ...baseStyles,
        ...style,
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`hover:opacity-80 ${className}`}
            style={combinedStyles}
        >
            {children}
        </button>
    );
};

export default IconButton;
