import React from 'react';
import { AppNotification } from '@ecommerce/shared-types';

export interface ToastProps {
  notification: AppNotification;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
  const { id, message, type } = notification;

  const bgColors: Record<string, string> = {
    success: 'rgba(16, 185, 129, 0.95)',
    info: 'rgba(59, 130, 246, 0.95)',
    warning: 'rgba(245, 158, 11, 0.95)',
    error: 'rgba(239, 68, 68, 0.95)'
  };

  return (
    <div
      style={{
        backgroundColor: bgColors[type] || bgColors.info,
        color: '#ffffff',
        padding: '12px 18px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        fontSize: '0.9rem',
        fontWeight: 500,
        marginBottom: '10px',
        animation: 'slideIn 0.25s ease-out'
      }}
      role="alert"
    >
      <span>{message}</span>
      <button
        onClick={() => onClose(id)}
        style={{
          background: 'none',
          border: 'none',
          color: '#ffffff',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 'bold',
          lineHeight: 1,
          padding: '2px 6px'
        }}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};
