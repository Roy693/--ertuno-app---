// ERTUNO Brand Theme System
export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main brand blue
    600: '#2563eb', // Darker brand blue
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Secondary Brand Colors (Orange/Amber for energy)
  secondary: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Main secondary
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Success (Green)
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Error (Red)
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Warning (Yellow)
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Neutral (Gray scale)
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  }
};

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace']
  },
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px  
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
  },
  fontWeight: {
    thin: '100',
    light: '300', 
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  }
};

export const spacing = {
  px: '1px',
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
  40: '10rem',    // 160px
  48: '12rem',    // 192px
  56: '14rem',    // 224px
  64: '16rem',    // 256px
};

export const borderRadius = {
  none: '0',
  sm: '0.125rem',    // 2px
  base: '0.25rem',   // 4px
  md: '0.375rem',    // 6px
  lg: '0.5rem',      // 8px
  xl: '0.75rem',     // 12px
  '2xl': '1rem',     // 16px
  '3xl': '1.5rem',   // 24px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  glow: '0 0 0 3px rgb(59 130 246 / 0.15)', // Primary glow
  glowSecondary: '0 0 0 3px rgb(245 158 11 / 0.15)', // Secondary glow
};

export const animations = {
  transition: {
    fast: '0.15s ease-out',
    normal: '0.25s ease-out', 
    slow: '0.35s ease-out',
  },
  
  // Custom CSS animations
  keyframes: {
    fadeIn: `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `,
    slideUp: `
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `,
    scaleIn: `
      @keyframes scaleIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
    `,
    bounce: `
      @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
          animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
          transform: translate3d(0, 0, 0);
        }
        40%, 43% {
          animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
          transform: translate3d(0, -30px, 0);
        }
        70% {
          animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
          transform: translate3d(0, -15px, 0);
        }
        90% {
          transform: translate3d(0, -4px, 0);
        }
      }
    `,
    pulse: `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    `
  }
};

// Component Styles System
export const components = {
  button: {
    base: `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: ${borderRadius.lg};
      font-weight: ${typography.fontWeight.medium};
      transition: all ${animations.transition.normal};
      cursor: pointer;
      border: none;
      text-decoration: none;
      gap: ${spacing[2]};
    `,
    
    sizes: {
      sm: `
        padding: ${spacing[2]} ${spacing[3]};
        font-size: ${typography.fontSize.sm};
        min-height: 2rem;
      `,
      md: `
        padding: ${spacing[3]} ${spacing[4]};
        font-size: ${typography.fontSize.base};
        min-height: 2.5rem;
      `,
      lg: `
        padding: ${spacing[4]} ${spacing[6]};
        font-size: ${typography.fontSize.lg};
        min-height: 3rem;
      `,
      xl: `
        padding: ${spacing[5]} ${spacing[8]};
        font-size: ${typography.fontSize.xl};
        min-height: 3.5rem;
      `
    },

    variants: {
      primary: `
        background-color: ${colors.primary[600]};
        color: white;
        &:hover {
          background-color: ${colors.primary[700]};
          transform: translateY(-2px);
          box-shadow: ${shadows.lg};
        }
        &:active {
          transform: translateY(0);
        }
      `,
      secondary: `
        background-color: ${colors.secondary[500]};
        color: white;
        &:hover {
          background-color: ${colors.secondary[600]};
          transform: translateY(-2px);
          box-shadow: ${shadows.lg};
        }
      `,
      outline: `
        background-color: transparent;
        border: 2px solid ${colors.primary[600]};
        color: ${colors.primary[600]};
        &:hover {
          background-color: ${colors.primary[600]};
          color: white;
          transform: translateY(-2px);
        }
      `,
      ghost: `
        background-color: transparent;
        color: ${colors.gray[700]};
        &:hover {
          background-color: ${colors.gray[100]};
          color: ${colors.gray[900]};
        }
      `,
      success: `
        background-color: ${colors.success[600]};
        color: white;
        &:hover {
          background-color: ${colors.success[700]};
          transform: translateY(-2px);
        }
      `,
      danger: `
        background-color: ${colors.error[600]};
        color: white;
        &:hover {
          background-color: ${colors.error[700]};
          transform: translateY(-2px);
        }
      `
    }
  },

  card: {
    base: `
      background-color: white;
      border-radius: ${borderRadius.xl};
      box-shadow: ${shadows.base};
      border: 1px solid ${colors.gray[200]};
      overflow: hidden;
      transition: all ${animations.transition.normal};
      
      &:hover {
        box-shadow: ${shadows.lg};
        transform: translateY(-4px);
      }
    `,
    
    variants: {
      elevated: `
        box-shadow: ${shadows.lg};
        
        &:hover {
          box-shadow: ${shadows.xl};
          transform: translateY(-6px);
        }
      `,
      bordered: `
        border: 2px solid ${colors.gray[200]};
        box-shadow: none;
        
        &:hover {
          border-color: ${colors.primary[300]};
          box-shadow: ${shadows.glow};
        }
      `,
      interactive: `
        cursor: pointer;
        
        &:hover {
          border-color: ${colors.primary[300]};
          box-shadow: ${shadows.glow};
          transform: translateY(-2px);
        }
        
        &:active {
          transform: scale(0.98);
        }
      `
    }
  },

  input: {
    base: `
      width: 100%;
      padding: ${spacing[3]} ${spacing[4]};
      border: 2px solid ${colors.gray[300]};
      border-radius: ${borderRadius.lg};
      font-size: ${typography.fontSize.base};
      transition: all ${animations.transition.normal};
      background-color: white;
      
      &:focus {
        outline: none;
        border-color: ${colors.primary[500]};
        box-shadow: ${shadows.glow};
      }
      
      &::placeholder {
        color: ${colors.gray[400]};
      }
      
      &:disabled {
        background-color: ${colors.gray[50]};
        color: ${colors.gray[400]};
        cursor: not-allowed;
      }
    `,
    
    variants: {
      error: `
        border-color: ${colors.error[500]};
        
        &:focus {
          border-color: ${colors.error[500]};
          box-shadow: 0 0 0 3px rgb(239 68 68 / 0.15);
        }
      `,
      success: `
        border-color: ${colors.success[500]};
        
        &:focus {
          border-color: ${colors.success[500]};
          box-shadow: 0 0 0 3px rgb(34 197 94 / 0.15);
        }
      `
    }
  }
};

// Dark mode theme
export const darkTheme = {
  colors: {
    ...colors,
    background: colors.gray[900],
    surface: colors.gray[800],
    text: {
      primary: colors.gray[100],
      secondary: colors.gray[300],
      muted: colors.gray[400]
    }
  }
};

// Responsive breakpoints
export const breakpoints = {
  xs: '475px',
  sm: '640px', 
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// CSS Custom Properties Helper
export const cssVars = `
  :root {
    --color-primary-50: ${colors.primary[50]};
    --color-primary-500: ${colors.primary[500]};
    --color-primary-600: ${colors.primary[600]};
    --color-primary-700: ${colors.primary[700]};
    --color-secondary-500: ${colors.secondary[500]};
    --color-secondary-600: ${colors.secondary[600]};
    --color-success-500: ${colors.success[500]};
    --color-error-500: ${colors.error[500]};
    --color-gray-100: ${colors.gray[100]};
    --color-gray-200: ${colors.gray[200]};
    --color-gray-600: ${colors.gray[600]};
    --color-gray-800: ${colors.gray[800]};
    --color-gray-900: ${colors.gray[900]};
    
    --font-size-base: ${typography.fontSize.base};
    --font-size-lg: ${typography.fontSize.lg};
    --font-size-xl: ${typography.fontSize.xl};
    
    --spacing-2: ${spacing[2]};
    --spacing-4: ${spacing[4]};
    --spacing-6: ${spacing[6]};
    
    --border-radius-lg: ${borderRadius.lg};
    --border-radius-xl: ${borderRadius.xl};
    
    --shadow-base: ${shadows.base};
    --shadow-lg: ${shadows.lg};
    
    --transition-normal: ${animations.transition.normal};
  }
`;

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  components,
  darkTheme,
  breakpoints,
  cssVars
};