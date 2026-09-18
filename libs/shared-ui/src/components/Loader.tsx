import React from 'react';

export interface LoaderProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Loader: React.FC<LoaderProps> = ({ label = 'Loading...', size = 'md' }) => {
  const spinnerSize = size === 'sm' ? 20 : size === 'lg' ? 48 : 36;

  return (
    <div className="ui-loader-container" role="status" aria-live="polite">
      <div
        className="ui-spinner"
        style={{ width: `${spinnerSize}px`, height: `${spinnerSize}px` }}
      />
      {label && (
        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          {label}
        </span>
      )}
    </div>
  );
};
