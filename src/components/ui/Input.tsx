import React, { InputHTMLAttributes, ReactNode, useState } from 'react';
import { colors, spacing, typography, borderRadius, shadows } from '../../styles/theme';

type InputVariant = 'default' | 'error' | 'success';
type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  inputSize?: InputSize;
  label?: string;
  helperText?: string;
  errorText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  variant = 'default',
  inputSize = 'md',
  label,
  helperText,
  errorText,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const sizeStyles = {
    sm: {
      padding: `${spacing[2]} ${spacing[3]}`,
      fontSize: typography.fontSize.sm,
      minHeight: '2rem'
    },
    md: {
      padding: `${spacing[3]} ${spacing[4]}`,
      fontSize: typography.fontSize.base,
      minHeight: '2.5rem'
    },
    lg: {
      padding: `${spacing[4]} ${spacing[5]}`,
      fontSize: typography.fontSize.lg,
      minHeight: '3rem'
    }
  };

  const baseStyles: React.CSSProperties = {
    width: fullWidth ? '100%' : 'auto',
    border: `2px solid ${colors.gray[300]}`,
    borderRadius: borderRadius.lg,
    transition: 'all 0.25s ease-out',
    backgroundColor: 'white',
    fontFamily: typography.fontFamily.sans.join(', '),
    outline: 'none',
    ...sizeStyles[inputSize]
  };

  const variantStyles: React.CSSProperties = (() => {
    switch (variant) {
      case 'error':
        return {
          borderColor: colors.error[500],
        };
      case 'success':
        return {
          borderColor: colors.success[500],
        };
      default:
        return {};
    }
  })();

  const focusStyles: React.CSSProperties = focused ? {
    borderColor: variant === 'error' ? colors.error[500] : 
                 variant === 'success' ? colors.success[500] : 
                 colors.primary[500],
    boxShadow: variant === 'error' ? '0 0 0 3px rgb(239 68 68 / 0.15)' :
               variant === 'success' ? '0 0 0 3px rgb(34 197 94 / 0.15)' :
               shadows.glow
  } : {};

  const disabledStyles: React.CSSProperties = props.disabled ? {
    backgroundColor: colors.gray[50],
    color: colors.gray[400],
    cursor: 'not-allowed'
  } : {};

  const containerStyles: React.CSSProperties = {
    width: fullWidth ? '100%' : 'auto',
    position: 'relative'
  };

  const iconStyles: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    color: colors.gray[400],
    pointerEvents: 'none',
    zIndex: 1
  };

  const leftIconStyles: React.CSSProperties = {
    ...iconStyles,
    left: spacing[3]
  };

  const rightIconStyles: React.CSSProperties = {
    ...iconStyles,
    right: spacing[3]
  };

  const inputWithIconsStyles: React.CSSProperties = {
    ...baseStyles,
    ...variantStyles,
    ...focusStyles,
    ...disabledStyles,
    paddingLeft: leftIcon ? `calc(${spacing[4]} + 1.5rem)` : baseStyles.paddingLeft,
    paddingRight: rightIcon ? `calc(${spacing[4]} + 1.5rem)` : baseStyles.paddingRight
  };

  const labelStyles: React.CSSProperties = {
    display: 'block',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray[700],
    marginBottom: spacing[2]
  };

  const helperTextStyles: React.CSSProperties = {
    fontSize: typography.fontSize.sm,
    color: variant === 'error' ? colors.error[600] : colors.gray[500],
    marginTop: spacing[1]
  };

  return (
    <div style={containerStyles} className={className}>
      {label && (
        <label style={labelStyles}>
          {label}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        {leftIcon && (
          <div style={leftIconStyles}>
            {leftIcon}
          </div>
        )}
        
        <input
          {...props}
          style={inputWithIconsStyles}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
        />
        
        {rightIcon && (
          <div style={rightIconStyles}>
            {rightIcon}
          </div>
        )}
      </div>
      
      {(helperText || errorText) && (
        <div style={helperTextStyles}>
          {errorText || helperText}
        </div>
      )}
    </div>
  );
};

export default Input;