import React from 'react';

const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    disabled = false,
    className = '',
    style = {}
}) => {
    const baseStyles = {
        padding: size === 'small' ? '0.5rem 1rem' : size === 'large' ? '0.75rem 2rem' : '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        fontWeight: '500',
        transition: 'all 0.2s',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        width: fullWidth ? '100%' : 'auto',
        border: 'none',
        outline: 'none',
    };

    const variantStyles = {
        primary: {
            backgroundColor: 'var(--primary-color)',
            color: '#ffffff',
        },
        secondary: {
            backgroundColor: 'var(--surface-color)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
        },
        danger: {
            backgroundColor: '#ef4444',
            color: '#ffffff',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--text-primary)',
        },
    };

    const combinedStyles = {
        ...baseStyles,
        ...variantStyles[variant],
        ...style,
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`transition-opacity hover:opacity-90 ${className}`}
            style={combinedStyles}
        >
            {children}
        </button>
    );
};

export default Button;
