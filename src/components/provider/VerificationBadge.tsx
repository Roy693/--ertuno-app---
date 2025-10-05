import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Award, 
  CheckCircle, 
  Users, 
  Star,
  AlertCircle,
  Clock
} from 'lucide-react';

export type VerificationType = 
  | 'identity'
  | 'license' 
  | 'insurance'
  | 'background'
  | 'premium'
  | 'elite'
  | 'topRated'
  | 'fastResponse';

interface VerificationBadgeProps {
  type: VerificationType;
  verified: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  tooltip?: string;
}

const badgeConfig: Record<VerificationType, {
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  description: string;
}> = {
  identity: {
    label: 'ID Verified',
    icon: Shield,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900',
    description: 'Identity has been verified through government-issued documents'
  },
  license: {
    label: 'Licensed',
    icon: Award,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    description: 'Professional license verified and up-to-date'
  },
  insurance: {
    label: 'Insured',
    icon: CheckCircle,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900',
    description: 'Liability insurance verified and active'
  },
  background: {
    label: 'Background Check',
    icon: Users,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900',
    description: 'Passed comprehensive background security check'
  },
  premium: {
    label: 'Premium Provider',
    icon: Star,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900',
    description: 'Premium subscription member with enhanced features'
  },
  elite: {
    label: 'Elite Provider',
    icon: Award,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900',
    description: 'Top-tier provider with exceptional ratings and performance'
  },
  topRated: {
    label: 'Top Rated',
    icon: Star,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100 dark:bg-pink-900',
    description: 'Consistently high customer ratings (4.8+ stars)'
  },
  fastResponse: {
    label: 'Quick Response',
    icon: Clock,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900',
    description: 'Typically responds within 15 minutes'
  }
};

const sizeConfig = {
  sm: {
    iconSize: 'w-3 h-3',
    padding: 'p-1',
    textSize: 'text-xs',
    spacing: 'space-x-1'
  },
  md: {
    iconSize: 'w-4 h-4',
    padding: 'p-2',
    textSize: 'text-sm',
    spacing: 'space-x-2'
  },
  lg: {
    iconSize: 'w-5 h-5',
    padding: 'p-3',
    textSize: 'text-base',
    spacing: 'space-x-2'
  }
};

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  type,
  verified,
  size = 'md',
  showLabel = true,
  tooltip
}) => {
  const config = badgeConfig[type];
  const sizeStyles = sizeConfig[size];
  
  if (!config) return null;

  const Icon = config.icon;
  const StatusIcon = verified ? CheckCircle : AlertCircle;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`
        inline-flex items-center rounded-lg border transition-all duration-200
        ${verified 
          ? `${config.bgColor} ${config.color} border-current` 
          : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-300 dark:border-gray-600'
        }
        ${sizeStyles.padding}
        ${sizeStyles.spacing}
      `}
      title={tooltip || config.description}
    >
      <Icon className={sizeStyles.iconSize} />
      {verified && (
        <StatusIcon className={`${sizeStyles.iconSize} ml-1`} />
      )}
      {showLabel && (
        <span className={`font-medium ${sizeStyles.textSize}`}>
          {config.label}
        </span>
      )}
    </motion.div>
  );
};

// Utility component for displaying multiple badges
interface VerificationBadgesProps {
  badges: Array<{
    type: VerificationType;
    verified: boolean;
  }>;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  maxDisplay?: number;
  layout?: 'horizontal' | 'vertical' | 'grid';
}

export const VerificationBadges: React.FC<VerificationBadgesProps> = ({
  badges,
  size = 'md',
  showLabels = true,
  maxDisplay,
  layout = 'horizontal'
}) => {
  const displayBadges = maxDisplay ? badges.slice(0, maxDisplay) : badges;
  const remainingCount = maxDisplay && badges.length > maxDisplay 
    ? badges.length - maxDisplay 
    : 0;

  const layoutClasses = {
    horizontal: 'flex flex-wrap gap-2',
    vertical: 'flex flex-col space-y-2',
    grid: 'grid grid-cols-2 gap-2'
  };

  return (
    <div className={layoutClasses[layout]}>
      {displayBadges.map((badge, index) => (
        <VerificationBadge
          key={`${badge.type}-${index}`}
          type={badge.type}
          verified={badge.verified}
          size={size}
          showLabel={showLabels}
        />
      ))}
      
      {remainingCount > 0 && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600"
        >
          +{remainingCount} more
        </motion.div>
      )}
    </div>
  );
};

// Provider verification status component
interface ProviderVerificationStatusProps {
  verificationStatus: {
    identityVerified: boolean;
    licenseVerified: boolean;
    insuranceVerified: boolean;
    backgroundCheckPassed: boolean;
  };
  subscriptionTier?: 'basic' | 'premium' | 'enterprise';
  averageRating?: number;
  responseTimeMinutes?: number;
  compact?: boolean;
}

export const ProviderVerificationStatus: React.FC<ProviderVerificationStatusProps> = ({
  verificationStatus,
  subscriptionTier,
  averageRating = 0,
  responseTimeMinutes = 60,
  compact = false
}) => {
  const badges: Array<{ type: VerificationType; verified: boolean }> = [
    { type: 'identity', verified: verificationStatus.identityVerified },
    { type: 'license', verified: verificationStatus.licenseVerified },
    { type: 'insurance', verified: verificationStatus.insuranceVerified },
    { type: 'background', verified: verificationStatus.backgroundCheckPassed }
  ];

  // Add subscription tier badges
  if (subscriptionTier === 'premium') {
    badges.push({ type: 'premium', verified: true });
  } else if (subscriptionTier === 'enterprise') {
    badges.push({ type: 'elite', verified: true });
  }

  // Add performance badges
  if (averageRating >= 4.8) {
    badges.push({ type: 'topRated', verified: true });
  }

  if (responseTimeMinutes <= 15) {
    badges.push({ type: 'fastResponse', verified: true });
  }

  if (compact) {
    return (
      <VerificationBadges
        badges={badges}
        size="sm"
        showLabels={false}
        maxDisplay={4}
        layout="horizontal"
      />
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center">
        <Shield className="w-5 h-5 mr-2 text-green-600" />
        Verification & Credentials
      </h3>
      
      <VerificationBadges
        badges={badges}
        size="md"
        showLabels={true}
        layout="grid"
      />
      
      {/* Verification Score */}
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="font-medium">Verification Score:</span>
          <div className="flex items-center">
            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-3">
              <div 
                className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(badges.filter(b => b.verified).length / badges.length) * 100}%` 
                }}
              />
            </div>
            <span className="font-bold text-primary-600">
              {Math.round((badges.filter(b => b.verified).length / badges.length) * 100)}%
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {badges.filter(b => b.verified).length} of {badges.length} verifications completed
        </p>
      </div>
    </div>
  );
};