import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  return (
    <span className={`ui-badge ui-badge-${variant} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
};
