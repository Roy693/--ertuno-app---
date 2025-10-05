import React from 'react';
import { colors, spacing, typography, borderRadius } from '../../styles/theme';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  fallback?: string;
  className?: string;
  online?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  fallback,
  className = '',
  online
}) => {
  const sizeStyles = {
    xs: { width: '1.5rem', height: '1.5rem', fontSize: typography.fontSize.xs },
    sm: { width: '2rem', height: '2rem', fontSize: typography.fontSize.sm },
    md: { width: '2.5rem', height: '2.5rem', fontSize: typography.fontSize.base },
    lg: { width: '3rem', height: '3rem', fontSize: typography.fontSize.lg },
    xl: { width: '4rem', height: '4rem', fontSize: typography.fontSize.xl },
    '2xl': { width: '5rem', height: '5rem', fontSize: typography.fontSize['2xl'] }
  };

  const baseStyles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[200],
    color: colors.gray[600],
    fontWeight: typography.fontWeight.medium,
    overflow: 'hidden',
    flexShrink: 0,
    ...sizeStyles[size]
  };

  const imageStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  const onlineIndicatorStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: size === 'xs' || size === 'sm' ? '0.5rem' : '0.75rem',
    height: size === 'xs' || size === 'sm' ? '0.5rem' : '0.75rem',
    backgroundColor: colors.success[500],
    borderRadius: borderRadius.full,
    border: `2px solid white`
  };

  const generateFallbackText = (text: string): string => {
    if (!text) return '?';
    
    const words = text.trim().split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    
    return text.substring(0, 2).toUpperCase();
  };

  return (
    <div style={baseStyles} className={`avatar ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          style={imageStyles}
          onError={(e) => {
            // Hide image on error to show fallback
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <span>{generateFallbackText(fallback || alt || '')}</span>
      )}
      
      {online && (
        <div style={onlineIndicatorStyles} />
      )}
    </div>
  );
};

interface AvatarGroupProps {
  children: React.ReactElement<AvatarProps>[];
  max?: number;
  className?: string;
  size?: AvatarSize;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  max = 3,
  className = '',
  size = 'md'
}) => {
  const visibleAvatars = children.slice(0, max);
  const remainingCount = Math.max(0, children.length - max);

  const groupStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center'
  };

  const avatarWrapperStyles: React.CSSProperties = {
    marginLeft: size === 'xs' || size === 'sm' ? '-0.5rem' : '-0.75rem',
    border: '2px solid white',
    borderRadius: borderRadius.full
  };

  const firstAvatarStyles: React.CSSProperties = {
    marginLeft: 0,
    border: '2px solid white',
    borderRadius: borderRadius.full
  };

  const remainingStyles: React.CSSProperties = {
    marginLeft: size === 'xs' || size === 'sm' ? '-0.5rem' : '-0.75rem',
    border: '2px solid white',
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
    color: colors.gray[600],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size === 'xs' ? typography.fontSize.xs : typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium
  };

  return (
    <div style={groupStyles} className={`avatar-group ${className}`}>
      {visibleAvatars.map((child, index) => (
        <div 
          key={index} 
          style={index === 0 ? firstAvatarStyles : avatarWrapperStyles}
        >
          {React.cloneElement(child, { size })}
        </div>
      ))}
      
      {remainingCount > 0 && (
        <Avatar
          size={size}
          fallback={`+${remainingCount}`}
          className={className}
        />
      )}
    </div>
  );
};

export default Avatar;