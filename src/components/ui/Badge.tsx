import React, { ReactNode } from 'react';
import { colors, spacing, typography, borderRadius } from '../../styles/theme';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  icon
}) => {
  const sizeStyles = {
    sm: {
      padding: `${spacing[1]} ${spacing[2]}`,
      fontSize: typography.fontSize.xs,
      gap: spacing[1]
    },
    md: {
      padding: `${spacing[2]} ${spacing[3]}`,
      fontSize: typography.fontSize.sm,
      gap: spacing[2]
    },
    lg: {
      padding: `${spacing[3]} ${spacing[4]}`,
      fontSize: typography.fontSize.base,
      gap: spacing[2]
    }
  };

  const variantStyles = {
    default: {
      backgroundColor: colors.gray[100],
      color: colors.gray[800],
      border: `1px solid ${colors.gray[200]}`
    },
    primary: {
      backgroundColor: colors.primary[100],
      color: colors.primary[800],
      border: `1px solid ${colors.primary[200]}`
    },
    secondary: {
      backgroundColor: colors.secondary[100],
      color: colors.secondary[800],
      border: `1px solid ${colors.secondary[200]}`
    },
    success: {
      backgroundColor: colors.success[100],
      color: colors.success[800],
      border: `1px solid ${colors.success[200]}`
    },
    warning: {
      backgroundColor: colors.warning[100],
      color: colors.warning[800],
      border: `1px solid ${colors.warning[200]}`
    },
    error: {
      backgroundColor: colors.error[100],
      color: colors.error[800],
      border: `1px solid ${colors.error[200]}`
    }
  };

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    fontWeight: typography.fontWeight.medium,
    whiteSpace: 'nowrap',
    fontFamily: typography.fontFamily.sans.join(', '),
    ...sizeStyles[size],
    ...variantStyles[variant]
  };

  return (
    <span style={baseStyles} className={`badge ${className}`}>
      {icon && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {icon}
        </span>
      )}
      {children}
    </span>
  );
};

export default Badge;