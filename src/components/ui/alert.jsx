import * as React from 'react';
import { cn } from '@/lib/utils';

// Variant styles for the Alert component
const variantStyles = {
  default: 'bg-gray-100 text-gray-800 border-gray-300',
  destructive: 'bg-red-100 text-red-800 border-red-400',
};

const Alert = ({ variant = 'default', className, children, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-md border-l-4 p-4',
        variantStyles[variant] || variantStyles.default,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn('mb-1 font-semibold', className)}
    {...props}
  >
    {children}
  </h4>
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm', className)}
    {...props}
  >
    {children}
  </p>
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription }; 