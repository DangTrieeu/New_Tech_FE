import React from 'react';

const Avatar = ({
    emoji = '👤',
    size = 'medium',
    online = false,
    className = '',
    style = {}
}) => {
    const sizeStyles = {
        small: { width: '2rem', height: '2rem', fontSize: '1rem' },
        medium: { width: '3rem', height: '3rem', fontSize: '1.5rem' },
        large: { width: '5rem', height: '5rem', fontSize: '2.5rem' },
    };

    const baseStyles = {
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--hover-color)',
        position: 'relative',
        ...sizeStyles[size],
    };

    const combinedStyles = {
        ...baseStyles,
        ...style,
    };

    const onlineIndicatorSize = size === 'small' ? '0.5rem' : size === 'large' ? '1rem' : '0.75rem';

    return (
        <div className={`relative ${className}`}>
            <div style={combinedStyles}>
                {emoji}
            </div>
            {online && (
                <div
                    className="absolute bottom-0 right-0 bg-green-500 rounded-full border-2"
                    style={{
                        width: onlineIndicatorSize,
                        height: onlineIndicatorSize,
                        borderColor: 'var(--surface-color)'
                    }}
                />
            )}
        </div>
    );
};

export default Avatar;
