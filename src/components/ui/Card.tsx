import React, { ReactNode } from 'react';
import { components, colors, spacing, typography, borderRadius, shadows } from '../../styles/theme';

type CardVariant = 'default' | 'elevated' | 'bordered' | 'interactive';

interface CardProps {
  variant?: CardVariant;
  padding?: keyof typeof spacing;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = '6',
  children,
  className = '',
  onClick,
  hover = true
}) => {
  const baseStyles: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: borderRadius.xl,
    boxShadow: shadows.base,
    border: `1px solid ${colors.gray[200]}`,
    overflow: 'hidden',
    transition: 'all 0.25s ease-out',
    cursor: onClick ? 'pointer' : 'default'
  };

  const variantStyles: React.CSSProperties = (() => {
    switch (variant) {
      case 'elevated':
        return {
          boxShadow: shadows.lg,
        };
      case 'bordered':
        return {
          border: `2px solid ${colors.gray[200]}`,
          boxShadow: 'none',
        };
      case 'interactive':
        return {
          cursor: 'pointer',
        };
      default:
        return {};
    }
  })();

  const hoverStyles: React.CSSProperties = hover ? {
    ':hover': {
      boxShadow: variant === 'elevated' ? shadows.xl : shadows.lg,
      transform: variant === 'interactive' ? 'translateY(-2px)' : 'translateY(-4px)',
      borderColor: variant === 'bordered' || variant === 'interactive' ? colors.primary[300] : undefined
    }
  } : {};

  const paddingStyle = {
    padding: spacing[padding]
  };

  return (
    <div
      style={{
        ...baseStyles,
        ...variantStyles,
        ...paddingStyle
      }}
      className={`card-component ${className}`}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = variant === 'elevated' ? shadows.xl : shadows.lg;
          e.currentTarget.style.transform = variant === 'interactive' ? 'translateY(-2px)' : 'translateY(-4px)';
          if (variant === 'bordered' || variant === 'interactive') {
            e.currentTarget.style.borderColor = colors.primary[300];
          }
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = variant === 'elevated' ? shadows.lg : shadows.base;
          e.currentTarget.style.transform = 'translateY(0)';
          if (variant === 'bordered' || variant === 'interactive') {
            e.currentTarget.style.borderColor = colors.gray[200];
          }
        }
      }}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div 
    style={{
      padding: `${spacing[4]} ${spacing[6]}`,
      borderBottom: `1px solid ${colors.gray[200]}`
    }}
    className={`card-header ${className}`}
  >
    {children}
  </div>
);

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => (
  <div 
    style={{
      padding: spacing[6]
    }}
    className={`card-body ${className}`}
  >
    {children}
  </div>
);

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
  <div 
    style={{
      padding: `${spacing[4]} ${spacing[6]}`,
      borderTop: `1px solid ${colors.gray[200]}`,
      backgroundColor: colors.gray[50]
    }}
    className={`card-footer ${className}`}
  >
    {children}
  </div>
);

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => (
  <h3 
    style={{
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semibold,
      color: colors.gray[900],
      margin: 0,
      lineHeight: '1.5'
    }}
    className={`card-title ${className}`}
  >
    {children}
  </h3>
);

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className = '' }) => (
  <p 
    style={{
      fontSize: typography.fontSize.sm,
      color: colors.gray[600],
      margin: `${spacing[2]} 0 0 0`,
      lineHeight: '1.5'
    }}
    className={`card-description ${className}`}
  >
    {children}
  </p>
);

export default Card;