import * as React from 'react';
import { cn } from '@/lib/utils';

// Define variant styles for Badge
const variantStyles = {
  default: 'bg-gray-100 text-gray-800',
  destructive: 'bg-red-100 text-red-800',
  success: 'bg-green-100 text-green-800',
};

const Badge = React.forwardRef(({ className, variant = 'default', children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
      variantStyles[variant] || variantStyles.default,
      className
    )}
    {...props}
  >
    {children}
  </span>
));
Badge.displayName = 'Badge';

export { Badge }; 